package com.vps.controller;

import com.vps.dto.ApiResponse;
import com.vps.config.CloudinaryConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/system")
public class SystemController {

    @Autowired
    private DataSource dataSource;

    @Autowired(required = false)
    private CloudinaryConfig cloudinaryConfig;

    @GetMapping("/health")
    public ResponseEntity<ApiResponse> getHealth() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("timestamp", System.currentTimeMillis());

        // 1. Database Check
        Map<String, String> dbStatus = new HashMap<>();
        try (Connection ignored = dataSource.getConnection()) {
            dbStatus.put("status", "CONNECTED");
            dbStatus.put("database", "MySQL");
        } catch (Exception e) {
            dbStatus.put("status", "DISCONNECTED");
            dbStatus.put("error", e.getMessage());
            health.put("status", "DEGRADED");
        }
        health.put("database", dbStatus);

        // 2. Storage Check
        Map<String, String> storageStatus = new HashMap<>();
        if (cloudinaryConfig != null && cloudinaryConfig.cloudinary() != null) {
            storageStatus.put("provider", "Cloudinary (Cloud)");
            storageStatus.put("status", "ACTIVE");
        } else {
            storageStatus.put("provider", "Local (Fallback)");
            storageStatus.put("status", "ACTIVE");
        }
        health.put("storage", storageStatus);

        // 3. System Resources
        Runtime runtime = Runtime.getRuntime();
        Map<String, Object> resources = new HashMap<>();
        resources.put("totalMemoryMB", runtime.totalMemory() / 1024 / 1024);
        resources.put("freeMemoryMB", runtime.freeMemory() / 1024 / 1024);
        resources.put("usedMemoryMB", (runtime.totalMemory() - runtime.freeMemory()) / 1024 / 1024);
        resources.put("maxMemoryMB", runtime.maxMemory() / 1024 / 1024);
        resources.put("processors", runtime.availableProcessors());
        health.put("resources", resources);

        return ResponseEntity.ok(ApiResponse.success("System health metrics", health));
    }
    
    @GetMapping("/environment")
    public ResponseEntity<ApiResponse> getEnvironment() {
        Map<String, String> diagnosis = new HashMap<>();
        diagnosis.put("environment", System.getenv("RENDER") != null ? "Render" : "Local/Vercel");
        diagnosis.put("javaVersion", System.getProperty("java.version"));
        diagnosis.put("os", System.getProperty("os.name"));
        return ResponseEntity.ok(ApiResponse.success("Environment info", diagnosis));
    }
}
