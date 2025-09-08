package com.springboot.pizzaHouse.services.impl;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.springboot.pizzaHouse.dto.ItemDTO;
import com.springboot.pizzaHouse.dto.OfferDTO;
import com.springboot.pizzaHouse.model.Item;
import com.springboot.pizzaHouse.model.Offer;
import com.springboot.pizzaHouse.repository.ItemRepository;
import com.springboot.pizzaHouse.services.ItemService;

import lombok.RequiredArgsConstructor;

@Service("ItemService")
@RequiredArgsConstructor
public class ItemServiceImpl implements ItemService {

    private final ItemRepository itemRepository;

    public ItemDTO mapToItemDTO(Item item) {
        ItemDTO dto = new ItemDTO();
        dto.setItemId(item.getItemId());
        dto.setItemName(item.getItemName());
        dto.setItemTypeName(item.getItemType() != null ? item.getItemType().getItemTypeName() : null);
        dto.setItemPrice(item.getItemPrice());
        dto.setIsVeg(item.getIsVeg());
        dto.setDescription(item.getDescription());
        dto.setImageUrl(item.getImageUrl());

        Set<OfferDTO> offers = item.getOfferItems().stream()
            .map(offerItem -> mapToOfferDTO(offerItem.getOffer()))
            .collect(Collectors.toSet());
        dto.setOffers(offers);

        return dto;
    }
    
    public OfferDTO mapToOfferDTO(Offer offer) {
        OfferDTO dto = new OfferDTO();
        dto.setId(offer.getOfferId());
        dto.setOfferText(offer.getOfferText());
        dto.setDiscountType(offer.getDiscountType());
        dto.setDiscountValue(offer.getDiscountValue());
        dto.setValidFrom(offer.getValidFrom());
        dto.setValidTo(offer.getValidTo());
        dto.setIsActive(offer.getIsActive());
        return dto;
    }
    
    public List<Item> getItemsFromDB()
	{
        return itemRepository.findAll();
    }

    public List<ItemDTO> getAllItemsWithOffers() {
        try{
            List<Item> items = itemRepository.findAllWithItemTypeAndOffers();
            return items.stream()
                .map(item -> mapToItemDTO(item))
                .collect(Collectors.toList());
        } catch (Exception e) {
            System.out.println("Error fetching items with offers: " + e.getMessage());
        }
        return Collections.emptyList();
    }

    public int getItemPrice(int itemId)
	{
        Item item = itemRepository.findById(itemId).orElse(null);
        if (item != null) {
            return item.getItemPrice();
        }
        else {
            System.out.println("Item not found with id: " + itemId);
        }
        return 0; // or throw an exception if preferred
    }

    public String getItemName(int itemId)
	{
        Item item = itemRepository.findById(itemId).orElse(null);
        if (item != null) {
            return item.getItemName();
        }
        else {
            System.out.println("Item not found with id: " + itemId);
        }
        return null; // or throw an exception if preferred
    }

    public Item getItemById(int itemId) {
        return itemRepository.findById(itemId).orElse(null);
    }
    
}
