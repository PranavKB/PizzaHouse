package com.springboot.pizzaHouse.model.request;

public class UserRequest {
    // incoming request from user
    private String name;
    private String email;
    private String password;
    private String address;

    private String  mobileNum ;
	private String pincode ; 
	private String userName ;
    private String city ;
    private String state ;
    private Integer userTypeId;
    
    public String getName() {
        return name;
    }
    public String getEmail() {
        return email;
    }
    public String getPassword() {
        return password;
    }
    public String getAddress() {
        return address;
    }    
    public String getMobileNum() {
        return mobileNum;
    }
    public String getPincode() {
        return pincode;
    }
    public String getUserName() {
        return userName;
    }
    public String getCity() {
        return city;
    }
    public String getState() {
        return state;
    }
    public Integer getUserTypeId() {
        return userTypeId;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public UserRequest() {
    }
    public void setName(String name) {
        this.name = name;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public void setAddress(String address) {
        this.address = address;
    }
    public void setMobileNum(String mobileNum) {
        this.mobileNum = mobileNum;
    }
    public void setPincode(String pincode) {
        this.pincode = pincode;
    }
    public void setUserName(String userName) {
        this.userName = userName;
    }
    public void setCity(String city) {
        this.city = city;
    }
    public void setState(String state) {
        this.state = state;
    }
    public void setUserTypeId(Integer userTypeId) {
        this.userTypeId = userTypeId;
    }
    

    
}
