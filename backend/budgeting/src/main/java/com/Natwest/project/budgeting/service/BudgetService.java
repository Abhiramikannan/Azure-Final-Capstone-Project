package com.Natwest.project.budgeting.service;

import com.Natwest.project.budgeting.model.Budget;
import com.Natwest.project.budgeting.repository.BudgetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;
    @Autowired
    public BudgetService(BudgetRepository budgetRepository) {
        this.budgetRepository = budgetRepository;
    }

    public Budget createBudget(Budget budget) {
        return budgetRepository.save(budget);

    }

    public Budget getBudget(String id) {
        return budgetRepository.findById(id).orElse(null);
    }
    public Budget getBudgetByName(String name) {
        return budgetRepository.findByName(name).orElse(null);
    }
    public List<Budget> getAllBudgets() {
        return budgetRepository.findAll();
    }

    public void deleteBudget(String id) {
        budgetRepository.deleteById(id);
    }
}
