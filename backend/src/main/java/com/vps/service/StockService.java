package com.vps.service;

import com.vps.entity.StockHistory;
import com.vps.entity.StockItem;
import com.vps.repository.StockHistoryRepository;
import com.vps.repository.StockItemRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class StockService {

    private final StockItemRepository stockItemRepository;
    private final StockHistoryRepository stockHistoryRepository;

    public StockService(StockItemRepository stockItemRepository, StockHistoryRepository stockHistoryRepository) {
        this.stockItemRepository = stockItemRepository;
        this.stockHistoryRepository = stockHistoryRepository;
    }

    @Transactional
    @CacheEvict(value = {"stockItems", "stockItemsByCategory"}, allEntries = true)
    public StockItem createItem(StockItem item, String adminName) {
        StockItem saved = stockItemRepository.save(item);
        recordHistory(saved, "ADDED", item.getQuantity(), 0, item.getQuantity(), null, "Initial stock", adminName);
        return saved;
    }

    @Cacheable("stockItems")
    public List<StockItem> getAllItems() {
        return stockItemRepository.findAll();
    }

    @Cacheable(value = "stockItemsByCategory", key = "#category")
    public List<StockItem> getItemsByCategory(String category) {
        return stockItemRepository.findByCategory(category);
    }

    @Cacheable(value = "stockItem", key = "#id")
    public StockItem getItemById(Long id) {
        return stockItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stock item not found"));
    }

    @Transactional
    @CacheEvict(value = {"stockItems", "stockItemsByCategory", "stockItem"}, allEntries = true)
    public StockItem updateItem(Long id, StockItem updated, String adminName) {
        StockItem item = getItemById(id);
        int oldQty = item.getQuantity();

        item.setCategory(updated.getCategory());
        item.setItemName(updated.getItemName());
        item.setSubType(updated.getSubType());
        item.setSize(updated.getSize());
        item.setQuantity(updated.getQuantity());
        item.setUnitPrice(updated.getUnitPrice());
        item.setDescription(updated.getDescription());
        StockItem saved = stockItemRepository.save(item);

        if (oldQty != updated.getQuantity()) {
            int change = updated.getQuantity() - oldQty;
            recordHistory(saved, "UPDATED", change, oldQty, updated.getQuantity(), null,
                    "Quantity updated from " + oldQty + " to " + updated.getQuantity(), adminName);
        }

        return saved;
    }

    @Transactional
    @CacheEvict(value = {"stockItems", "stockItemsByCategory", "stockItem"}, allEntries = true)
    public StockItem issueItem(Long id, int quantity, String issuedTo, String remarks, String adminName) {
        StockItem item = getItemById(id);
        int oldQty = item.getQuantity();

        if (quantity > oldQty) {
            throw new RuntimeException("Not enough stock. Available: " + oldQty);
        }

        item.setQuantity(oldQty - quantity);
        StockItem saved = stockItemRepository.save(item);

        recordHistory(saved, "ISSUED", -quantity, oldQty, item.getQuantity(), issuedTo, remarks, adminName);
        return saved;
    }

    @CacheEvict(value = {"stockItems", "stockItemsByCategory", "stockItem"}, allEntries = true)
    public void deleteItem(Long id) {
        stockItemRepository.deleteById(id);
    }

    public List<StockHistory> getAllHistory() {
        return stockHistoryRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<StockHistory> getItemHistory(Long itemId) {
        return stockHistoryRepository.findByStockItemIdOrderByCreatedAtDesc(itemId);
    }

    private void recordHistory(StockItem item, String action, int change, int before, int after,
                                String issuedTo, String remarks, String adminName) {
        StockHistory history = StockHistory.builder()
                .stockItem(item)
                .action(action)
                .quantityChanged(change)
                .quantityBefore(before)
                .quantityAfter(after)
                .issuedTo(issuedTo)
                .remarks(remarks)
                .performedBy(adminName)
                .build();
        stockHistoryRepository.save(history);
    }
}
