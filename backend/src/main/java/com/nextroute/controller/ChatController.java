package com.nextroute.controller;

import com.nextroute.dto.ChatDTO.*;
import com.nextroute.model.ChatMessage;
import com.nextroute.model.ChatMessage.SenderRole;
import com.nextroute.repository.ChatMessageRepository;
import com.nextroute.repository.UserRepository;
import com.nextroute.util.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatController(ChatMessageRepository chatMessageRepository,
                          UserRepository userRepository,
                          JwtUtil jwtUtil,
                          SimpMessagingTemplate messagingTemplate) {
        this.chatMessageRepository = chatMessageRepository;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * WebSocket handler — user sends a chat message.
     * Routed here when client sends to /app/chat.send
     */
    @MessageMapping("/chat.send")
    public void handleUserMessage(ChatRequest request) {
        try {
            var claims = jwtUtil.validateToken(request.getToken());
            Long userId = claims.get("userId", Long.class);
            String userName = claims.get("name", String.class);
            String role = claims.get("role", String.class);

            String roomId = "user_" + userId;
            SenderRole senderRole = "ADMIN".equals(role) ? SenderRole.ADMIN : SenderRole.USER;

            ChatMessage msg = new ChatMessage(userId, userName, senderRole, roomId, request.getMessage());
            chatMessageRepository.save(msg);

            ChatResponse response = new ChatResponse(
                    msg.getId(), userId, userName, senderRole.name(),
                    roomId, msg.getMessage(), msg.getSentAt().toString()
            );

            messagingTemplate.convertAndSend("/topic/chat." + roomId, response);
            messagingTemplate.convertAndSend("/topic/admin.chats", response);

        } catch (Exception e) {
            System.err.println("Chat error: " + e.getMessage());
        }
    }

    /**
     * WebSocket handler — admin replies to a user's chat.
     * Routed here when admin sends to /app/chat.reply
     */
    @MessageMapping("/chat.reply")
    public void handleAdminReply(ChatRequest request) {
        try {
            var claims = jwtUtil.validateToken(request.getToken());
            String role = claims.get("role", String.class);

            if (!"ADMIN".equals(role)) return; // Only admin can reply

            Long adminId = claims.get("userId", Long.class);
            String adminName = claims.get("name", String.class);
            String roomId = request.getRoomId(); // e.g., "user_5"

            ChatMessage msg = new ChatMessage(adminId, adminName, SenderRole.ADMIN, roomId, request.getMessage());
            chatMessageRepository.save(msg);

            ChatResponse response = new ChatResponse(
                    msg.getId(), adminId, adminName, "ADMIN",
                    roomId, msg.getMessage(), msg.getSentAt().toString()
            );

            messagingTemplate.convertAndSend("/topic/chat." + roomId, response);
            messagingTemplate.convertAndSend("/topic/admin.chats", response);

        } catch (Exception e) {
            System.err.println("Admin reply error: " + e.getMessage());
        }
    }

    /**
     * REST — get chat history for a room.
     */
    @GetMapping("/history")
    public ResponseEntity<?> getChatHistory(
            @RequestParam String roomId,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Login required"));
        }

        try {
            String token = authHeader.substring(7);
            Long userId = jwtUtil.getUserId(token);
            String role = jwtUtil.getRole(token);

            if (!"ADMIN".equals(role) && !roomId.equals("user_" + userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Access denied"));
            }

            List<ChatMessage> messages = chatMessageRepository.findByRoomIdOrderBySentAtAsc(roomId);
            List<ChatResponse> response = messages.stream()
                    .map(m -> new ChatResponse(m.getId(), m.getSenderId(), m.getSenderName(),
                            m.getSenderRole().name(), m.getRoomId(), m.getMessage(), m.getSentAt().toString()))
                    .collect(Collectors.toList());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid token"));
        }
    }

    /**
     * REST — admin gets list of all active chat rooms.
     */
    @GetMapping("/rooms")
    public ResponseEntity<?> getChatRooms(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Login required"));
        }

        try {
            String token = authHeader.substring(7);
            String role = jwtUtil.getRole(token);

            if (!"ADMIN".equals(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Admin access required"));
            }

            List<ChatMessage> latestMessages = chatMessageRepository.findLatestMessagePerRoom();
            List<ChatResponse> response = latestMessages.stream()
                    .map(m -> {
                        ChatResponse cr = new ChatResponse(m.getId(), m.getSenderId(), m.getSenderName(),
                                m.getSenderRole().name(), m.getRoomId(), m.getMessage(), m.getSentAt().toString());
                        // Extract userId from roomId (format: "user_{id}") and look up name
                        try {
                            Long roomUserId = Long.parseLong(m.getRoomId().replace("user_", ""));
                            userRepository.findById(roomUserId)
                                    .ifPresent(u -> cr.setUserName(u.getName()));
                        } catch (NumberFormatException ignored) {}
                        return cr;
                    })
                    .collect(Collectors.toList());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid token"));
        }
    }
}
