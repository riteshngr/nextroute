package com.nextroute.controller;

import com.nextroute.model.Destination;
import com.nextroute.model.TravelPackage;
import com.nextroute.repository.DestinationRepository;
import com.nextroute.repository.PackageRepository;
import com.nextroute.util.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;


@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final DestinationRepository destinationRepository;
    private final PackageRepository packageRepository;
    private final JwtUtil jwtUtil;

    public AdminController(DestinationRepository destinationRepository,
                           PackageRepository packageRepository,
                           JwtUtil jwtUtil) {
        this.destinationRepository = destinationRepository;
        this.packageRepository = packageRepository;
        this.jwtUtil = jwtUtil;
    }

    // Returns null if the caller is an admin, or an error response to send back if they're not.
    private ResponseEntity<?> checkAdmin(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Login required"));
        }
        try {
            String token = authHeader.substring(7);
            String role = jwtUtil.getRole(token);
            if (!"ADMIN".equals(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Admin access required"));
            }
            return null; // authorized — caller can proceed
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid token"));
        }
    }



    @PostMapping("/destinations")
    public ResponseEntity<?> createDestination(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody Destination destination) {
        ResponseEntity<?> authError = checkAdmin(authHeader);
        if (authError != null) return authError;

        destination.setId(null);
        destinationRepository.save(destination);
        return ResponseEntity.status(HttpStatus.CREATED).body(destination);
    }

    @PutMapping("/destinations/{id}")
    public ResponseEntity<?> updateDestination(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @PathVariable Long id,
            @RequestBody Destination updated) {
        ResponseEntity<?> authError = checkAdmin(authHeader);
        if (authError != null) return authError;

        Optional<Destination> opt = destinationRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Destination not found"));
        }

        Destination dest = opt.get();
        if (updated.getName() != null) dest.setName(updated.getName());
        if (updated.getLocation() != null) dest.setLocation(updated.getLocation());
        if (updated.getDescription() != null) dest.setDescription(updated.getDescription());
        if (updated.getFullDetails() != null) dest.setFullDetails(updated.getFullDetails());
        if (updated.getPrice() != null) dest.setPrice(updated.getPrice());
        if (updated.getImageUrls() != null) dest.setImageUrls(updated.getImageUrls());
        if (updated.getNights() != null) dest.setNights(updated.getNights());
        if (updated.getOldPrice() != null) dest.setOldPrice(updated.getOldPrice());
        if (updated.getNewPrice() != null) dest.setNewPrice(updated.getNewPrice());
        if (updated.getOfferDetails() != null) dest.setOfferDetails(updated.getOfferDetails());
        if (updated.getIsActive() != null) dest.setIsActive(updated.getIsActive());

        destinationRepository.save(dest);
        return ResponseEntity.ok(dest);
    }

    @DeleteMapping("/destinations/{id}")
    public ResponseEntity<?> deleteDestination(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @PathVariable Long id) {
        ResponseEntity<?> authError = checkAdmin(authHeader);
        if (authError != null) return authError;

        if (!destinationRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Destination not found"));
        }

        destinationRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Destination deleted"));
    }

    @GetMapping("/destinations")
    public ResponseEntity<?> getAllDestinations(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        ResponseEntity<?> authError = checkAdmin(authHeader);
        if (authError != null) return authError;

        return ResponseEntity.ok(destinationRepository.findAll());
    }



    @PostMapping("/packages")
    public ResponseEntity<?> createPackage(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody TravelPackage pkg) {
        ResponseEntity<?> authError = checkAdmin(authHeader);
        if (authError != null) return authError;

        pkg.setId(null);
        packageRepository.save(pkg);
        return ResponseEntity.status(HttpStatus.CREATED).body(pkg);
    }

    @PutMapping("/packages/{id}")
    public ResponseEntity<?> updatePackage(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @PathVariable Long id,
            @RequestBody TravelPackage updated) {
        ResponseEntity<?> authError = checkAdmin(authHeader);
        if (authError != null) return authError;

        Optional<TravelPackage> opt = packageRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Package not found"));
        }

        TravelPackage pkg = opt.get();
        if (updated.getDestinationName() != null) pkg.setDestinationName(updated.getDestinationName());
        if (updated.getName() != null) pkg.setName(updated.getName());
        if (updated.getPrice() != null) pkg.setPrice(updated.getPrice());
        if (updated.getNights() != null) pkg.setNights(updated.getNights());
        if (updated.getColor() != null) pkg.setColor(updated.getColor());
        if (updated.getIsPopular() != null) pkg.setIsPopular(updated.getIsPopular());
        if (updated.getFeatures() != null) pkg.setFeatures(updated.getFeatures());
        if (updated.getIsActive() != null) pkg.setIsActive(updated.getIsActive());

        packageRepository.save(pkg);
        return ResponseEntity.ok(pkg);
    }

    @DeleteMapping("/packages/{id}")
    public ResponseEntity<?> deletePackage(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @PathVariable Long id) {
        ResponseEntity<?> authError = checkAdmin(authHeader);
        if (authError != null) return authError;

        if (!packageRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Package not found"));
        }

        packageRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Package deleted"));
    }

    @GetMapping("/packages")
    public ResponseEntity<?> getAllPackages(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        ResponseEntity<?> authError = checkAdmin(authHeader);
        if (authError != null) return authError;

        return ResponseEntity.ok(packageRepository.findAll());
    }
}
