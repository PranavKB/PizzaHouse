package com.springboot.pizzaHouse.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Entity
@Table(name = "order_item_offers")
@NoArgsConstructor
@AllArgsConstructor
@Getter @Setter
public class OrderItemOffer implements Serializable {

    @EmbeddedId
    private OrderItemOfferId id;

    @Column(name = "discount_amount", nullable = false)
    private Integer discountAmount;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("orderItemId")
    @JoinColumn(name = "order_item_id", referencedColumnName = "order_item_id", foreignKey = @ForeignKey(name = "fk_order_item"))
    private OrderItem orderItem;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("offerId")
    @JoinColumn(name = "offer_id", referencedColumnName = "offer_id", foreignKey = @ForeignKey(name = "fk_offer"))
    private Offer offer;

    public OrderItemOffer(OrderItem orderItem, Offer offer, Integer discountAmount) {
    this.orderItem = orderItem;
    this.offer = offer;
    this.discountAmount = discountAmount;
    this.id = new OrderItemOfferId(orderItem.getOrderItemId(), offer.getOfferId());
}

}

