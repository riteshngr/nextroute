package com.nextroute.repository;

import com.nextroute.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

// Uses MySQL's ORDER BY RAND() to show different reviews on each page load.
public interface ReviewRepository extends JpaRepository<Review, Long> {

    @Query(value = "SELECT * FROM reviews ORDER BY RAND() LIMIT :count", nativeQuery = true)
    List<Review> findRandomReviews(@Param("count") int count);
}
