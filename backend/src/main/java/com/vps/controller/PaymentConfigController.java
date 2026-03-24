package com.vps.controller;

import com.vps.dto.ApiResponse;
import com.vps.entity.PaymentConfig;
import com.vps.service.PaymentConfigService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("")
@RequiredArgsConstructor
public class PaymentConfigController {

    private final PaymentConfigService paymentConfigService;

    // Public: Get payment config (students need this to see UPI/QR)
    @GetMapping("/payment-config")
    public ResponseEntity<?> getConfig() {
        PaymentConfig config = paymentConfigService.getConfig();
        return ResponseEntity.ok(ApiResponse.success("Payment config fetched", config));
    }

    // Admin: Update payment config
    @PutMapping("/admin/payment-config")
    public ResponseEntity<?> updateConfig(
            @RequestParam(required = false) String upiId,
            @RequestParam(required = false) String accountHolderName,
            @RequestParam(required = false) String bankName,
            @RequestParam(value = "qrCode", required = false) MultipartFile qrCode) {
        try {
            PaymentConfig config = paymentConfigService.updateConfig(upiId, accountHolderName, bankName, qrCode);
            return ResponseEntity.ok(ApiResponse.success("Payment config updated", config));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
