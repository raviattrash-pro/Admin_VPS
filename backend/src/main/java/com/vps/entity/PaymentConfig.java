package com.vps.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment_config")
public class PaymentConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String upiId;
    private String qrCodePath;
    private String accountHolderName;
    private String bankName;

    private LocalDateTime updatedAt;

    public PaymentConfig() {}

    public static PaymentConfigBuilder builder() { return new PaymentConfigBuilder(); }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUpiId() { return upiId; }
    public void setUpiId(String upiId) { this.upiId = upiId; }
    public String getQrCodePath() { return qrCodePath; }
    public void setQrCodePath(String qrCodePath) { this.qrCodePath = qrCodePath; }
    public String getAccountHolderName() { return accountHolderName; }
    public void setAccountHolderName(String accountHolderName) { this.accountHolderName = accountHolderName; }
    public String getBankName() { return bankName; }
    public void setBankName(String bankName) { this.bankName = bankName; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public static class PaymentConfigBuilder {
        private String upiId;
        public PaymentConfigBuilder upiId(String upiId) { this.upiId = upiId; return this; }
        public PaymentConfig build() {
            PaymentConfig c = new PaymentConfig();
            c.setUpiId(upiId);
            return c;
        }
    }
}
