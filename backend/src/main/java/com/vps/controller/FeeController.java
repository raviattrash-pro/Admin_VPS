package com.vps.controller;

import com.vps.dto.ApiResponse;
import com.vps.entity.FeeRecord;
import com.vps.entity.Student;
import com.vps.entity.User;
import com.vps.service.FeeService;
import com.vps.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class FeeController {

    private final FeeService feeService;
    private final StudentService studentService;

    // Student: Submit online payment
    @PostMapping("/fees/pay")
    public ResponseEntity<?> submitOnlinePayment(
            @AuthenticationPrincipal User user,
            @RequestParam BigDecimal amount,
            @RequestParam(required = false) String feeType,
            @RequestParam(required = false) String transactionId,
            @RequestParam(value = "screenshot", required = false) MultipartFile screenshot) {
        try {
            Student student = studentService.getStudentByUserId(user.getId());
            FeeRecord record = feeService.submitOnlinePayment(student.getId(), amount, feeType,
                    transactionId, screenshot);
            return ResponseEntity.ok(ApiResponse.success("Payment submitted for verification", record));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // Student: Get my fees
    @GetMapping("/fees/my")
    public ResponseEntity<?> getMyFees(@AuthenticationPrincipal User user) {
        try {
            Student student = studentService.getStudentByUserId(user.getId());
            List<FeeRecord> fees = feeService.getStudentFees(student.getId());
            return ResponseEntity.ok(ApiResponse.success("Fees fetched", fees));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // Admin: Record offline payment
    @PostMapping("/admin/fees/offline")
    public ResponseEntity<?> recordOfflinePayment(
            @AuthenticationPrincipal User admin,
            @RequestParam Long studentId,
            @RequestParam BigDecimal amount,
            @RequestParam(required = false) String feeType,
            @RequestParam(required = false) String remarks) {
        try {
            FeeRecord record = feeService.recordOfflinePayment(studentId, amount, feeType,
                    remarks, admin.getFullName());
            return ResponseEntity.ok(ApiResponse.success("Offline payment recorded", record));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // Admin: Verify payment
    @PutMapping("/admin/fees/{id}/verify")
    public ResponseEntity<?> verifyPayment(
            @AuthenticationPrincipal User admin,
            @PathVariable Long id,
            @RequestParam boolean approved) {
        try {
            FeeRecord record = feeService.verifyPayment(id, approved, admin.getFullName());
            return ResponseEntity.ok(ApiResponse.success(
                    approved ? "Payment verified" : "Payment rejected", record));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // Admin: Get pending payments
    @GetMapping("/admin/fees/pending")
    public ResponseEntity<?> getPendingPayments() {
        List<FeeRecord> pending = feeService.getPendingPayments();
        return ResponseEntity.ok(ApiResponse.success("Pending payments fetched", pending));
    }

    // Admin: Get all fees
    @GetMapping("/admin/fees")
    public ResponseEntity<?> getAllFees() {
        List<FeeRecord> fees = feeService.getAllFees();
        return ResponseEntity.ok(ApiResponse.success("All fees fetched", fees));
    }
 
    // Admin: Get fees for specific student
    @GetMapping("/admin/fees/student/{studentId}")
    public ResponseEntity<?> getStudentFeesForAdmin(@PathVariable Long studentId) {
        try {
            List<FeeRecord> fees = feeService.getStudentFees(studentId);
            return ResponseEntity.ok(ApiResponse.success("Student fees fetched", fees));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // Both: Download receipt PDF
    @GetMapping("/fees/{id}/receipt")
    public ResponseEntity<byte[]> downloadReceipt(@PathVariable Long id) {
        try {
            byte[] pdfBytes = feeService.generateReceipt(id);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=receipt-VPS-" + String.format("%06d", id) + ".pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfBytes);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
