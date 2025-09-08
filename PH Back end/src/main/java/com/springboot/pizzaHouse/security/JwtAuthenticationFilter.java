package com.springboot.pizzaHouse.security;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.springboot.pizzaHouse.config.CustomUserDetailsService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomUserDetailsService uds;

    @SuppressWarnings("null")
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // Skipping JWT validation for login and register endpoints
        String path = request.getRequestURI();
        List<String> skipPaths = List.of(SecurityConstants.LOGIN_URL, SecurityConstants.SIGN_UP_URL, SecurityConstants.FORGOT_PASSWORD_URL, SecurityConstants.RESET_PASSWORD_URL);
        if (skipPaths.stream().anyMatch(path::startsWith)) {
            filterChain.doFilter(request, response);
            return;
        }

        // Proceeding other requests with JWT authentication
        String authHeader = request.getHeader(SecurityConstants.AUTH_HEADER);
        String token = null;
        String username = null;

        if (authHeader != null && authHeader.startsWith(SecurityConstants.BEARER_PREFIX)) {
            token = authHeader.substring(7);
            username = jwtUtil.extractUsername(token);
        }

        if (authHeader == null || !authHeader.startsWith(SecurityConstants.BEARER_PREFIX)) {
            filterChain.doFilter(request, response);
            return;
        }

        try {            
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = uds.loadUserByUsername(username);
                if (jwtUtil.isTokenValid(token, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    if(request.getAttribute("email") == null) {
                        request.setAttribute("email", username);
                    }
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        }catch (Exception e) {
            // Handle any exceptions that may occur during token processing
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
            throw new BadCredentialsException("invalid token...");
        }


        filterChain.doFilter(request, response);
    }
}
