package com.springboot.pizzaHouse.model.response;

import com.springboot.pizzaHouse.dto.UserDTO;

public class LoginResponse {
    private String token;
    private String role;
    private UserDTO user;
    public LoginResponse(String token, String role, UserDTO user) {
        this.token = token;
        this.role = role;
        this.user = user;
    }
    public String getToken() {
        return token;
    }
    public void setToken(String token) {
        this.token = token;
    }
    public String getRole() {
        return role;
    }
    public void setRole(String role) {
        this.role = role;
    }
    public UserDTO getUser() {
        return user;
    }
    public void setUser(UserDTO user) {
        this.user = user;
    }
    
}

