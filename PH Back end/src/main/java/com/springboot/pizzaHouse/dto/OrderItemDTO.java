package com.springboot.pizzaHouse.dto;

import java.util.List;

import com.springboot.pizzaHouse.model.OrderItem;
import java.util.stream.Collectors;


import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class OrderItemDTO {
    private Long orderItemId;
    private int quantity;
    private int itemId;
    private String itemName;
    private int price;
    private int subTotal;
    private List<OfferDTO> offers;

    public OrderItemDTO(OrderItem orderItem) {
        this.orderItemId = orderItem.getOrderItemId();
        this.quantity = orderItem.getQuantity();
        this.itemId = orderItem.getItemId();
        this.itemName = orderItem.getItemName();
        this.price = orderItem.getPrice();
        this.subTotal = orderItem.getSubTotal();

        if (orderItem.getOrderItemOffers() != null) {
            this.offers = orderItem.getOrderItemOffers().stream()
                .map(orderItemOffer -> new OfferDTO(orderItemOffer.getOffer()))
                .collect(Collectors.toList());
        }
    }
}
