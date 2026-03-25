package com.vps.controller;

import com.vps.dto.ApiResponse;
import com.vps.entity.User;
import com.vps.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/system")
public class SystemRepairController {

    private final JdbcTemplate jdbcTemplate;
    private final UserRepository userRepository;

    public SystemRepairController(JdbcTemplate jdbcTemplate, UserRepository userRepository) {
        this.jdbcTemplate = jdbcTemplate;
        this.userRepository = userRepository;
    }

    @GetMapping("/diagnose")
    public ResponseEntity<?> diagnose(@AuthenticationPrincipal User currentUser) {
        if (currentUser == null) return ResponseEntity.status(401).body(ApiResponse.error("Not authenticated"));
        
        return ResponseEntity.ok(ApiResponse.success("User Info", java.util.Map.of(
            "username", currentUser.getUsername(),
            "role", currentUser.getRole(),
            "authorities", org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getAuthorities()
        )));
    }

    @PostMapping("/repair-db")
    public ResponseEntity<?> repairDb(@AuthenticationPrincipal User currentUser) {
        if (currentUser.getRole() != User.Role.SYSTEM_ADMIN) {
            return ResponseEntity.status(403).body(ApiResponse.error("Only system administrators can perform DB repairs"));
        }

        try {
            jdbcTemplate.execute("ALTER TABLE users MODIFY COLUMN role VARCHAR(50)");
            return ResponseEntity.ok(ApiResponse.success("Database schema repaired: 'role' column updated to VARCHAR(50)"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Repair failed: " + e.getMessage()));
        }
    }
}
