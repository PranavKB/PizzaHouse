package com.springboot.pizzaHouse.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "offers")
@NoArgsConstructor
@AllArgsConstructor
@Getter @Setter
@EqualsAndHashCode
public class Offer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "offer_id")
    private Long offerId;

    private String offerText;

    @Enumerated(EnumType.STRING)
    private DiscountType discountType; // flat, percentage, bogo

    private BigDecimal discountValue;

    private LocalDateTime validFrom;
    private LocalDateTime validTo;

    private Boolean isActive;

    @OneToMany(mappedBy = "offer", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<OfferItem> offerItems = new HashSet<>();
    
    public enum DiscountType {
        FLAT, PERCENTAGE, BOGO
    }


}

