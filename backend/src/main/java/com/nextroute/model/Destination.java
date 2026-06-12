package com.nextroute.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

// Serves double duty: the `type` field splits these into Must Visit places and Special Offers.
// Special offers use the extra fields (nights, oldPrice, newPrice, offerDetails).
// imageUrls is stored as a JSON array string.
@Entity
@Table(name = "destinations")
public class Destination {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 100)
    private String location;

    @Column(length = 255)
    private String description;

    @Column(name = "full_details", columnDefinition = "TEXT")
    private String fullDetails;

    @Column(length = 20)
    private String price;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DestType type;

    @Column(name = "image_urls", columnDefinition = "JSON")
    private String imageUrls;

    @Column
    private Integer nights = 0;

    @Column(name = "old_price")
    private Integer oldPrice = 0;

    @Column(name = "new_price")
    private Integer newPrice = 0;

    @Column(name = "offer_details", length = 255)
    private String offerDetails;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum DestType {
        MUST_VISIT, SPECIAL_OFFER
    }


    public Destination() {}


    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getFullDetails() { return fullDetails; }
    public void setFullDetails(String fullDetails) { this.fullDetails = fullDetails; }

    public String getPrice() { return price; }
    public void setPrice(String price) { this.price = price; }

    public DestType getType() { return type; }
    public void setType(DestType type) { this.type = type; }

    public String getImageUrls() { return imageUrls; }
    public void setImageUrls(String imageUrls) { this.imageUrls = imageUrls; }

    public Integer getNights() { return nights; }
    public void setNights(Integer nights) { this.nights = nights; }

    public Integer getOldPrice() { return oldPrice; }
    public void setOldPrice(Integer oldPrice) { this.oldPrice = oldPrice; }

    public Integer getNewPrice() { return newPrice; }
    public void setNewPrice(Integer newPrice) { this.newPrice = newPrice; }

    public String getOfferDetails() { return offerDetails; }
    public void setOfferDetails(String offerDetails) { this.offerDetails = offerDetails; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
