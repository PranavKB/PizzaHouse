package com.springboot.pizzaHouse.controllers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.springboot.pizzaHouse.dto.ItemDTO;
import com.springboot.pizzaHouse.dto.OfferDTO;
import com.springboot.pizzaHouse.model.Item;
import com.springboot.pizzaHouse.model.Offer;
import com.springboot.pizzaHouse.model.OfferItem;
import com.springboot.pizzaHouse.repository.ItemRepository;
import com.springboot.pizzaHouse.repository.OfferItemRepository;
import com.springboot.pizzaHouse.repository.OffersRepository;
import com.springboot.pizzaHouse.services.ItemService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import jakarta.websocket.server.PathParam;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/items")
@RequiredArgsConstructor
@Validated

public class ItemController {

    @Autowired
    ItemService itemService;

    private final ItemRepository itemRepository;
    private final OffersRepository offerRepository;
    private final OfferItemRepository offerItemRepository;

    @GetMapping(value="/all", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<ItemDTO>> getItems(HttpServletRequest req) {
        List<ItemDTO> items = itemService.getAllItemsWithOffers();
        return ResponseEntity.ok(items);
    }

    @PostMapping(value="/{itemId}/map-offers", produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    @Transactional
    public ResponseEntity<?> mapItemToOffers(@PathVariable("itemId") int itemId, @RequestBody List<Long> offerIds) {
        Optional<Item> itemOpt = itemRepository.findById(itemId);
        if (itemOpt.isEmpty()) return ResponseEntity.badRequest().body("Item not found");

        Item item = itemOpt.get();

        // Delete old mappings
        offerItemRepository.deleteAllByItem(item);

        // Save new mappings
        for (Long offerId : offerIds) {
            Offer offer = offerRepository.findById(offerId)
                .orElseThrow(() -> new RuntimeException("Offer not found: " + offerId));

            OfferItem offerItem = new OfferItem();
            offerItem.setItem(item);
            offerItem.setOffer(offer);
            offerItemRepository.save(offerItem);
        }

        return ResponseEntity.ok(Map.of("message", "Mapping saved successfully"));
    }

    @GetMapping(value="/item-offer-id-map", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<Integer, List<Long>>> getItemOfferIdMap() {
        List<Object[]> results = offerItemRepository.findItemOfferIdPairs();

        Map<Integer, List<Long>> itemOfferMap = new HashMap<>();
        for (Object[] row : results) {
            Integer itemId = (Integer) row[0];
            Long offerId = (Long) row[1];
            itemOfferMap.computeIfAbsent(itemId, k -> new ArrayList<>()).add(offerId);
        }

        return ResponseEntity.ok(itemOfferMap);
    }



}

