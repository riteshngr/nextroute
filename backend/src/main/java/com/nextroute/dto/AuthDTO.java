package com.nextroute.dto;

/**
 * DTOs (Data Transfer Objects) — used to shape the JSON request/response bodies.
 * These are simple classes that define what data the API expects and returns.
 * We use inner classes here to keep things compact.
 */
public class AuthDTO {

    /** Request body for signup: { name, email, password } */
    public static class SignupRequest {
        private String name;
        private String email;
        private String password;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    /** Request body for login: { email, password } */
    public static class LoginRequest {
        private String email;
        private String password;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    /** Response body for auth: { token, user: { id, name, email, role } } */
    public static class AuthResponse {
        private String token;
        private UserInfo user;

        public AuthResponse(String token, UserInfo user) {
            this.token = token;
            this.user = user;
        }

        public String getToken() { return token; }
        public UserInfo getUser() { return user; }
    }

    /** User info included in auth response (no password!) */
    public static class UserInfo {
        private Long id;
        private String name;
        private String email;
        private String role;

        public UserInfo(Long id, String name, String email, String role) {
            this.id = id;
            this.name = name;
            this.email = email;
            this.role = role;
        }

        public Long getId() { return id; }
        public String getName() { return name; }
        public String getEmail() { return email; }
        public String getRole() { return role; }
    }
}
