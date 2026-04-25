package com.nextroute.dto;

/**
 * DTOs for booking operations.
 */
public class BookingDTO {

    /** Request body for creating a booking */
    public static class BookingRequest {
        private String destination;
        private String fromDate;
        private String toDate;
        private Integer persons;
        private String packageName;
        private Integer totalPrice;

        public String getDestination() { return destination; }
        public void setDestination(String destination) { this.destination = destination; }
        public String getFromDate() { return fromDate; }
        public void setFromDate(String fromDate) { this.fromDate = fromDate; }
        public String getToDate() { return toDate; }
        public void setToDate(String toDate) { this.toDate = toDate; }
        public Integer getPersons() { return persons; }
        public void setPersons(Integer persons) { this.persons = persons; }
        public String getPackageName() { return packageName; }
        public void setPackageName(String packageName) { this.packageName = packageName; }
        public Integer getTotalPrice() { return totalPrice; }
        public void setTotalPrice(Integer totalPrice) { this.totalPrice = totalPrice; }
    }

    /** Response body for a booking */
    public static class BookingResponse {
        private Long id;
        private String destination;
        private String fromDate;
        private String toDate;
        private Integer persons;
        private String packageName;
        private Integer totalPrice;
        private String status;
        private String createdAt;

        public BookingResponse(Long id, String destination, String fromDate, String toDate,
                               Integer persons, String packageName, Integer totalPrice,
                               String status, String createdAt) {
            this.id = id;
            this.destination = destination;
            this.fromDate = fromDate;
            this.toDate = toDate;
            this.persons = persons;
            this.packageName = packageName;
            this.totalPrice = totalPrice;
            this.status = status;
            this.createdAt = createdAt;
        }

        public Long getId() { return id; }
        public String getDestination() { return destination; }
        public String getFromDate() { return fromDate; }
        public String getToDate() { return toDate; }
        public Integer getPersons() { return persons; }
        public String getPackageName() { return packageName; }
        public Integer getTotalPrice() { return totalPrice; }
        public String getStatus() { return status; }
        public String getCreatedAt() { return createdAt; }
    }
}
