package com.nextroute.dto;

public class ReviewDTO {

    public static class ReviewRequest {
        private Integer rating;
        private String text;

        public Integer getRating() { return rating; }
        public void setRating(Integer rating) { this.rating = rating; }
        public String getText() { return text; }
        public void setText(String text) { this.text = text; }
    }

    // Returns the user's display name instead of their ID for privacy
    public static class ReviewResponse {
        private Long id;
        private String userName;
        private Integer rating;
        private String text;
        private String createdAt;

        public ReviewResponse(Long id, String userName, Integer rating, String text, String createdAt) {
            this.id = id;
            this.userName = userName;
            this.rating = rating;
            this.text = text;
            this.createdAt = createdAt;
        }

        public Long getId() { return id; }
        public String getUserName() { return userName; }
        public Integer getRating() { return rating; }
        public String getText() { return text; }
        public String getCreatedAt() { return createdAt; }
    }
}
