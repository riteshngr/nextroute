package com.nextroute.controller;

import com.nextroute.dto.BookingDTO.*;
import com.nextroute.model.Booking;
import com.nextroute.model.User;
import com.nextroute.repository.BookingRepository;
import com.nextroute.repository.UserRepository;
import com.nextroute.util.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public BookingController(BookingRepository bookingRepository, UserRepository userRepository, JwtUtil jwtUtil) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping
    public ResponseEntity<?> createBooking(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody BookingRequest request) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Login required to book"));
        }

        try {
            String token = authHeader.substring(7);
            Long userId = jwtUtil.getUserId(token);
            User user = userRepository.findById(userId).orElse(null);

            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "User not found"));
            }

            Booking booking = new Booking();
            booking.setUser(user);
            booking.setDestination(request.getDestination());
            booking.setFromDate(LocalDate.parse(request.getFromDate()));
            booking.setToDate(request.getToDate() != null && !request.getToDate().isEmpty()
                    ? LocalDate.parse(request.getToDate()) : null);
            booking.setPersons(request.getPersons());
            booking.setPackageName(request.getPackageName());
            booking.setTotalPrice(request.getTotalPrice());

            bookingRepository.save(booking);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("message", "Booking confirmed!", "bookingId", booking.getId()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Failed to create booking: " + e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getBookings(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Login required"));
        }

        try {
            String token = authHeader.substring(7);
            Long userId = jwtUtil.getUserId(token);

            List<Booking> bookings = bookingRepository.findByUserIdOrderByCreatedAtDesc(userId);
            List<BookingResponse> response = bookings.stream()
                    .map(b -> new BookingResponse(
                            b.getId(),
                            b.getDestination(),
                            b.getFromDate().toString(),
                            b.getToDate() != null ? b.getToDate().toString() : "",
                            b.getPersons(),
                            b.getPackageName(),
                            b.getTotalPrice(),
                            b.getStatus().name(),
                            b.getCreatedAt().toString()
                    ))
                    .collect(Collectors.toList());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid token"));
        }
    }
}
