package com.springboot.pizzaHouse.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.springboot.pizzaHouse.config.TokenBlacklistService;
import com.springboot.pizzaHouse.dto.UserDTO;
import com.springboot.pizzaHouse.model.Password;
import com.springboot.pizzaHouse.model.User;
import com.springboot.pizzaHouse.model.request.ForgotPasswordRequest;
import com.springboot.pizzaHouse.model.request.LoginRequest;
import com.springboot.pizzaHouse.model.request.ResetPasswordRequest;
import com.springboot.pizzaHouse.model.request.UserRequest;
import com.springboot.pizzaHouse.model.response.LoginResponse;
import com.springboot.pizzaHouse.repository.UserRepository;
import com.springboot.pizzaHouse.security.JwtUtil;
import com.springboot.pizzaHouse.security.SecurityConstants;
import com.springboot.pizzaHouse.services.UserService;
import com.springboot.pizzaHouse.services.EmailService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

     @Autowired
    private JwtUtil jwtTokenProvider;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private TokenBlacklistService tokenBlacklistService;

    @Autowired
    private EmailService emailService;

    @Value("${app.frontend-url}")
    private String frontEndUrl;
    
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) throws UsernameNotFoundException, BadCredentialsException {

        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequest.getEmail(), loginRequest.getPassword()
            )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = jwtTokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String role = user.getUserType().getName();

        return ResponseEntity.ok(new LoginResponse(token, role, new UserDTO(user)));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserRequest userRequest) throws Exception {

        String email = userRequest.getEmail();

        if (userService.doesUserExist(email)) {
            logger.warn("Registration failed - User with email {} already exists", email);
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Registration failed - User with email - " + email + " already exists");
        }

        // Validate password strength
        if (!Password.isValidPassword(userRequest.getPassword())) {
            logger.warn("Password validation failed for user: {}", email);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Password does not meet the required criteria.");
        }

        try {
            UserDTO createdUser = userService.registerUser(userRequest);
            logger.info("User registered successfully: {}", createdUser.getEmail());
            emailService.sendWelcomeEmail(createdUser.getEmail(), createdUser.getName());
            return ResponseEntity.status(HttpStatus.CREATED).body(createdUser.getEmail());
        } catch (Exception e) {
            logger.error("Registration failed for email {}: {}", email, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Registration failed for email - " + email + ": " + e.getMessage());
        }
    }

    @PostMapping(value = "/logout", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> logout(HttpServletRequest request) {
         String authHeader = request.getHeader(SecurityConstants.AUTH_HEADER);

        if (authHeader != null && authHeader.startsWith(SecurityConstants.BEARER_PREFIX)) {
            String token = authHeader.substring(7);
            tokenBlacklistService.blacklistToken(token); // Invalidate token
            logger.info("Token blacklisted. User logged out.");
            return ResponseEntity.ok("Logged out successfully.");
        }

        logger.warn("Logout failed: Missing or invalid Authorization header.");
        return ResponseEntity.badRequest().body("Missing or invalid Authorization header.");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        try {
            String email = request.getEmail();
            User user = userRepository.findByEmail(email)
                .orElse(null);

            if (user == null) {
                logger.warn("Forgot password request failed - User not found: {}", email);
                // For security reasons, don't reveal that the user doesn't exist
                return ResponseEntity.ok("If your email exists in our system, you will receive a password reset link shortly.");
            }

            String token = userService.createPasswordResetTokenForUser(user);
            String resetLink = frontEndUrl + "/reset-password?token=" + token;
            emailService.sendPasswordResetEmail(user.getEmail(), token);

            logger.info("Password reset token generated for user: {}", email);
            return ResponseEntity.ok("If your email exists in our system, you will receive a password reset link shortly.");
        } catch (Exception e) {
            logger.error("Error processing forgot password request: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing forgot password request.");
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        try {
            // Validate password strength
            if (!Password.isValidPassword(request.getNewPassword())) {
                logger.warn("Password validation failed for reset request");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Password does not meet the required criteria.");
            }

            // Validate token
            if (!userService.validatePasswordResetToken(request.getToken())) {
                logger.warn("Invalid or expired password reset token");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Invalid or expired password reset token.");
            }

            // Get user from token
            User user = userRepository.findUserByPasswordResetToken(request.getToken())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            // Change password
            userService.changeUserPassword(user, request.getNewPassword());

            logger.info("Password successfully reset for user: {}", user.getEmail());
            return ResponseEntity.ok("Password has been reset successfully.");
        } catch (UsernameNotFoundException e) {
            logger.error("User not found for password reset token");
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found.");
        } catch (Exception e) {
            logger.error("Error resetting password: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error resetting password.");
        }
    }
}

