package com.vps.repository;

import com.vps.entity.StockItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StockItemRepository extends JpaRepository<StockItem, Long> {
    List<StockItem> findByCategory(String category);
    List<StockItem> findByCategoryAndSubType(String category, String subType);
}
