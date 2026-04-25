package com.nextroute.controller;

import com.nextroute.dto.ReviewDTO.*;
import com.nextroute.model.Review;
import com.nextroute.model.User;
import com.nextroute.repository.ReviewRepository;
import com.nextroute.repository.UserRepository;
import com.nextroute.util.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public ReviewController(ReviewRepository reviewRepository, UserRepository userRepository, JwtUtil jwtUtil) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public ResponseEntity<List<ReviewResponse>> getReviews(
            @RequestParam(defaultValue = "10") int count) {
        List<Review> reviews = reviewRepository.findRandomReviews(Math.min(count, 30));
        List<ReviewResponse> response = reviews.stream()
                .map(r -> new ReviewResponse(
                        r.getId(),
                        r.getUser().getName(),
                        r.getRating(),
                        r.getText(),
                        r.getCreatedAt().toString()
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<?> createReview(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody ReviewRequest request) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Login required to submit a review"));
        }

        try {
            String token = authHeader.substring(7);
            Long userId = jwtUtil.getUserId(token);
            User user = userRepository.findById(userId).orElse(null);

            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "User not found"));
            }

            if (request.getRating() == null || request.getRating() < 1 || request.getRating() > 5) {
                return ResponseEntity.badRequest().body(Map.of("error", "Rating must be between 1 and 5"));
            }
            if (request.getText() == null || request.getText().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Review text is required"));
            }

            Review review = new Review(user, request.getRating(), request.getText().trim());
            reviewRepository.save(review);

            ReviewResponse response = new ReviewResponse(
                    review.getId(), user.getName(), review.getRating(),
                    review.getText(), review.getCreatedAt().toString()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid token"));
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReview(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @PathVariable Long id) {
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            String token = authHeader.substring(7);
            Long userId = jwtUtil.getUserId(token);
            User user = userRepository.findById(userId).orElse(null);

            if (user == null || !"ADMIN".equals(user.getRole().name())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Admin only"));
            }

            reviewRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Review deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<ReviewResponse>> getAllReviews(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            String token = authHeader.substring(7);
            Long userId = jwtUtil.getUserId(token);
            User user = userRepository.findById(userId).orElse(null);

            if (user == null || !"ADMIN".equals(user.getRole().name())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            List<Review> reviews = reviewRepository.findAll();
            List<ReviewResponse> response = reviews.stream()
                    .map(r -> new ReviewResponse(
                            r.getId(),
                            r.getUser().getName(),
                            r.getRating(),
                            r.getText(),
                            r.getCreatedAt().toString()
                    ))
                    .collect(Collectors.toList());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
