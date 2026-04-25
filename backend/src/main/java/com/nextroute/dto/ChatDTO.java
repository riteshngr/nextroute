package com.nextroute.dto;

/**
 * DTO for chat messages sent via WebSocket.
 */
public class ChatDTO {

    /** Message sent from client to server */
    public static class ChatRequest {
        private String message;
        private String token;
        private String roomId;

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }
        public String getRoomId() { return roomId; }
        public void setRoomId(String roomId) { this.roomId = roomId; }
    }

    /** Message broadcast from server to clients */
    public static class ChatResponse {
        private Long id;
        private Long senderId;
        private String senderName;
        private String senderRole;
        private String roomId;
        private String message;
        private String sentAt;

        public ChatResponse() {}

        public ChatResponse(Long id, Long senderId, String senderName, String senderRole,
                            String roomId, String message, String sentAt) {
            this.id = id;
            this.senderId = senderId;
            this.senderName = senderName;
            this.senderRole = senderRole;
            this.roomId = roomId;
            this.message = message;
            this.sentAt = sentAt;
        }

        private String userName;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Long getSenderId() { return senderId; }
        public void setSenderId(Long senderId) { this.senderId = senderId; }
        public String getSenderName() { return senderName; }
        public void setSenderName(String senderName) { this.senderName = senderName; }
        public String getSenderRole() { return senderRole; }
        public void setSenderRole(String senderRole) { this.senderRole = senderRole; }
        public String getRoomId() { return roomId; }
        public void setRoomId(String roomId) { this.roomId = roomId; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        public String getSentAt() { return sentAt; }
        public void setSentAt(String sentAt) { this.sentAt = sentAt; }
        public String getUserName() { return userName; }
        public void setUserName(String userName) { this.userName = userName; }
    }
}
