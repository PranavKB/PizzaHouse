package com.springboot.pizzaHouse.extras;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class AppliedOffer {
    private long offerId;
    private int discountAmount;

    // getters and setters
    public long getOfferId() {
        return offerId;
    }

    public void setOfferId(long offerId) {
        this.offerId = offerId;
    }

    public int getDiscountAmount() {
        return discountAmount;
    }

    public void setDiscountAmount(int discountAmount) {
        this.discountAmount = discountAmount;
    }
}
