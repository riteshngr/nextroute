package com.nextroute.controller;

import com.nextroute.model.TravelPackage;
import com.nextroute.repository.PackageRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/packages")
public class PackageController {

    private final PackageRepository packageRepository;

    public PackageController(PackageRepository packageRepository) {
        this.packageRepository = packageRepository;
    }

    @GetMapping
    public ResponseEntity<List<TravelPackage>> getPackages(
            @RequestParam String destination) {

        List<TravelPackage> packages = packageRepository
                .findByDestinationNameIgnoreCaseAndIsActiveTrue(destination.trim());

        if (packages.isEmpty()) {
            String firstWord = destination.trim().split("\\s+")[0];
            packages = packageRepository
                    .findByDestinationNameIgnoreCaseAndIsActiveTrue(firstWord);
        }

        return ResponseEntity.ok(packages);
    }
}
