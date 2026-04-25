package com.nextroute.repository;

import com.nextroute.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

/**
 * ReviewRepository — provides random review fetching.
 * findRandomReviews uses MySQL's ORDER BY RAND() to get N random reviews.
 * This is what makes the reviews section show different reviews on each refresh.
 */
public interface ReviewRepository extends JpaRepository<Review, Long> {

    @Query(value = "SELECT * FROM reviews ORDER BY RAND() LIMIT :count", nativeQuery = true)
    List<Review> findRandomReviews(@Param("count") int count);
}
