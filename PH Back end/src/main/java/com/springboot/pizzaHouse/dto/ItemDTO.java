package com.springboot.pizzaHouse.dto;

import java.util.Set;
import java.util.stream.Collectors;

import com.springboot.pizzaHouse.model.Item;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ItemDTO {
    private int itemId;
    private String itemName;
    private String itemTypeName; 
    private int itemPrice;
    private int isVeg;
    private String description;
    private String imageUrl;

    private Set<OfferDTO> offers;

    public ItemDTO() {
    }

    public ItemDTO(Item item) {
        this.itemId = item.getItemId();
        this.itemName = item.getItemName();
        this.itemTypeName = item.getItemType() != null ? item.getItemType().getItemTypeName() : null;
        this.itemPrice = item.getItemPrice();
        this.isVeg = item.getIsVeg();
        this.description = item.getDescription();
        this.imageUrl = item.getImageUrl();
        this.offers = item.getOfferItems().stream()
                          .map(offerItem -> new OfferDTO(offerItem.getOffer()))
                          .collect(Collectors.toSet());
    }
}
