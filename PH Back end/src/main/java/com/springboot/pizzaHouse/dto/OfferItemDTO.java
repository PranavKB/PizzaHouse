package com.springboot.pizzaHouse.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
public class OfferItemDTO {
    private Long id;
    private ItemDTO item;
    private OfferDTO offer;
    
}
