package com.nextroute.repository;

import com.nextroute.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

/**
 * BookingRepository — fetches bookings for a specific user.
 * Orders by creation date descending (newest first).
 */
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);
}
