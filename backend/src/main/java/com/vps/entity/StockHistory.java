package com.vps.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "stock_history")
public class StockHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "stock_item_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private StockItem stockItem;

    @Column(nullable = false)
    private String action;

    private Integer quantityChanged;
    private Integer quantityBefore;
    private Integer quantityAfter;

    private String issuedTo;
    private String remarks;
    private String performedBy;

    private LocalDateTime createdAt;

    public StockHistory() {}

    public static StockHistoryBuilder builder() { return new StockHistoryBuilder(); }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public StockItem getStockItem() { return stockItem; }
    public void setStockItem(StockItem stockItem) { this.stockItem = stockItem; }
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    public Integer getQuantityChanged() { return quantityChanged; }
    public void setQuantityChanged(Integer quantityChanged) { this.quantityChanged = quantityChanged; }
    public Integer getQuantityBefore() { return quantityBefore; }
    public void setQuantityBefore(Integer quantityBefore) { this.quantityBefore = quantityBefore; }
    public Integer getQuantityAfter() { return quantityAfter; }
    public void setQuantityAfter(Integer quantityAfter) { this.quantityAfter = quantityAfter; }
    public String getIssuedTo() { return issuedTo; }
    public void setIssuedTo(String issuedTo) { this.issuedTo = issuedTo; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public String getPerformedBy() { return performedBy; }
    public void setPerformedBy(String performedBy) { this.performedBy = performedBy; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public static class StockHistoryBuilder {
        private StockItem stockItem;
        private String action;
        private Integer quantityChanged;
        private Integer quantityBefore;
        private Integer quantityAfter;
        private String issuedTo;
        private String remarks;
        private String performedBy;

        public StockHistoryBuilder stockItem(StockItem stockItem) { this.stockItem = stockItem; return this; }
        public StockHistoryBuilder action(String action) { this.action = action; return this; }
        public StockHistoryBuilder quantityChanged(Integer quantityChanged) { this.quantityChanged = quantityChanged; return this; }
        public StockHistoryBuilder quantityBefore(Integer quantityBefore) { this.quantityBefore = quantityBefore; return this; }
        public StockHistoryBuilder quantityAfter(Integer quantityAfter) { this.quantityAfter = quantityAfter; return this; }
        public StockHistoryBuilder issuedTo(String issuedTo) { this.issuedTo = issuedTo; return this; }
        public StockHistoryBuilder remarks(String remarks) { this.remarks = remarks; return this; }
        public StockHistoryBuilder performedBy(String performedBy) { this.performedBy = performedBy; return this; }

        public StockHistory build() {
            StockHistory h = new StockHistory();
            h.setStockItem(stockItem); h.setAction(action); h.setQuantityChanged(quantityChanged);
            h.setQuantityBefore(quantityBefore); h.setQuantityAfter(quantityAfter);
            h.setIssuedTo(issuedTo); h.setRemarks(remarks); h.setPerformedBy(performedBy);
            return h;
        }
    }
}
