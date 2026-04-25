package com.nextroute.repository;

import com.nextroute.model.ChatMessage;
import com.nextroute.model.ChatMessage.SenderRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

/**
 * ChatMessageRepository — fetches chat messages by room and recent conversations.
 * roomId is typically "user_{userId}" for user-to-support chats.
 */
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    List<ChatMessage> findByRoomIdOrderBySentAtAsc(String roomId);

    /**
     * Gets the latest message from each unique room — used by admin
     * to see all active chat conversations at a glance.
     */
    @Query(value = "SELECT * FROM chat_messages cm1 WHERE cm1.sent_at = " +
           "(SELECT MAX(cm2.sent_at) FROM chat_messages cm2 WHERE cm2.room_id = cm1.room_id) " +
           "ORDER BY cm1.sent_at DESC", nativeQuery = true)
    List<ChatMessage> findLatestMessagePerRoom();

    Optional<ChatMessage> findFirstByRoomIdAndSenderRoleOrderBySentAtAsc(String roomId, SenderRole senderRole);
}
