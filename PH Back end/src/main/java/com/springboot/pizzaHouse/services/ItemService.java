package com.springboot.pizzaHouse.services;

import java.util.List;

import com.springboot.pizzaHouse.dto.ItemDTO;
import com.springboot.pizzaHouse.model.Item;

public interface ItemService {
    public List<Item> getItemsFromDB();
    public int getItemPrice(int itemId);
    public String getItemName(int itemId);
    public List<ItemDTO> getAllItemsWithOffers();
    public Item getItemById(int itemId);
}
