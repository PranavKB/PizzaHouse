package com.springboot.pizzaHouse.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.springboot.pizzaHouse.model.OrderItem;

import jakarta.transaction.Transactional;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {

    @Query("SELECT oi.itemId, SUM(oi.quantity) " +
           "FROM OrderItem oi " +
           "WHERE oi.order.orderId = :orderId AND oi.order.orderStatus.orderStatusId = :statusId " +
           "GROUP BY oi.itemId")
    List<Object[]> findItemQuantitiesByOrderIdAndStatusId(
        @Param("orderId") Integer orderId,
        @Param("statusId") Integer statusId
    );

    @Query("SELECT oi.itemId, SUM(oi.quantity) " +
           "FROM OrderItem oi " +
           "WHERE oi.order.orderEmailId = :email AND oi.order.orderStatus.orderStatusId = :statusId " +
           "GROUP BY oi.itemId")
    List<Object[]> findItemQuantitiesByEmailAndStatusId(
        @Param("email") String email,
        @Param("statusId") Integer statusId
    );

    void deleteByOrder_OrderId(int orderId);

    @Modifying
    @Transactional
    @Query("DELETE FROM OrderItem oi WHERE oi.orderItemId = :orderItemId")
    void deleteByOrderItemId(@Param("orderItemId") Long orderItemId);

}

