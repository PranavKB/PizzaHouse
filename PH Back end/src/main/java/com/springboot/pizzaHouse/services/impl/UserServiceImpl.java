package com.springboot.pizzaHouse.services.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.springboot.pizzaHouse.dto.UserDTO;
import com.springboot.pizzaHouse.exception.InvalidUserTypeException;
import com.springboot.pizzaHouse.exception.UserAlreadyExistsException;
import com.springboot.pizzaHouse.exception.UserNotFoundException;
import com.springboot.pizzaHouse.model.User;
import com.springboot.pizzaHouse.model.UserType;
import com.springboot.pizzaHouse.model.PasswordResetToken;
import com.springboot.pizzaHouse.model.request.UserRequest;
import com.springboot.pizzaHouse.repository.PasswordResetTokenRepository;
import com.springboot.pizzaHouse.repository.UserRepository;
import com.springboot.pizzaHouse.repository.UserTypeRepository;
import com.springboot.pizzaHouse.security.JwtUtil;
import com.springboot.pizzaHouse.services.UserService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service("UserService")
@Transactional
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserTypeRepository userTypeRepository;
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtil;
    private final PasswordResetTokenRepository passwordResetTokenRepository;


    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

    private UserDTO mapToDTO(User user) {
        UserType userType = userTypeRepository.findById(user.getUserType().getId())
                .orElseThrow(() -> new RuntimeException("Invalid user type"));
        return new UserDTO( user.getEmail(), user.getName(), user.getUserName(), userType.getName());
    }

    @Transactional(readOnly = true)
    @Override
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public UserDTO getUserByEmail(String email) {
        logger.info("Fetching user by email: {}", email);
        return userRepository.findByEmail(email)
            .map(this::mapToDTO)
            .orElseThrow(() -> new UserNotFoundException("User not found"));

    }

    @Override
    public User getUserUsingEmail(String email) {
        logger.info("Fetching user by email: {}", email);
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new UserNotFoundException("User not found"));

    }

    @Override
    public UserDTO getUserById(String userId) {
        return userRepository.findById(userId)
            .map(this::mapToDTO)
            .orElseThrow(() -> new UserNotFoundException("User not found"));
    }

    @Override
    public boolean doesUserExist(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public User saveUser(User user) {
        return userRepository.save(user);
    }


/* 
    public User validateLogin(User loggedUser) throws Exception {
        String email = loggedUser.getEmail();
        try{
            User existingUser = userRepository.findById(email).orElse(null);
            if (existingUser == null) {
                System.out.println("Login failed - User with email " + email + " does not exist.");
                throw new Exception("User with email " + email + " does not exist.");
            }
            boolean isPasswordValid = Password.check(loggedUser.getPassword(), existingUser.getPassword());
            
            if (!isPasswordValid) {
                    throw new Exception("Invalid password for user: " + email);
                }
            System.out.println("Login successful for user: " + email);
            return existingUser;
        } catch (Exception e) {
            System.out.println("Error occurred during login validation: " + e.getMessage());
            throw new Exception("Error occurred during login validation: " + e.getMessage());
        }
    }
     */

    @Override
    public UserDTO registerUser(UserRequest req) throws UserAlreadyExistsException {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new UserAlreadyExistsException("Email already registered.");
        }

        User user = new User();
        user.setEmail(req.getEmail());
        user.setName(req.getName());
        user.setUserName(req.getUserName());
        user.setAddress(req.getAddress());
        user.setCity(req.getCity());
        user.setState(req.getState());
        user.setMobileNum(req.getMobileNum());
        user.setPincode(req.getPincode());
        user.setPassword(encoder.encode(req.getPassword()));

        UserType userType = userTypeRepository.findById(req.getUserTypeId())
                .orElseThrow(() -> new InvalidUserTypeException("Invalid user type."));
        user.setUserType(userType);

        userRepository.save(user);

        return new UserDTO(user); // Assumes constructor exists
    }

    @Override
    public List<UserType> getAllUserTypesList() {
        return userTypeRepository.findAll();
    }

    @Override
    public String getEmailFromRequest(HttpServletRequest request) {

        String emailAttr = (String) request.getAttribute("email");
        if(emailAttr == null) emailAttr = jwtUtil.extractEmailFromRequest(request);
        if(emailAttr == null){
            emailAttr = "dummy1@pizzahouse.com";    //can use JWTUtil.getEmailFromToken
        }
        return emailAttr;
    }

    @Override
    public String createPasswordResetTokenForUser(User user) {
        // Delete any existing token for this user
        passwordResetTokenRepository.findByUser(user)
            .ifPresent(token -> {
                passwordResetTokenRepository.delete(token);
                passwordResetTokenRepository.flush(); // Ensure delete hits DB
            });

        // Create new token
        String token = UUID.randomUUID().toString();
        PasswordResetToken passwordResetToken = new PasswordResetToken(
            token,
            user,
            LocalDateTime.now().plusHours(24) // Token valid for 24 hours
        );

        passwordResetTokenRepository.save(passwordResetToken);
        return token;
    }


    @Override
    public boolean validatePasswordResetToken(String token) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
            .orElse(null);

        if (resetToken == null || resetToken.isExpired()) {
            return false;
        }

        return true;
    }

    @Override
    public void changeUserPassword(User user, String password) {
        user.setPassword(encoder.encode(password));
        userRepository.save(user);

        // Delete the used token
        passwordResetTokenRepository.deleteByUser(user);
    }
}
