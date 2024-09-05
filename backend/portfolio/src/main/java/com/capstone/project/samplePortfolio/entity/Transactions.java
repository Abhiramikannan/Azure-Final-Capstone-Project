package com.capstone.project.samplePortfolio.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;


import java.util.Date;
;

@Data
@AllArgsConstructor
@Builder
public class Transactions {

    private String type;
    private Date createdAt;
    private Integer quantity;
    private Double amount;
}
