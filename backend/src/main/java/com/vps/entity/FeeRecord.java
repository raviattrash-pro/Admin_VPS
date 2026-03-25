package com.vps.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "fee_records")
public class FeeRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Student student;

    @Column(nullable = false)
    private BigDecimal amount;

    private String feeType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentMode paymentMode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status;

    private String screenshotPath;
    private String transactionId;
    private String remarks;

    private LocalDateTime paidAt;
    private LocalDateTime verifiedAt;
    private String verifiedBy;

    private LocalDateTime createdAt;

    public FeeRecord() {}

    public static FeeRecordBuilder builder() { return new FeeRecordBuilder(); }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public String getFeeType() { return feeType; }
    public void setFeeType(String feeType) { this.feeType = feeType; }
    public PaymentMode getPaymentMode() { return paymentMode; }
    public void setPaymentMode(PaymentMode paymentMode) { this.paymentMode = paymentMode; }
    public PaymentStatus getStatus() { return status; }
    public void setStatus(PaymentStatus status) { this.status = status; }
    public String getScreenshotPath() { return screenshotPath; }
    public void setScreenshotPath(String screenshotPath) { this.screenshotPath = screenshotPath; }
    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public LocalDateTime getPaidAt() { return paidAt; }
    public void setPaidAt(LocalDateTime paidAt) { this.paidAt = paidAt; }
    public LocalDateTime getVerifiedAt() { return verifiedAt; }
    public void setVerifiedAt(LocalDateTime verifiedAt) { this.verifiedAt = verifiedAt; }
    public String getVerifiedBy() { return verifiedBy; }
    public void setVerifiedBy(String verifiedBy) { this.verifiedBy = verifiedBy; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.paidAt == null) this.paidAt = LocalDateTime.now();
    }

    public enum PaymentMode { ONLINE, OFFLINE }
    public enum PaymentStatus { PENDING, VERIFIED, REJECTED }

    public static class FeeRecordBuilder {
        private Student student;
        private BigDecimal amount;
        private String feeType;
        private PaymentMode paymentMode;
        private PaymentStatus status;
        private String screenshotPath;
        private String transactionId;
        private String remarks;
        private LocalDateTime verifiedAt;
        private String verifiedBy;

        public FeeRecordBuilder student(Student student) { this.student = student; return this; }
        public FeeRecordBuilder amount(BigDecimal amount) { this.amount = amount; return this; }
        public FeeRecordBuilder feeType(String feeType) { this.feeType = feeType; return this; }
        public FeeRecordBuilder paymentMode(PaymentMode paymentMode) { this.paymentMode = paymentMode; return this; }
        public FeeRecordBuilder status(PaymentStatus status) { this.status = status; return this; }
        public FeeRecordBuilder screenshotPath(String screenshotPath) { this.screenshotPath = screenshotPath; return this; }
        public FeeRecordBuilder transactionId(String transactionId) { this.transactionId = transactionId; return this; }
        public FeeRecordBuilder remarks(String remarks) { this.remarks = remarks; return this; }
        public FeeRecordBuilder verifiedAt(LocalDateTime verifiedAt) { this.verifiedAt = verifiedAt; return this; }
        public FeeRecordBuilder verifiedBy(String verifiedBy) { this.verifiedBy = verifiedBy; return this; }

        public FeeRecord build() {
            FeeRecord r = new FeeRecord();
            r.setStudent(student); r.setAmount(amount); r.setFeeType(feeType);
            r.setPaymentMode(paymentMode); r.setStatus(status); r.setScreenshotPath(screenshotPath);
            r.setTransactionId(transactionId); r.setRemarks(remarks);
            r.setVerifiedAt(verifiedAt); r.setVerifiedBy(verifiedBy);
            return r;
        }
    }
}
