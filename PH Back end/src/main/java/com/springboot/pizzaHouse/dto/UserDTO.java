package com.springboot.pizzaHouse.dto;

import com.springboot.pizzaHouse.model.User;

import jakarta.validation.constraints.Email;

public class UserDTO {
    
    @Email
    private String email;
    //private int userType;
    private String address;
    private String pincode;
    private String name;
    private String userName;
    private String role;

    public UserDTO( String name, String email,  String address) {
        this.email = email;
        this.address = address;
        this.name = name;
    }    

    public UserDTO(String email, String name, String userName, String role) {
        this.email = email;
        this.name = name;
        this.userName = userName;
        this.role = role;
    } 

    public UserDTO(User user) {
        this.email = user.getEmail();
        this.address = user.getAddress();
        this.pincode = user.getPincode();
        this.name = user.getName();
        this.userName = user.getUserName();
        this.role = user.getUserType().getName();
    }

    public String getEmail() {
        return email;
    }

    public String getAddress() {
        return address;
    }

    public String getPincode() {
        return pincode;
    }

    public String getName() {
        return name;
    }

    public String getUserName() {
        return userName;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setPincode(String pincode) {
        this.pincode = pincode;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    
    
}