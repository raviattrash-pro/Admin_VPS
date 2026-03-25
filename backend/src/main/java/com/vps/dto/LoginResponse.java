package com.vps.dto;

public class LoginResponse {
    private String token;
    private String role;
    private String fullName;
    private Long userId;
    private String photographPath;

    public LoginResponse() {}

    public LoginResponse(String token, String role, String fullName, Long userId, String photographPath) {
        this.token = token;
        this.role = role;
        this.fullName = fullName;
        this.userId = userId;
        this.photographPath = photographPath;
    }

    public static LoginResponseBuilder builder() {
        return new LoginResponseBuilder();
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getPhotographPath() { return photographPath; }
    public void setPhotographPath(String photographPath) { this.photographPath = photographPath; }

    public static class LoginResponseBuilder {
        private String token;
        private String role;
        private String fullName;
        private Long userId;
        private String photographPath;

        public LoginResponseBuilder token(String token) {
            this.token = token;
            return this;
        }

        public LoginResponseBuilder role(String role) {
            this.role = role;
            return this;
        }

        public LoginResponseBuilder fullName(String fullName) {
            this.fullName = fullName;
            return this;
        }

        public LoginResponseBuilder userId(Long userId) {
            this.userId = userId;
            return this;
        }

        public LoginResponseBuilder photographPath(String photographPath) {
            this.photographPath = photographPath;
            return this;
        }

        public LoginResponse build() {
            return new LoginResponse(token, role, fullName, userId, photographPath);
        }
    }
}
