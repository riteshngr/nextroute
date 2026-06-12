package com.nextroute.repository;

import com.nextroute.model.ChatMessage;
import com.nextroute.model.ChatMessage.SenderRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    List<ChatMessage> findByRoomIdOrderBySentAtAsc(String roomId);

    // Grabs the most recent message from each room so the admin can see all active conversations
    @Query(value = "SELECT * FROM chat_messages cm1 WHERE cm1.sent_at = " +
           "(SELECT MAX(cm2.sent_at) FROM chat_messages cm2 WHERE cm2.room_id = cm1.room_id) " +
           "ORDER BY cm1.sent_at DESC", nativeQuery = true)
    List<ChatMessage> findLatestMessagePerRoom();

    Optional<ChatMessage> findFirstByRoomIdAndSenderRoleOrderBySentAtAsc(String roomId, SenderRole senderRole);
}
