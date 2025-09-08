package com.springboot.pizzaHouse.services.impl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;

import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.springboot.pizzaHouse.dto.UserDTO;
import com.springboot.pizzaHouse.model.User;
import com.springboot.pizzaHouse.model.UserType;
import com.springboot.pizzaHouse.model.request.UserRequest;
import com.springboot.pizzaHouse.repository.UserRepository;
import com.springboot.pizzaHouse.repository.UserTypeRepository;

@ExtendWith(MockitoExtension.class)
public class UserServiceImplTest {

    @Mock
    private UserRepository userRepo;

    @Mock
    private UserTypeRepository userTypeRepo;

    @Mock
    private PasswordEncoder encoder;

    @InjectMocks
    private UserServiceImpl userService;

    @Test
    public void testCreateUser() {
        // Mock request input
        UserRequest req = new UserRequest();
        req.setName("John");
        req.setEmail("john@example.com");
        req.setAddress("123 St");
        req.setMobileNum("1123569878");
        req.setPincode("900009");
        req.setUserName("john_username");
        req.setCity("City1");
        req.setState("State1");
        req.setPassword("plainPassword");
        req.setUserTypeId(3); // customer

        // Mock dependencies
        UserType mockUserType = new UserType();
        mockUserType.setId(3);
        mockUserType.setName("CUSTOMER");
        mockUserType.setDescription("The Customers");

        when(userTypeRepo.findById(3)).thenReturn(Optional.of(mockUserType));
        when(encoder.encode("plainPassword")).thenReturn("hashedPassword");

        User mockSavedUser = new User();
        mockSavedUser.setUserId(3);
        mockSavedUser.setEmail("john@example.com");
        mockSavedUser.setPassword("hashedPassword");
        mockSavedUser.setName("John");
        mockSavedUser.setUserType(mockUserType);

        when(userRepo.save(any(User.class))).thenReturn(mockSavedUser);
/* 
        // Call service
        UserDTO result = userService.registerUser(req);

        // Validate result
        assertNotNull(result);
        assertEquals("John", result.getName());
        assertEquals("john@example.com", result.getEmail());
        assertEquals("CUSTOMER", result.getRole()); 
        */
    }
}


