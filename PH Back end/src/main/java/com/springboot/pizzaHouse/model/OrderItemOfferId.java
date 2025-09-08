package com.springboot.pizzaHouse.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Embeddable
@AllArgsConstructor
@Getter @Setter
@EqualsAndHashCode
public class OrderItemOfferId implements Serializable {

    @Column(name = "order_item_id")
    private Long orderItemId;

    @Column(name = "offer_id")
    private Long offerId;

    public OrderItemOfferId() {}

    public Long getOrderItemId() {
        return orderItemId;
    }

    public void setOrderItemId(Long orderItemId) {
        this.orderItemId = orderItemId;
    }

    public Long getOfferId() {
        return offerId;
    }

    public void setOfferId(Long offerId) {
        this.offerId = offerId;
    }

}
