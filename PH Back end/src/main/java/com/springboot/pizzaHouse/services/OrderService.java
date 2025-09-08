package com.springboot.pizzaHouse.services;

import java.util.List;
import java.util.Map;

import com.springboot.pizzaHouse.model.Order;
import com.springboot.pizzaHouse.model.OrderItem;
import com.springboot.pizzaHouse.model.OrderStatus;

public interface OrderService {
    
     List<Order> getAllOrders();

	 List<OrderItem> saveOrder(Map<Integer, Integer> orderList, Integer orderStatus, String email);

    List<OrderItem> getOrderItems();

    boolean confirmOrder(Long orderId);

    Map<Integer, Integer> findOrderMapUsingEmail(String email, Integer statusId);

    Map<Integer, Integer> findOrderMap(Integer orderId, Integer statusId);

    boolean clearCart(String email);

    List<Order> getOrderHistory(String email);

    List<OrderStatus> getAllOrderStatuses();

}
