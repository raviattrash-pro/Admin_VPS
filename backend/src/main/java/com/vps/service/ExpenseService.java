package com.vps.service;

import com.vps.entity.Expense;
import com.vps.entity.FeeRecord;
import com.vps.repository.ExpenseRepository;
import com.vps.repository.FeeRecordRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final FeeRecordRepository feeRecordRepository;

    public ExpenseService(ExpenseRepository expenseRepository, FeeRecordRepository feeRecordRepository) {
        this.expenseRepository = expenseRepository;
        this.feeRecordRepository = feeRecordRepository;
    }

    public Expense createExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    public List<Expense> getAllExpenses() {
        return expenseRepository.findAllByOrderByExpenseDateDesc();
    }

    public Expense getExpenseById(Long id) {
        return expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found"));
    }

    public Expense updateExpense(Long id, Expense updated) {
        Expense expense = getExpenseById(id);
        expense.setCategory(updated.getCategory());
        expense.setDescription(updated.getDescription());
        expense.setAmount(updated.getAmount());
        expense.setExpenseDate(updated.getExpenseDate());
        expense.setPaidTo(updated.getPaidTo());
        expense.setRemarks(updated.getRemarks());
        return expenseRepository.save(expense);
    }

    public void deleteExpense(Long id) {
        expenseRepository.deleteById(id);
    }

    public Map<String, Object> getProfitLossSummary() {
        List<FeeRecord> verifiedFees = feeRecordRepository.findByStatus(FeeRecord.PaymentStatus.VERIFIED);
        BigDecimal totalIncome = verifiedFees.stream()
                .map(FeeRecord::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalExpenses = expenseRepository.getTotalExpenses();
        BigDecimal profitLoss = totalIncome.subtract(totalExpenses);

        List<Expense> allExpenses = expenseRepository.findAll();
        Map<String, BigDecimal> expenseByCategory = new HashMap<>();
        for (Expense e : allExpenses) {
            expenseByCategory.merge(e.getCategory(), e.getAmount(), BigDecimal::add);
        }

        Map<String, BigDecimal> incomeByType = new HashMap<>();
        for (FeeRecord f : verifiedFees) {
            String type = f.getFeeType() != null ? f.getFeeType() : "General";
            incomeByType.merge(type, f.getAmount(), BigDecimal::add);
        }

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalIncome", totalIncome);
        summary.put("totalExpenses", totalExpenses);
        summary.put("profitLoss", profitLoss);
        summary.put("expenseByCategory", expenseByCategory);
        summary.put("incomeByType", incomeByType);
        summary.put("totalFeeRecords", verifiedFees.size());
        summary.put("totalExpenseRecords", allExpenses.size());

        return summary;
    }
}
