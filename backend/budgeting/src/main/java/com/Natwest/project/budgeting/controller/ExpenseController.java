package com.Natwest.project.budgeting.controller;

import com.Natwest.project.budgeting.model.Expense;
import com.Natwest.project.budgeting.service.ExpenseService;
import com.Natwest.project.budgeting.service.ExpenseService;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/expense")
public class ExpenseController {
    private final ExpenseService expenseService;
    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @PostMapping("/create")
    public Expense createExpense(@RequestBody Expense expense) {
        return expenseService.createExpense(expense);
    }
    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/all")
    public List<Expense> getAllExpenses() {
        return expenseService.getAllExpenses();
    }

    @DeleteMapping("/delete/{id}")
    public void deleteExpense(@PathVariable String id) {
        expenseService.deleteExpense(id);
    }



}
