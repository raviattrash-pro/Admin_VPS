package com.vps.repository;

import com.vps.entity.StockHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StockHistoryRepository extends JpaRepository<StockHistory, Long> {
    List<StockHistory> findByStockItemIdOrderByCreatedAtDesc(Long stockItemId);
    List<StockHistory> findAllByOrderByCreatedAtDesc();
}
