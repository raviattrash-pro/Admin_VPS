package com.vps.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "stock_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "stock_item_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private StockItem stockItem;

    @Column(nullable = false)
    private String action; // ADDED, ISSUED, UPDATED, DELETED

    private Integer quantityChanged; // positive = added, negative = issued
    private Integer quantityBefore;
    private Integer quantityAfter;

    private String issuedTo; // Student name or purpose
    private String remarks;
    private String performedBy; // Admin name

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
