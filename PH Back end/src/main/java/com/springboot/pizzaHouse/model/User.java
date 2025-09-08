package com.springboot.pizzaHouse.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;


@Entity
@Table(name="users", schema = "pizzahouse")
public class User {
    
    @Id         
    @Column(nullable = false, unique = true)
	private String email ;
    @Column(nullable = false)
	private String password ; 
    private int userId ;
	private String  mobileNum ;
	private String address ;
	private String pincode ;
	private String name ;    
	private String userName ;
    private String city ;
    private String state ;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_type_id", referencedColumnName = "user_type_id")
    private UserType userType;

    public User(String name, String userName) {
        this.name = name;
        this.userName = userName;
        applyFallbackName(); 
    }

    private void applyFallbackName() {
        if (this.name == null && this.userName != null) {
            this.name = this.userName;
        }
    }

    public User() {
        
    }
  
    public User(String email, String mobileNum, String address, String pincode, String name, String userName,
            String city, String state, UserType userType) {
        this.email = email;
        this.mobileNum = mobileNum;
        this.address = address;
        this.pincode = pincode;
        this.name = name;
        this.userName = userName;
        this.city = city;
        this.state = state;
        this.userType = userType;
    }

    public int getUserId() {
        return userId;
    }
    public void setUserId(int userId) {
        this.userId = userId;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public String getMobileNum() {
        return mobileNum;
    }
    public void setMobileNum(String mobileNum) {
        this.mobileNum = mobileNum;
    }    
    public UserType getUserType() {
        return userType;
    }
    public void setUserType(UserType userType) {
        this.userType = userType;
    }
    public String getAddress() {
        return address;
    }
    public void setAddress(String address) {
        this.address = address;
    }
    public String getPincode() {
        return pincode;
    }
    public void setPincode(String pincode) {
        this.pincode = pincode;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getCity() {
        return city;
    }
    public void setCity(String city) {
        this.city = city;
    }
    public String getState() {
        return state;
    }
    public void setState(String state) {
        this.state = state;
    }
    public String getUserName() {
        return userName;
    }
    public void setUserName(String userName) {
        this.userName = userName;
    }
    @Override
    public String toString() {
        return "User [userId=" + userId + ", email=" + email + ", password=" + password + ", mobileNum=" + mobileNum
                + ", userType=" + userType + ", address=" + address + ", pincode=" + pincode + ", userName=" + userName
                + ", city=" + city + ", state=" + state + "]";
    }
    
    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + userId;
        result = prime * result + ((email == null) ? 0 : email.hashCode());
        result = prime * result + ((password == null) ? 0 : password.hashCode());
        result = prime * result + ((mobileNum == null) ? 0 : mobileNum.hashCode());
        result = prime * result + ((address == null) ? 0 : address.hashCode());
        result = prime * result + ((pincode == null) ? 0 : pincode.hashCode());
        result = prime * result + ((name == null) ? 0 : name.hashCode());
        result = prime * result + ((userName == null) ? 0 : userName.hashCode());
        result = prime * result + ((city == null) ? 0 : city.hashCode());
        result = prime * result + ((state == null) ? 0 : state.hashCode());
        result = prime * result + ((userType == null) ? 0 : userType.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        User other = (User) obj;
        if (userId != other.userId)
            return false;
        if (email == null) {
            if (other.email != null)
                return false;
        } else if (!email.equals(other.email))
            return false;
        if (password == null) {
            if (other.password != null)
                return false;
        } else if (!password.equals(other.password))
            return false;
        if (mobileNum == null) {
            if (other.mobileNum != null)
                return false;
        } else if (!mobileNum.equals(other.mobileNum))
            return false;
        if (address == null) {
            if (other.address != null)
                return false;
        } else if (!address.equals(other.address))
            return false;
        if (pincode == null) {
            if (other.pincode != null)
                return false;
        } else if (!pincode.equals(other.pincode))
            return false;
        if (name == null) {
            if (other.name != null)
                return false;
        } else if (!name.equals(other.name))
            return false;
        if (userName == null) {
            if (other.userName != null)
                return false;
        } else if (!userName.equals(other.userName))
            return false;
        if (city == null) {
            if (other.city != null)
                return false;
        } else if (!city.equals(other.city))
            return false;
        if (state == null) {
            if (other.state != null)
                return false;
        } else if (!state.equals(other.state))
            return false;
        if (userType == null) {
            if (other.userType != null)
                return false;
        } else if (!userType.equals(other.userType))
            return false;
        return true;
    }

}
