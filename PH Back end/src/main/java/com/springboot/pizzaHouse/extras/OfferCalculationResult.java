package com.springboot.pizzaHouse.extras;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
public class OfferCalculationResult {
    private int finalTotal; // after discount
    private List<AppliedOffer> appliedOffers;

    // getters and setters
    public int getFinalTotal() {
        return finalTotal;
    }

    public void setFinalTotal(int finalTotal) {
        this.finalTotal = finalTotal;
    }

    public List<AppliedOffer> getAppliedOffers() {
        return appliedOffers;
    }

    public void setAppliedOffers(List<AppliedOffer> appliedOffers) {
        this.appliedOffers = appliedOffers;
    }

    public int getTotalDiscount() {
        return appliedOffers.stream().mapToInt(AppliedOffer::getDiscountAmount).sum();
    }
}

