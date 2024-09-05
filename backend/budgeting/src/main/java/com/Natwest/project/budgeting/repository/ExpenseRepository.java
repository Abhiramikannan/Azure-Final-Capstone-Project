package com.Natwest.project.budgeting.repository;

import com.Natwest.project.budgeting.model.Budget;
import com.Natwest.project.budgeting.model.Expense;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ExpenseRepository  extends MongoRepository<Expense,String> {
}
