package com.springboot.pizzaHouse.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.springboot.pizzaHouse.model.Offer;
import com.springboot.pizzaHouse.model.Offer.DiscountType;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class OfferDTO {
    private Long id;
    private String offerText;
    private DiscountType discountType;
    private BigDecimal discountValue;
    private LocalDateTime validFrom;
    private LocalDateTime validTo;
    private Boolean isActive;

    public OfferDTO(Offer offer) {
        if (offer != null) {
            this.id = offer.getOfferId();
            this.offerText = offer.getOfferText();
            this.discountType = offer.getDiscountType();
            this.discountValue = offer.getDiscountValue();
            this.validFrom = offer.getValidFrom();
            this.validTo = offer.getValidTo();
            this.isActive = offer.getIsActive();
        }
    }
}
