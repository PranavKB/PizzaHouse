package com.springboot.pizzaHouse.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.springboot.pizzaHouse.dto.UserDTO;
import com.springboot.pizzaHouse.exception.ResourceNotFoundException;
import com.springboot.pizzaHouse.exception.UserNotFoundException;
import com.springboot.pizzaHouse.model.UserType;
import com.springboot.pizzaHouse.services.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
@Validated

public class UserController {
    
    @Autowired
	UserService userService ;


    @GetMapping(value = "/allUsers", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        //logger.debug("Fetching all users");
        List<UserDTO> users = userService.getAllUsers();
        
        if (users == null || users.isEmpty()) {
            throw new UserNotFoundException("No users found.");
        }
        
        return ResponseEntity.ok(users);
    }

    @GetMapping(value = "/userTypes", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<UserType>> getAllUserTypes() {
        List<UserType> userTypes = userService.getAllUserTypesList();
        
        if (userTypes == null || userTypes.isEmpty()) {
            throw new ResourceNotFoundException("No user types found.");
        }
        
        return ResponseEntity.ok(userTypes);
    }
}
