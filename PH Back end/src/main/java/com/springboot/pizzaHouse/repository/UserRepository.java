package com.springboot.pizzaHouse.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.springboot.pizzaHouse.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByUserName(String userName);
    Optional<User> findByNameContaining(String name);
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    
    @Query("SELECT prt.user FROM PasswordResetToken prt WHERE prt.token = :token")
    Optional<User> findUserByPasswordResetToken(@Param("token") String token);
}
