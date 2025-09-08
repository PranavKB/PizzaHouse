package com.springboot.pizzaHouse.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private int orderId;

    @Column(name = "order_email_id")
    private String orderEmailId;

    @Column(name = "order_address")
    private String orderAddress;

    @Column(name = "customer_name")
    private String customerName;

    @Column(name = "order_pin_code")
    private String orderPinCode;

    @Column(name = "order_mobile_no")
    private String orderMobileNo;

    @Column(name = "order_total", nullable = false)
    private BigDecimal orderTotal;

    @Column(name = "order_time_stamp")
    private LocalDateTime orderTimeStamp;

    // Relationships

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_status_id", nullable = false)
    private OrderStatus orderStatus;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<OrderItem> orderItems = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        if (orderStatus.getOrderStatusId() == null) {
            orderStatus.setOrderStatusId(1);
        }
        if (orderTotal == null) {
            orderTotal = BigDecimal.ZERO;
        }
        if (orderTimeStamp == null) {
            orderTimeStamp = LocalDateTime.now();
        }
        if (orderItems == null) {
            orderItems = new ArrayList<>();
        }
    }

    public int getOrderStatusId() {
        return orderStatus != null ? orderStatus.getOrderStatusId() : 0;
    }

    public void setOrderStatusId(int orderStatusId) {
        this.orderStatus = new OrderStatus();
        this.orderStatus.setOrderStatusId(orderStatusId);
    }

    public void addOrderItem(OrderItem item) {
        orderItems.add(item);
        item.setOrder(this);
    }

    public void removeOrderItem(OrderItem item) {
        orderItems.remove(item);
        item.setOrder(null);
    }

    
}
