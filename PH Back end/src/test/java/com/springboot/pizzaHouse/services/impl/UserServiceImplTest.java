package com.springboot.pizzaHouse.services.impl;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.springboot.pizzaHouse.dto.UserDTO;
import com.springboot.pizzaHouse.exception.InvalidUserTypeException;
import com.springboot.pizzaHouse.exception.UserAlreadyExistsException;
import com.springboot.pizzaHouse.exception.UserNotFoundException;
import com.springboot.pizzaHouse.model.PasswordResetToken;
import com.springboot.pizzaHouse.model.User;
import com.springboot.pizzaHouse.model.UserType;
import com.springboot.pizzaHouse.model.request.UserRequest;
import com.springboot.pizzaHouse.repository.PasswordResetTokenRepository;
import com.springboot.pizzaHouse.repository.UserRepository;
import com.springboot.pizzaHouse.repository.UserTypeRepository;
import com.springboot.pizzaHouse.security.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
public class UserServiceImplTest {

    @Mock private UserRepository userRepo;
    @Mock private UserTypeRepository userTypeRepo;
    @Mock private PasswordResetTokenRepository tokenRepo;
    @Mock private PasswordEncoder encoder;
    @Mock private JwtUtil jwtUtil;
    @Mock private HttpServletRequest request;

    @InjectMocks private UserServiceImpl userService;

    private User mockUser;
    private UserType mockUserType;
    private final String email = "john@example.com";
    private final String hashedPassword = "hashedPass";

    @BeforeEach
    void init() {
        mockUserType = new UserType(3, "CUSTOMER", "Customer Role");
        mockUser = new User();
        mockUser.setEmail(email);
        mockUser.setName("John Doe");
        mockUser.setUserName("johnny");
        mockUser.setAddress("123 Street");
        mockUser.setCity("NY");
        mockUser.setState("NY");
        mockUser.setPincode("10001");
        mockUser.setMobileNum("1234567890");
        mockUser.setPassword(hashedPassword);
        mockUser.setUserType(mockUserType);
    }

    private UserRequest createUserRequest() {
        UserRequest req = new UserRequest();
        req.setEmail(email);
        req.setName("John Doe");
        req.setUserName("johnny");
        req.setAddress("123 Street");
        req.setCity("NY");
        req.setState("NY");
        req.setPincode("10001");
        req.setMobileNum("1234567890");
        req.setPassword("plainPass");
        req.setUserTypeId(mockUserType.getId());
        return req;
    }

    @Test
    void givenValidEmail_whenGetUserByEmail_thenReturnUserDTO() {
        when(userRepo.findByEmail(email)).thenReturn(Optional.of(mockUser));
        when(userTypeRepo.findById(mockUserType.getId())).thenReturn(Optional.of(mockUserType));

        UserDTO dto = userService.getUserByEmail(email);

        assertAll(
            () -> assertNotNull(dto),
            () -> assertEquals(email, dto.getEmail()),
            () -> assertEquals("CUSTOMER", dto.getRole())
        );
    }

    @Test
    void givenInvalidEmail_whenGetUserByEmail_thenThrowException() {
        when(userRepo.findByEmail(email)).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> userService.getUserByEmail(email));
    }

    @Test
    void givenValidUserRequest_whenRegisterUser_thenSuccess() {
        UserRequest req = createUserRequest();

        when(userRepo.existsByEmail(email)).thenReturn(false);
        when(userTypeRepo.findById(req.getUserTypeId())).thenReturn(Optional.of(mockUserType));
        when(encoder.encode(req.getPassword())).thenReturn(hashedPassword);
        when(userRepo.save(any(User.class))).thenReturn(mockUser);

        UserDTO result = userService.registerUser(req);

        assertAll(
            () -> assertNotNull(result),
            () -> assertEquals(email, result.getEmail()),
            () -> assertEquals("John Doe", result.getName())
        );
    }

    @Test
    void givenExistingEmail_whenRegisterUser_thenThrowUserAlreadyExistsException() {
        UserRequest req = createUserRequest();
        when(userRepo.existsByEmail(email)).thenReturn(true);

        assertThrows(UserAlreadyExistsException.class, () -> userService.registerUser(req));
    }

    @Test
    void givenInvalidUserType_whenRegisterUser_thenThrowInvalidUserTypeException() {
        UserRequest req = createUserRequest();
        when(userRepo.existsByEmail(email)).thenReturn(false);
        when(userTypeRepo.findById(req.getUserTypeId())).thenReturn(Optional.empty());

        assertThrows(InvalidUserTypeException.class, () -> userService.registerUser(req));
    }

    @Test
    void whenGetAllUsers_thenReturnUserDTOList() {
        when(userRepo.findAll()).thenReturn(List.of(mockUser));
        when(userTypeRepo.findById(mockUserType.getId())).thenReturn(Optional.of(mockUserType));

        List<UserDTO> result = userService.getAllUsers();

        assertAll(
            () -> assertNotNull(result),
            () -> assertEquals(1, result.size()),
            () -> assertEquals(email, result.get(0).getEmail())
        );
    }

    @Test
    void whenGetAllUserTypes_thenReturnList() {
        when(userTypeRepo.findAll()).thenReturn(List.of(mockUserType));

        List<UserType> types = userService.getAllUserTypesList();

        assertAll(
            () -> assertNotNull(types),
            () -> assertEquals(1, types.size()),
            () -> assertEquals("CUSTOMER", types.get(0).getName())
        );
    }

    @Test
    void whenDoesUserExist_thenReturnTrueOrFalse() {
        when(userRepo.existsByEmail(email)).thenReturn(true);
        assertTrue(userService.doesUserExist(email));
    }

    @Test
    void whenGetEmailFromRequest_thenReturnCorrectEmail() {
        when(request.getAttribute("email")).thenReturn(null);
        when(jwtUtil.extractEmailFromRequest(request)).thenReturn("test@example.com");

        String result = userService.getEmailFromRequest(request);
        assertEquals("test@example.com", result);
    }

    @Test
    void whenCreatePasswordResetToken_thenTokenSaved() {
        when(tokenRepo.findByUser(mockUser)).thenReturn(Optional.empty());
        when(tokenRepo.save(any(PasswordResetToken.class)))
            .thenAnswer(inv -> inv.getArgument(0));

        String token = userService.createPasswordResetTokenForUser(mockUser);

        assertNotNull(token);
    }

    @Test
    void whenValidatePasswordResetToken_thenReturnTrueOrFalse() {
        PasswordResetToken token = new PasswordResetToken(
            UUID.randomUUID().toString(),
            mockUser,
            LocalDateTime.now().plusHours(2)
        );

        when(tokenRepo.findByToken(token.getToken())).thenReturn(Optional.of(token));
        assertTrue(userService.validatePasswordResetToken(token.getToken()));
    }

    @Test
    void whenChangeUserPassword_thenUserIsSaved() {
        String newPassword = "newSecret";
        when(encoder.encode(newPassword)).thenReturn("encodedNewSecret");

        userService.changeUserPassword(mockUser, newPassword);

        verify(userRepo).save(mockUser);
        verify(tokenRepo).deleteByUser(mockUser);
    }
}
