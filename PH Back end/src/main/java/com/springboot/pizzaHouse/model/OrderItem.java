package com.springboot.pizzaHouse.model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="order_items")
@Getter @Setter
@EqualsAndHashCode
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_item_id")
    private Long orderItemId;
    private int quantity;
	private int itemId;      
	private String itemName; 
	private int price;
	private int subTotal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @JsonBackReference
    private Order order;

    @Transient
    @JsonProperty("orderId")
    public Long getOrderId() {
        return (order != null) ? Long.valueOf(order.getOrderId()) : null;
    }

    @OneToMany(mappedBy = "orderItem", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItemOffer> orderItemOffers = new ArrayList<>();

    public List<OrderItemOffer> getOrderItemOffers() {
        return orderItemOffers;
    }

    public void setOrderItemOffers(List<OrderItemOffer> orderItemOffers) {
        this.orderItemOffers = orderItemOffers;
    }


    @Override
    public String toString() {
        return "OrderItem [orderItemId=" + orderItemId + ", quantity=" + quantity + ", itemId=" + itemId + ", itemName="
                + itemName + ", price=" + price + ", subTotal=" + subTotal + "]";
    }
        
}
