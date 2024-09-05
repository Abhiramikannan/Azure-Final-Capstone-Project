package com.Natwest.project.budgeting.service;

import com.Natwest.project.budgeting.model.Budget;
import com.Natwest.project.budgeting.repository.BudgetRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BudgetServiceTest {

    @Mock
    private BudgetRepository mockBudgetRepository;

    private BudgetService budgetServiceUnderTest;

    @BeforeEach
    void setUp() {
        budgetServiceUnderTest = new BudgetService(mockBudgetRepository);
    }

    @Test
    void testCreateBudget() {
        // Setup
        final Budget budget = new Budget("id", "name", "description", 0, 0);
        final Budget expectedResult = new Budget("id", "name", "description", 0, 0);

        // Configure BudgetRepository.save(...).
        final Budget budget1 = new Budget("id", "name", "description", 0, 0);
        when(mockBudgetRepository.save(new Budget("id", "name", "description", 0, 0))).thenReturn(budget1);

        // Run the test
        final Budget result = budgetServiceUnderTest.createBudget(budget);

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
    }

    @Test
    void testGetBudget() {
        // Setup
        final Budget expectedResult = new Budget("id", "name", "description", 0, 0);

        // Configure BudgetRepository.findById(...).
        final Optional<Budget> budget = Optional.of(new Budget("id", "name", "description", 0, 0));
        when(mockBudgetRepository.findById("id")).thenReturn(budget);

        // Run the test
        final Budget result = budgetServiceUnderTest.getBudget("id");

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
    }

    @Test
    void testGetBudget_BudgetRepositoryReturnsAbsent() {
        // Setup
        when(mockBudgetRepository.findById("id")).thenReturn(Optional.empty());

        // Run the test
        final Budget result = budgetServiceUnderTest.getBudget("id");

        // Verify the results
        assertThat(result).isNull();
    }

    @Test
    void testGetBudgetByName() {
        // Setup
        final Budget expectedResult = new Budget("id", "name", "description", 0, 0);

        // Configure BudgetRepository.findByName(...).
        final Optional<Budget> budget = Optional.of(new Budget("id", "name", "description", 0, 0));
        when(mockBudgetRepository.findByName("name")).thenReturn(budget);

        // Run the test
        final Budget result = budgetServiceUnderTest.getBudgetByName("name");

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
    }

    @Test
    void testGetBudgetByName_BudgetRepositoryReturnsAbsent() {
        // Setup
        when(mockBudgetRepository.findByName("name")).thenReturn(Optional.empty());

        // Run the test
        final Budget result = budgetServiceUnderTest.getBudgetByName("name");

        // Verify the results
        assertThat(result).isNull();
    }

    @Test
    void testGetAllBudgets() {
        // Setup
        final List<Budget> expectedResult = List.of(new Budget("id", "name", "description", 0, 0));

        // Configure BudgetRepository.findAll(...).
        final List<Budget> budgets = List.of(new Budget("id", "name", "description", 0, 0));
        when(mockBudgetRepository.findAll()).thenReturn(budgets);

        // Run the test
        final List<Budget> result = budgetServiceUnderTest.getAllBudgets();

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
    }

    @Test
    void testGetAllBudgets_BudgetRepositoryReturnsNoItems() {
        // Setup
        when(mockBudgetRepository.findAll()).thenReturn(Collections.emptyList());

        // Run the test
        final List<Budget> result = budgetServiceUnderTest.getAllBudgets();

        // Verify the results
        assertThat(result).isEqualTo(Collections.emptyList());
    }

    @Test
    void testDeleteBudget() {
        // Setup
        // Run the test
        budgetServiceUnderTest.deleteBudget("id");

        // Verify the results
        verify(mockBudgetRepository).deleteById("id");
    }
}
