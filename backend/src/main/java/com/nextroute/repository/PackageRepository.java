package com.nextroute.repository;

import com.nextroute.model.TravelPackage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

/**
 * PackageRepository — fetches travel packages by destination name.
 * Uses case-insensitive LIKE matching so "goa", "Goa", "GOA" all work.
 * Falls back to "_default" packages if no destination match found.
 */
public interface PackageRepository extends JpaRepository<TravelPackage, Long> {

    List<TravelPackage> findByDestinationNameIgnoreCaseAndIsActiveTrue(String destinationName);

    List<TravelPackage> findByDestinationNameAndIsActiveTrue(String destinationName);
}
