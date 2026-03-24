package com.vps.controller;

import com.vps.dto.ApiResponse;
import com.vps.dto.LoginRequest;
import com.vps.dto.LoginResponse;
import com.vps.entity.User;
import com.vps.repository.UserRepository;
import com.vps.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            LoginResponse response = authService.login(request);
            return ResponseEntity.ok(ApiResponse.success("Login successful", response));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // Student: Change own password
    @PutMapping("/auth/change-password")
    public ResponseEntity<?> changePassword(@AuthenticationPrincipal User user,
                                             @RequestBody Map<String, String> body) {
        String currentPassword = body.get("currentPassword");
        String newPassword = body.get("newPassword");

        if (currentPassword == null || newPassword == null || newPassword.length() < 4) {
            return ResponseEntity.badRequest().body(ApiResponse.error("New password must be at least 4 characters"));
        }

        User dbUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(currentPassword, dbUser.getPassword())) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Current password is incorrect"));
        }

        dbUser.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(dbUser);

        return ResponseEntity.ok(ApiResponse.success("Password changed successfully"));
    }

    // Admin: Reset student password to default
    @PutMapping("/admin/reset-password/{userId}")
    public ResponseEntity<?> resetPassword(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode("123456"));
        userRepository.save(user);

        return ResponseEntity.ok(ApiResponse.success("Password reset to default (123456) for user: " + user.getUsername()));
    }
}
