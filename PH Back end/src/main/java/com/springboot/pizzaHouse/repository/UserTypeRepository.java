package com.springboot.pizzaHouse.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.springboot.pizzaHouse.model.UserType;

public interface UserTypeRepository extends JpaRepository<UserType, Integer> {
    Optional<UserType> findByName(String name);
    @SuppressWarnings("null")
    Optional<UserType> findById(Integer id);
}
