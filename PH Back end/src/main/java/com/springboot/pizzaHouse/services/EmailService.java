package com.springboot.pizzaHouse.services;

public interface EmailService {
    void sendPasswordResetEmail(String toEmail, String resetLink);
    void sendWelcomeEmail(String toEmail, String name);
    void sendOrderConfirmationEmail(String toEmail, String orderDetails);
}
