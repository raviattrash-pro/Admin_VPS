package com.vps.controller;

import com.vps.dto.ApiResponse;
import com.vps.dto.LoginRequest;
import com.vps.dto.LoginResponse;
import com.vps.entity.User;
import com.vps.repository.UserRepository;
import com.vps.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.vps.util.FileStorageUtil;

import java.util.Map;

@RestController
@RequestMapping("")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final FileStorageUtil fileStorageUtil;

    public AuthController(AuthService authService, UserRepository userRepository, 
                          PasswordEncoder passwordEncoder, FileStorageUtil fileStorageUtil) {
        this.authService = authService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.fileStorageUtil = fileStorageUtil;
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            LoginResponse response = authService.login(request);
            return ResponseEntity.ok(ApiResponse.success("Login successful", response));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

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

    @PutMapping("/admin/reset-password/{userId}")
    public ResponseEntity<?> resetPassword(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode("123456"));
        userRepository.save(user);

        return ResponseEntity.ok(ApiResponse.success("Password reset to default (123456) for user: " + user.getUsername()));
    }

    @PostMapping("/auth/profile/photo")
    public ResponseEntity<?> uploadProfilePhoto(@AuthenticationPrincipal User user,
                                                  @RequestParam("file") MultipartFile file) {
        try {
            User dbUser = userRepository.findById(user.getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String filePath = fileStorageUtil.storeFile(file, "photos");
            dbUser.setPhotographPath(filePath);
            userRepository.save(dbUser);

            return ResponseEntity.ok(ApiResponse.success("Profile photo updated successfully", filePath));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to upload photo: " + e.getMessage()));
        }
    }
}
