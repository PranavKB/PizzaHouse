package com.springboot.pizzaHouse.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.springboot.pizzaHouse.model.Order;
import com.springboot.pizzaHouse.model.OrderStatus;

import jakarta.transaction.Transactional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {

    @Query("SELECT o.orderId FROM Order o WHERE o.orderEmailId = :emailId")
    Integer findOrderIdByOrderEmailId(@Param("emailId") String emailId);

    Order findOrderByOrderId(Long orderId);

    @Modifying
    @Transactional
    @Query("UPDATE Order o SET o.orderStatus = :orderStatus WHERE o.orderId = :orderId")
    int updateOrderStatusByOrderId(@Param("orderStatus") OrderStatus orderStatus, @Param("orderId") Integer orderId);

    @Modifying
    @Transactional
    @Query("UPDATE Order o SET o.orderTotal = :total WHERE o.orderId = :id")
    int updateOrderTotalById(@Param("id") int id, @Param("total") BigDecimal total);

    void deleteByOrderIdAndOrderStatus_OrderStatusId(int orderId, int statusId);

    @Query("SELECT o FROM Order o WHERE o.orderEmailId = :email AND o.orderStatus.orderStatusId = :statusId")
    List<Order> findOrdersByEmailAndOrderStatusId(@Param("email") String email, @Param("statusId") Integer statusId);

    @Query("SELECT o FROM Order o WHERE o.orderEmailId = :email")
    List<Order> findOrdersByEmail(@Param("email") String email);

    @Query("SELECT o FROM Order o WHERE o.orderEmailId = :email AND o.orderStatus.orderStatusId = :statusId")
    Order findOrderByEmailAndOrderStatusId(@Param("email") String email, @Param("statusId") int statusId);
}
