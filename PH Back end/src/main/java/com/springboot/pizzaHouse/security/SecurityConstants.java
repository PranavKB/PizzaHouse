package com.springboot.pizzaHouse.security;

public class SecurityConstants {

    //JWT secret and expiration time in properties file

     public static final String SIGN_UP_URL = "/api/v1/auth/register";
     public static final String LOGIN_URL = "/api/v1/auth/login";
     public static final String FORGOT_PASSWORD_URL = "/api/v1/auth/forgot-password";
     public static final String RESET_PASSWORD_URL = "/api/v1/auth/reset-password";

     public static final String AUTH_HEADER = "Authorization";
     public static final String BEARER_PREFIX = "Bearer ";

     public static final String EMAIL_STRING = "email";
}
