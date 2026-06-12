package com.nextroute.repository;

import com.nextroute.model.TravelPackage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

// Case-insensitive match so "goa", "Goa", "GOA" all work.
// The "_default" destination name is used as a fallback when nothing else matches.
public interface PackageRepository extends JpaRepository<TravelPackage, Long> {

    List<TravelPackage> findByDestinationNameIgnoreCaseAndIsActiveTrue(String destinationName);

    List<TravelPackage> findByDestinationNameAndIsActiveTrue(String destinationName);
}
