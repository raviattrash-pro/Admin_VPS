package com.vps.controller;

import com.vps.dto.ApiResponse;
import com.vps.entity.User;
import com.vps.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/users")
public class AdminManagementController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminManagementController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public ResponseEntity<?> getUsers(@RequestParam User.Role role) {
        List<User> users = userRepository.findByRole(role);
        return ResponseEntity.ok(ApiResponse.success("Users fetched", users));
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody Map<String, String> body, @AuthenticationPrincipal User currentUser) {
        String username = body.get("username");
        String password = body.get("password");
        String fullName = body.get("fullName");
        User.Role role = User.Role.valueOf(body.get("role"));

        if ((role == User.Role.ADMIN || role == User.Role.SYSTEM_ADMIN) && currentUser.getRole() != User.Role.SYSTEM_ADMIN) {
            return ResponseEntity.status(403).body(ApiResponse.error("Only system administrators can create new administrators"));
        }

        if (userRepository.existsByUsername(username)) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Username already exists"));
        }

        User user = User.builder()
                .username(username)
                .password(passwordEncoder.encode(password))
                .fullName(fullName)
                .role(role)
                .build();
        userRepository.save(user);

        return ResponseEntity.ok(ApiResponse.success(role + " created successfully", user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id, @AuthenticationPrincipal User currentUser) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if ((user.getRole() == User.Role.ADMIN || user.getRole() == User.Role.SYSTEM_ADMIN) && currentUser.getRole() != User.Role.SYSTEM_ADMIN) {
            return ResponseEntity.status(403).body(ApiResponse.error("Only system administrators can delete administrative accounts"));
        }

        userRepository.delete(user);
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully"));
    }

    @PutMapping("/{id}/reset-password")
    public ResponseEntity<?> resetUserPassword(@PathVariable Long id, @AuthenticationPrincipal User currentUser) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if ((user.getRole() == User.Role.ADMIN || user.getRole() == User.Role.SYSTEM_ADMIN) && currentUser.getRole() != User.Role.SYSTEM_ADMIN) {
            return ResponseEntity.status(403).body(ApiResponse.error("Only system administrators can reset administrative passwords"));
        }

        user.setPassword(passwordEncoder.encode("vps@123"));
        userRepository.save(user);

        return ResponseEntity.ok(ApiResponse.success("Password reset to default: vps@123"));
    }
}
