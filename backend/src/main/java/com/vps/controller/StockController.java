package com.vps.controller;

import com.vps.dto.ApiResponse;
import com.vps.entity.StockHistory;
import com.vps.entity.StockItem;
import com.vps.entity.User;
import com.vps.service.StockService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/stock")
@RequiredArgsConstructor
public class StockController {

    private final StockService stockService;

    @PostMapping
    public ResponseEntity<?> createItem(@RequestBody StockItem item, @AuthenticationPrincipal User admin) {
        StockItem saved = stockService.createItem(item, admin.getFullName());
        return ResponseEntity.ok(ApiResponse.success("Stock item created", saved));
    }

    @GetMapping
    public ResponseEntity<?> getAllItems(@RequestParam(required = false) String category) {
        List<StockItem> items = (category != null && !category.isEmpty())
                ? stockService.getItemsByCategory(category)
                : stockService.getAllItems();
        return ResponseEntity.ok(ApiResponse.success("Stock items fetched", items));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getItem(@PathVariable Long id) {
        try {
            StockItem item = stockService.getItemById(id);
            return ResponseEntity.ok(ApiResponse.success("Stock item fetched", item));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateItem(@PathVariable Long id, @RequestBody StockItem item,
                                         @AuthenticationPrincipal User admin) {
        try {
            StockItem updated = stockService.updateItem(id, item, admin.getFullName());
            return ResponseEntity.ok(ApiResponse.success("Stock item updated", updated));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/{id}/issue")
    public ResponseEntity<?> issueItem(@PathVariable Long id,
                                        @RequestParam int quantity,
                                        @RequestParam String issuedTo,
                                        @RequestParam(required = false) String remarks,
                                        @AuthenticationPrincipal User admin) {
        try {
            StockItem updated = stockService.issueItem(id, quantity, issuedTo, remarks, admin.getFullName());
            return ResponseEntity.ok(ApiResponse.success("Item issued successfully. Remaining: " + updated.getQuantity(), updated));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteItem(@PathVariable Long id) {
        try {
            stockService.deleteItem(id);
            return ResponseEntity.ok(ApiResponse.success("Stock item deleted"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/history")
    public ResponseEntity<?> getAllHistory() {
        List<StockHistory> history = stockService.getAllHistory();
        return ResponseEntity.ok(ApiResponse.success("Stock history fetched", history));
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<?> getItemHistory(@PathVariable Long id) {
        List<StockHistory> history = stockService.getItemHistory(id);
        return ResponseEntity.ok(ApiResponse.success("Item history fetched", history));
    }
}
