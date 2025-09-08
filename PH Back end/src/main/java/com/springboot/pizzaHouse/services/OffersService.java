package com.springboot.pizzaHouse.services;

import java.util.List;
import java.util.Optional;

import com.springboot.pizzaHouse.extras.OfferCalculationResult;
import com.springboot.pizzaHouse.model.Item;
import com.springboot.pizzaHouse.model.Offer;
import com.springboot.pizzaHouse.model.OfferItem;

public interface OffersService {
    public List<Offer> getCurrentOffers();
    public Offer addOffer(Offer offer);
    public boolean deleteOfferById(Long offerId);
    public Optional<Offer> getOfferById(Long id);
    public void assignOfferToItem(Long offerId, Integer itemId);
    public List<OfferItem> getItemsByOffer(Long offerId);
    public List<Offer> getActiveOffersForItem(Integer itemId);
    public OfferCalculationResult applyAllOffers(Item item, Integer quantity, List<Offer> activeOffers);
}
