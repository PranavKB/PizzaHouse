package com.springboot.pizzaHouse.services;

import java.util.List;

import com.springboot.pizzaHouse.model.Order;
import com.springboot.pizzaHouse.model.OrderItem;

public interface EmailService {
    void sendPasswordResetEmail(String toEmail, String resetLink);
    void sendWelcomeEmail(String toEmail, String name);
    void sendOrderConfirmationEmail(String toEmail, String orderDetails);
    void sendOrderConfirmationEmail(String toEmail, Order order, List<OrderItem> orderItems);
}
