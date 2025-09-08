package com.springboot.pizzaHouse.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "order_status")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class OrderStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_status_id")
    private Integer orderStatusId = 0;

    @Column(name = "order_status_name", nullable = false, length = 45)
    private String orderStatusName;

}

