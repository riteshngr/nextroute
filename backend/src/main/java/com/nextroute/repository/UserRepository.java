package com.nextroute.repository;

import com.nextroute.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

/**
 * UserRepository — Spring Data JPA auto-generates the SQL queries.
 * findByEmail is used for login (check if email exists).
 * existsByEmail is used for signup (prevent duplicate emails).
 */
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}
