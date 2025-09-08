package com.springboot.pizzaHouse.services.impl;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.springboot.pizzaHouse.extras.AppliedOffer;
import com.springboot.pizzaHouse.extras.OfferCalculationResult;
import com.springboot.pizzaHouse.model.Item;
import com.springboot.pizzaHouse.model.Offer;
import com.springboot.pizzaHouse.model.OfferItem;
import com.springboot.pizzaHouse.repository.ItemRepository;
import com.springboot.pizzaHouse.repository.OfferItemRepository;
import com.springboot.pizzaHouse.repository.OffersRepository;
import com.springboot.pizzaHouse.services.OffersService;

import lombok.RequiredArgsConstructor;

@Service("OffersService")
@Transactional
@RequiredArgsConstructor
public class OffersServiceImpl implements OffersService {

    private final OffersRepository offersRepository;
    private final OfferItemRepository offerItemRepository;
    private final ItemRepository itemRepository;
    

    @Override
    public List<OfferItem> getItemsByOffer(Long offerId) {
        Offer offer = offersRepository.findById(offerId)
                .orElseThrow(() -> new RuntimeException("Offer not found"));
        return offerItemRepository.findByOffer(offer);
    }

    @Override
    public List<Offer> getCurrentOffers() {
         return offersRepository.findAll();
    }

    @Override
    public Offer addOffer(Offer offer) {
        return offersRepository.save(offer);
    }

    @Override
    public boolean deleteOfferById(Long offerId) {
        if (offersRepository.existsById(offerId)) {
            offersRepository.deleteById(offerId);
            return true;
        }
        return false;
    }

    @Override
    public Optional<Offer> getOfferById(Long id) {
        return offersRepository.findById(id);
    }

    public void assignOfferToItem(Long offerId, Integer itemId) {
        Offer offer = offersRepository.findById(offerId)
                .orElseThrow(() -> new RuntimeException("Offer not found"));
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        OfferItem offerItem = new OfferItem();
        offerItem.setOffer(offer);
        offerItem.setItem(item);

        offerItemRepository.save(offerItem);
    }

    @Override
    public List<Offer> getActiveOffersForItem(Integer itemId) {
        return offersRepository.findActiveOffersByItemId(itemId);
    }

    public OfferCalculationResult applyAllOffers(Item item, Integer quantity, List<Offer> activeOffers) {
        int originalTotal = item.getItemPrice() * quantity;
        int finalTotal = originalTotal;
        List<AppliedOffer> appliedOffers = new ArrayList<>();

        if (activeOffers == null || activeOffers.isEmpty()) {
            return new OfferCalculationResult(finalTotal, appliedOffers);
        }

        for (Offer offer : activeOffers) {
            if (!isOfferActive(offer)) continue;

            int discount = calculateDiscount(offer, item, quantity);

            if (discount > 0) {
                finalTotal -= discount;
                appliedOffers.add(new AppliedOffer(offer.getOfferId(), discount));
            }
        }

        finalTotal = Math.max(finalTotal, 0);

        return new OfferCalculationResult(finalTotal, appliedOffers);
    }

    private int calculateDiscount(Offer offer, Item item, int quantity) {
        switch (offer.getDiscountType()) {
            case FLAT:
                return offer.getDiscountValue().intValue();

            case PERCENTAGE:
                return (int) Math.round(item.getItemPrice() * (offer.getDiscountValue().doubleValue() / 100.0) * quantity);

            case BOGO:
                int payableQty = (int) Math.ceil(quantity / 2.0);
                return (quantity - payableQty) * item.getItemPrice();

            default:
                return 0;
        }
    }


    private boolean isOfferActive(Offer offer) {
        if (!offer.getIsActive()) return false;

        Date nowAsDate = new Date();
        if (offer.getValidFrom() != null && nowAsDate.before(convertLocalDateTimeToDate(offer.getValidFrom()))) return false;
        if (offer.getValidTo() != null && nowAsDate.after(convertLocalDateTimeToDate(offer.getValidTo()))) return false;

        return true;
    }

    private Date convertLocalDateTimeToDate(LocalDateTime localDateTime) {
        return Date.from(localDateTime.atZone(ZoneId.systemDefault()).toInstant());
    }

}
