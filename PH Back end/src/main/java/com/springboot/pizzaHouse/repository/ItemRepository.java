package com.springboot.pizzaHouse.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.springboot.pizzaHouse.model.Item;

public interface ItemRepository extends JpaRepository<Item, Integer> {

     // Fetch items with offerItems and their offers eagerly to avoid N+1 problem
    @Query("SELECT DISTINCT i FROM Item i LEFT JOIN FETCH i.offerItems oi LEFT JOIN FETCH oi.offer")
    List<Item> findAllWithOffers();
    
    @Query("SELECT DISTINCT i FROM Item i " +
       "LEFT JOIN FETCH i.itemType " +
       "LEFT JOIN FETCH i.offerItems oi " +
       "LEFT JOIN FETCH oi.offer")
    List<Item> findAllWithItemTypeAndOffers();

}
