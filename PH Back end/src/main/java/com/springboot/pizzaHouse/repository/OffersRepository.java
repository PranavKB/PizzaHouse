package com.springboot.pizzaHouse.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.springboot.pizzaHouse.model.Offer;

@Repository
public interface OffersRepository extends JpaRepository<Offer, Long> {
    @Query("SELECT DISTINCT o FROM Offer o LEFT JOIN FETCH o.offerItems oi LEFT JOIN FETCH oi.item")
    List<Offer> findAllWithItems();

    @Query("SELECT o FROM Offer o JOIN o.offerItems oi WHERE oi.item.id = :itemId AND o.isActive = true")
    List<Offer> findActiveOffersByItemId(@Param("itemId") Integer itemId);
    
}
