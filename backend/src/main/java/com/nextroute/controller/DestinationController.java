package com.nextroute.controller;

import com.nextroute.model.Destination;
import com.nextroute.model.Destination.DestType;
import com.nextroute.repository.DestinationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/destinations")
public class DestinationController {

    private final DestinationRepository destinationRepository;

    public DestinationController(DestinationRepository destinationRepository) {
        this.destinationRepository = destinationRepository;
    }

    @GetMapping("/must-visit")
    public ResponseEntity<List<Destination>> getMustVisit() {
        List<Destination> destinations = destinationRepository
                .findByTypeAndIsActiveTrue(DestType.MUST_VISIT);
        return ResponseEntity.ok(destinations);
    }

    @GetMapping("/special-offers")
    public ResponseEntity<List<Destination>> getSpecialOffers() {
        List<Destination> destinations = destinationRepository
                .findByTypeAndIsActiveTrue(DestType.SPECIAL_OFFER);
        return ResponseEntity.ok(destinations);
    }
}
