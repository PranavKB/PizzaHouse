package com.springboot.pizzaHouse.model;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "items")
@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Item {

    @Id
    @EqualsAndHashCode.Include
    private int itemId;

    private String itemName;
    private int itemPrice;
    private int isVeg;
    private String description;
    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "item_type", referencedColumnName = "item_type_id")
    private ItemType itemType;

    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private Set<OfferItem> offerItems = new HashSet<>();
}

