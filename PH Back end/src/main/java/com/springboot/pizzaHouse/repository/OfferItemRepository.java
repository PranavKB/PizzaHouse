package com.springboot.pizzaHouse.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.springboot.pizzaHouse.model.Item;
import com.springboot.pizzaHouse.model.Offer;
import com.springboot.pizzaHouse.model.OfferItem;

@Repository
public interface OfferItemRepository extends JpaRepository<OfferItem, Long> {
    List<OfferItem> findByItem(Item item);
    List<OfferItem> findByOffer(Offer offer);
    
    void deleteByItem(Item item);
    void deleteByOffer(Offer offer);
    void deleteAllByItem(Item item);

    @Query("SELECT oi.item.itemId, oi.offer.offerId FROM OfferItem oi")
    List<Object[]> findItemOfferIdPairs();

}
