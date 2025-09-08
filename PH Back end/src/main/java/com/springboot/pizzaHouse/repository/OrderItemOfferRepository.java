package com.springboot.pizzaHouse.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.springboot.pizzaHouse.model.OrderItemOffer;
import com.springboot.pizzaHouse.model.OrderItemOfferId;

import jakarta.transaction.Transactional;

@Repository
public interface OrderItemOfferRepository extends JpaRepository<OrderItemOffer, OrderItemOfferId> {

    @Modifying
    @Transactional
    @Query("DELETE FROM OrderItemOffer oio WHERE oio.orderItem.orderItemId = :orderItemId")
    void deleteByOrderItem_OrderItemId(@Param("orderItemId") Long orderItemId);
}

