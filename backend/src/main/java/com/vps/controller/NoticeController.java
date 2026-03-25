package com.vps.controller;

import com.vps.dto.ApiResponse;
import com.vps.entity.Notice;
import com.vps.entity.User;
import com.vps.service.NoticeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("")
public class NoticeController {

    private final NoticeService noticeService;

    public NoticeController(NoticeService noticeService) {
        this.noticeService = noticeService;
    }

    @GetMapping("/notices")
    public ResponseEntity<?> getActiveNotices() {
        List<Notice> notices = noticeService.getActiveNotices();
        return ResponseEntity.ok(ApiResponse.success("Notices fetched", notices));
    }

    @GetMapping("/admin/notices")
    public ResponseEntity<?> getAllNotices() {
        List<Notice> notices = noticeService.getAllNotices();
        return ResponseEntity.ok(ApiResponse.success("All notices fetched", notices));
    }

    @PostMapping("/admin/notices")
    public ResponseEntity<?> createNotice(@RequestBody Notice notice, @AuthenticationPrincipal User admin) {
        notice.setPostedBy(admin.getFullName());
        Notice saved = noticeService.createNotice(notice);
        return ResponseEntity.ok(ApiResponse.success("Notice posted", saved));
    }

    @PutMapping("/admin/notices/{id}")
    public ResponseEntity<?> updateNotice(@PathVariable Long id, @RequestBody Notice notice) {
        try {
            Notice updated = noticeService.updateNotice(id, notice);
            return ResponseEntity.ok(ApiResponse.success("Notice updated", updated));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/admin/notices/{id}")
    public ResponseEntity<?> deleteNotice(@PathVariable Long id) {
        noticeService.deleteNotice(id);
        return ResponseEntity.ok(ApiResponse.success("Notice deleted"));
    }
}
