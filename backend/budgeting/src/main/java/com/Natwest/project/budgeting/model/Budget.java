package com.Natwest.project.budgeting.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;

@Document(collection = "budgets")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Budget {
    @Id
    private String id;

    private String name;
    private String description;
    private Integer expenses = 0;

    private Integer amount;


}
