package com.springboot.pizzaHouse.model.response;

public class UserResponse {
    private String userName;
    private String email;
    private String userTypeName;


    public UserResponse() {
    }
    public UserResponse(String userName, String email, String userTypeName) {
        this.userName = userName;
        this.email = email;
        this.userTypeName = userTypeName;
    }
    public String getUserName() {
        return userName;
    }
    public void setUserName(String userName) {
        this.userName = userName;
    }
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUserTypeName() {
        return userTypeName;
    }

    public void setUserTypeName(String userTypeName) {
        this.userTypeName = userTypeName;
    }
}
