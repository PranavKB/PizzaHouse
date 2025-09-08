package com.springboot.pizzaHouse.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "payments")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    private int paymentId;

    @Column(name = "payment_mode")
    private int paymentMode = 1;

    @Column(name = "payment_time")
    private LocalDateTime paymentTime;

    @Column(name = "payment_status")
    private int paymentStatus;

    //  Add this to map the foreign key to the Order table
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    // Optional: If you want to auto-set the timestamp
    @PrePersist
    public void prePersist() {
        if (this.paymentTime == null) {
            this.paymentTime = LocalDateTime.now();
        }
        if (this.paymentMode == 0) {
            this.paymentMode = 1; // Default payment mode
        }
         if (this.paymentStatus == 0) {
            this.paymentStatus = 1; // Default status 
        }
    }
}
