package com.nextroute.repository;

import com.nextroute.model.Destination;
import com.nextroute.model.Destination.DestType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DestinationRepository extends JpaRepository<Destination, Long> {
    List<Destination> findByTypeAndIsActiveTrue(DestType type);
}
