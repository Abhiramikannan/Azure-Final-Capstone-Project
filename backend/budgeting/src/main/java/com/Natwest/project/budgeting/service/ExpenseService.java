package com.Natwest.project.budgeting.service;
import com.Natwest.project.budgeting.model.Budget;
import com.Natwest.project.budgeting.repository.BudgetRepository;
import com.Natwest.project.budgeting.model.Expense;
import com.Natwest.project.budgeting.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Date;


import java.util.List;
import java.util.Optional;

@Service
public class ExpenseService {
    private final BudgetRepository budgetRepository;

    private final ExpenseRepository expenseRepository;

    @Autowired
    public ExpenseService(ExpenseRepository expenseRepository, BudgetRepository budgetRepository) {
        this.expenseRepository = expenseRepository;
        this.budgetRepository = budgetRepository;
    }

    public Expense createExpense(Expense expense) {
        Optional<Budget> optionalBudget = budgetRepository.findById(expense.getBudgetId());
        if (optionalBudget.isPresent()) {
            Budget budget = optionalBudget.get();
            budget.setExpenses(budget.getExpenses() + expense.getAmount());

            budgetRepository.save(budget);
        }
        expense.setCreatedAt(new Date());
            return expenseRepository.save(expense);

   }



    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }


    public void deleteExpense(String id) {
        expenseRepository.deleteById(id);
    }

}