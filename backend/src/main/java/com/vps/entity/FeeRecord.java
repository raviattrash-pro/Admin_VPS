package com.vps.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "fee_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
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

    private String feeType; // Tuition, Transport, Exam, etc.

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentMode paymentMode; // ONLINE / OFFLINE

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status; // PENDING / VERIFIED / REJECTED

    private String screenshotPath; // For online payments
    private String transactionId;
    private String remarks;

    private LocalDateTime paidAt;
    private LocalDateTime verifiedAt;
    private String verifiedBy;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.paidAt == null) this.paidAt = LocalDateTime.now();
    }

    public enum PaymentMode {
        ONLINE, OFFLINE
    }

    public enum PaymentStatus {
        PENDING, VERIFIED, REJECTED
    }
}
