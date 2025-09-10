package com.springboot.pizzaHouse.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.springboot.pizzaHouse.model.ItemType;

@Repository
public interface ItemTypeRepository extends JpaRepository<ItemType, Integer> {
    List<ItemType> findAll();
    ItemType findByItemTypeName(String itemTypeName);
}
