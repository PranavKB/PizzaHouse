package com.springboot.pizzaHouse.services;

import java.util.List;

import com.springboot.pizzaHouse.dto.UserDTO;
import com.springboot.pizzaHouse.model.User;
import com.springboot.pizzaHouse.model.UserType;
import com.springboot.pizzaHouse.model.request.UserRequest;

import jakarta.servlet.http.HttpServletRequest;

public interface UserService {
    User saveUser(User user);
    UserDTO getUserByEmail(String email);
    User getUserUsingEmail(String email);
    boolean doesUserExist(String email);
    
    List<UserDTO> getAllUsers();
    UserDTO registerUser(UserRequest req) throws Exception;
    List<UserType> getAllUserTypesList();

    String getEmailFromRequest(HttpServletRequest request);

    String createPasswordResetTokenForUser(User user);

    boolean validatePasswordResetToken(String token);

    void changeUserPassword(User user, String password);

}
