package com.Natwest.project.budgeting.model;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "expenses")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Expense {
    @Id
    private String id;
    private String description;
    private Integer amount;
    private String budgetId;
    private Date createdAt;


}
