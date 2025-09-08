package com.springboot.pizzaHouse.services.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.springboot.pizzaHouse.services.EmailService;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Async
    @Override
    public void sendPasswordResetEmail(String toEmail, String resetToken) {
        try {
            Context context = new Context();
            context.setVariable("resetLink", frontendUrl + "/reset-password?token=" + resetToken);
            context.setVariable("supportEmail", fromEmail);

            String emailContent = templateEngine.process("password-reset", context);
            sendHtmlEmail(toEmail, "Reset Your Password", emailContent);

            logger.info("Password reset email sent to: {}", toEmail);
        } catch (Exception e) {
            logger.error("Failed to send password reset email to {}: {}", toEmail, e.getMessage());
        }
    }

    @Async
    @Override
    public void sendWelcomeEmail(String toEmail, String name) {
        try {
            Context context = new Context();
            context.setVariable("name", name);
            context.setVariable("supportEmail", fromEmail);

            String emailContent = templateEngine.process("welcome", context);
            sendHtmlEmail(toEmail, "Welcome to Pizza House!", emailContent);

            logger.info("Welcome email sent to: {}", toEmail);
        } catch (Exception e) {
            logger.error("Failed to send welcome email to {}: {}", toEmail, e.getMessage());
        }
    }

    @Async
    @Override
    public void sendOrderConfirmationEmail(String toEmail, String orderDetails) {
        try {
            Context context = new Context();
            context.setVariable("orderDetails", orderDetails);
            context.setVariable("supportEmail", fromEmail);

            String emailContent = templateEngine.process("order-confirmation", context);
            sendHtmlEmail(toEmail, "Order Confirmation", emailContent);

            logger.info("Order confirmation email sent to: {}", toEmail);
        } catch (Exception e) {
            logger.error("Failed to send order confirmation email to {}: {}", toEmail, e.getMessage());
        }
    }

    private void sendHtmlEmail(String to, String subject, String htmlContent) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        
        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);
        
        mailSender.send(message);
    }
}
