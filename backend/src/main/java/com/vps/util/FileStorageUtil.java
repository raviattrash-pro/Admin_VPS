package com.vps.util;

import com.vps.service.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Component
public class FileStorageUtil {

    private final String uploadDir;
    private final CloudinaryService cloudinaryService;

    public FileStorageUtil(@Value("${file.upload-dir}") String uploadDir, 
                           @Autowired CloudinaryService cloudinaryService) {
        this.uploadDir = uploadDir;
        this.cloudinaryService = cloudinaryService;
    }

    public String storeFile(MultipartFile file, String subDir) throws IOException {
        // Use Cloudinary if configured
        if (cloudinaryService.isConfigured()) {
            return cloudinaryService.uploadFile(file, subDir);
        }

        // Fallback to local storage
        Path dirPath = Paths.get(uploadDir, subDir).toAbsolutePath().normalize();
        Files.createDirectories(dirPath);

        String originalFilename = file.getOriginalFilename();
        String ext = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            ext = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String filename = UUID.randomUUID().toString() + ext;

        Path targetPath = dirPath.resolve(filename);
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        return subDir + "/" + filename;
    }

    public void deleteFile(String filePath) throws IOException {
        if (filePath == null || filePath.isEmpty()) return;

        if (filePath.startsWith("http")) {
            // It's a Cloudinary URL, extracting public_id is complex due to versioning and folders,
            // but usually, we can just leave it or implement a more robust parser.
            // For now, Cloudinary handle cleanup or we can implement public_id storage.
            return; 
        }

        Path path = Paths.get(uploadDir, filePath).toAbsolutePath().normalize();
        Files.deleteIfExists(path);
    }
}
