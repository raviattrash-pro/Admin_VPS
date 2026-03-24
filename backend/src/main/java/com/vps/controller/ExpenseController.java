package com.vps.controller;

import com.vps.dto.ApiResponse;
import com.vps.entity.Expense;
import com.vps.entity.User;
import com.vps.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    @PostMapping
    public ResponseEntity<?> createExpense(@RequestBody Expense expense, @AuthenticationPrincipal User admin) {
        expense.setAddedBy(admin.getFullName());
        Expense saved = expenseService.createExpense(expense);
        return ResponseEntity.ok(ApiResponse.success("Expense added", saved));
    }

    @GetMapping
    public ResponseEntity<?> getAllExpenses() {
        List<Expense> expenses = expenseService.getAllExpenses();
        return ResponseEntity.ok(ApiResponse.success("Expenses fetched", expenses));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateExpense(@PathVariable Long id, @RequestBody Expense expense) {
        try {
            Expense updated = expenseService.updateExpense(id, expense);
            return ResponseEntity.ok(ApiResponse.success("Expense updated", updated));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExpense(@PathVariable Long id) {
        try {
            expenseService.deleteExpense(id);
            return ResponseEntity.ok(ApiResponse.success("Expense deleted"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/summary")
    public ResponseEntity<?> getProfitLossSummary() {
        Map<String, Object> summary = expenseService.getProfitLossSummary();
        return ResponseEntity.ok(ApiResponse.success("Summary fetched", summary));
    }
}
