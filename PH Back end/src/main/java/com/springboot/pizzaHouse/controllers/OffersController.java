package com.springboot.pizzaHouse.controllers;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.springboot.pizzaHouse.dto.OfferDTO;
import com.springboot.pizzaHouse.model.Offer;
import com.springboot.pizzaHouse.services.OffersService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/offers")
@RequiredArgsConstructor
@Validated
public class OffersController {

    private final OffersService offersService;

    @GetMapping(value = "/current", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<OfferDTO>> getCurrentOffers() {
        List<Offer> offers = offersService.getCurrentOffers();
        if (offers == null || offers.isEmpty()) {
            return ResponseEntity.noContent().build(); 
        }
        List<OfferDTO> offerDTOs = offers.stream()
            .map(offer -> new OfferDTO(offer))
            .collect(Collectors.toList());
        return ResponseEntity.ok(offerDTOs);
    }

    @PostMapping(value = "/add", produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Offer> addOffer(@RequestBody Offer offer) {
        try {
            Offer savedOffer = offersService.addOffer(offer);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedOffer);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOffer(@PathVariable("id") Long offerId) {
        boolean deleted = offersService.deleteOfferById(offerId);

        if (deleted) {
            return ResponseEntity.noContent().build(); // 204 No Content
        } else {
            return ResponseEntity.notFound().build(); // 404 Not Found
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Offer> updateOffer(@PathVariable Long id, @RequestBody Offer updatedOffer) {
        Optional<Offer> existingOfferOpt = offersService.getOfferById(id);

        if (existingOfferOpt.isEmpty()) {
            return ResponseEntity.notFound().build(); 
        }

        Offer existingOffer = existingOfferOpt.get();

        existingOffer.setOfferText(updatedOffer.getOfferText());
        existingOffer.setDiscountType(updatedOffer.getDiscountType());
        existingOffer.setDiscountValue(updatedOffer.getDiscountValue());
        existingOffer.setValidFrom(updatedOffer.getValidFrom());
        existingOffer.setValidTo(updatedOffer.getValidTo());
        existingOffer.setIsActive(updatedOffer.getIsActive());

        Offer savedOffer = offersService.addOffer(existingOffer);
        return ResponseEntity.ok(savedOffer);
    }

}
