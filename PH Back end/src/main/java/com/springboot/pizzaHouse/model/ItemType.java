package com.springboot.pizzaHouse.model;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "item_type")
@NoArgsConstructor
@AllArgsConstructor
@Getter @Setter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class ItemType {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_type_id")
    @EqualsAndHashCode.Include
    private Integer itemTypeId;

    @Column(name = "item_type_name", nullable = false, length = 45)
    private String itemTypeName;

    @Column(name = "Item_type_description", length = 255)
    private String itemTypeDescription;

    @OneToMany(mappedBy = "itemType")
    @JsonIgnore  // prevents recursion
    private Set<Item> items = new HashSet<>();
}
