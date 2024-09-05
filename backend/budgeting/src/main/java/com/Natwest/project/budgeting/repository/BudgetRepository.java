package com.Natwest.project.budgeting.repository;

import com.Natwest.project.budgeting.model.Budget;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface BudgetRepository extends MongoRepository<Budget,String> {
    Optional<Budget> findByName(String name);
}
