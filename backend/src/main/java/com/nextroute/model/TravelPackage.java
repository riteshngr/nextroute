package com.nextroute.model;

import jakarta.persistence.*;

// Packages are matched to searches by destinationName (case-insensitive).
// Use "_default" as destinationName for fallback packages when no specific match exists.
// Features are stored as a JSON array string.
@Entity
@Table(name = "packages")
public class TravelPackage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "destination_name", nullable = false, length = 255)
    private String destinationName;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(nullable = false)
    private Integer price;

    @Column(nullable = false)
    private Integer nights;

    @Column(length = 20)
    private String color = "blue";

    @Column(name = "is_popular")
    private Boolean isPopular = false;

    @Column(columnDefinition = "JSON")
    private String features;

    @Column(name = "is_active")
    private Boolean isActive = true;


    public TravelPackage() {}


    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDestinationName() { return destinationName; }
    public void setDestinationName(String destinationName) { this.destinationName = destinationName; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getPrice() { return price; }
    public void setPrice(Integer price) { this.price = price; }

    public Integer getNights() { return nights; }
    public void setNights(Integer nights) { this.nights = nights; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public Boolean getIsPopular() { return isPopular; }
    public void setIsPopular(Boolean isPopular) { this.isPopular = isPopular; }

    public String getFeatures() { return features; }
    public void setFeatures(String features) { this.features = features; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}
