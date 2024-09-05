package com.Natwest.project.budgeting.service;

import com.Natwest.project.budgeting.model.Budget;
import com.Natwest.project.budgeting.model.Expense;
import com.Natwest.project.budgeting.repository.BudgetRepository;
import com.Natwest.project.budgeting.repository.ExpenseRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.Date;
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ExpenseServiceTest {

    @Mock
    private ExpenseRepository mockExpenseRepository;
    @Mock
    private BudgetRepository mockBudgetRepository;

    private ExpenseService expenseServiceUnderTest;

    @BeforeEach
    void setUp() {
        expenseServiceUnderTest = new ExpenseService(mockExpenseRepository, mockBudgetRepository);
    }

    @Test
    void testCreateExpense() {
        // Setup
        final Expense expense = new Expense("id", "description", 0, "budgetId", new Date());
        final Expense expectedResult = new Expense("id", "description", 0, "budgetId", new Date());

        // Configure BudgetRepository.findById(...).
        final Optional<Budget> budget = Optional.of(new Budget("budgetId", "name", "description", 0, 0));
        when(mockBudgetRepository.findById("budgetId")).thenReturn(budget);

        // Configure ExpenseRepository.save(...).
        when(mockExpenseRepository.save(expense)).thenReturn(expectedResult);

        // Run the test
        final Expense result = expenseServiceUnderTest.createExpense(expense);

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
        verify(mockBudgetRepository).save(budget.get()); //
    }

    @Test
    void testCreateExpense_BudgetRepositoryFindByIdReturnsAbsent() {
        // Setup
        final Expense expense = new Expense("id", "description", 0, "budgetId",
                new GregorianCalendar(2020, Calendar.JANUARY, 1).getTime());
        final Expense expectedResult = new Expense("id", "description", 0, "budgetId",
                new GregorianCalendar(2020, Calendar.JANUARY, 1).getTime());

        // Configure BudgetRepository.findById to return Optional.empty()
        when(mockBudgetRepository.findById("budgetId")).thenReturn(Optional.empty());

        // Configure ExpenseRepository.save(...).
        when(mockExpenseRepository.save(expense)).thenReturn(expectedResult);

        // Run the test
        final Expense result = expenseServiceUnderTest.createExpense(expense);

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
    }

    @Test
    void testGetAllExpenses() {
        // Setup
        final List<Expense> expectedResult = List.of(new Expense("id", "description", 0, "budgetId",
                new GregorianCalendar(2020, Calendar.JANUARY, 1).getTime()));

        // Configure ExpenseRepository.findAll(...).
        final List<Expense> expenses = List.of(new Expense("id", "description", 0, "budgetId",
                new GregorianCalendar(2020, Calendar.JANUARY, 1).getTime()));
        when(mockExpenseRepository.findAll()).thenReturn(expenses);

        // Run the test
        final List<Expense> result = expenseServiceUnderTest.getAllExpenses();

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
    }

    @Test
    void testGetAllExpenses_ExpenseRepositoryReturnsNoItems() {
        // Setup
        when(mockExpenseRepository.findAll()).thenReturn(Collections.emptyList());

        // Run the test
        final List<Expense> result = expenseServiceUnderTest.getAllExpenses();

        // Verify the results
        assertThat(result).isEqualTo(Collections.emptyList());
    }

    @Test
    void testDeleteExpense() {
        // Setup
        // Run the test
        expenseServiceUnderTest.deleteExpense("id");

        // Verify the results
        verify(mockExpenseRepository).deleteById("id");
    }
}
