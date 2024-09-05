package com.capstone.project.samplePortfolio.models;

import com.capstone.project.samplePortfolio.entity.Stock;
import com.capstone.project.samplePortfolio.entity.Transactions;
import lombok.Data;

import java.util.List;

@Data
public class TransactionsDetails {
    private Stock stock;
    private List<Transactions> transactionsDetailsList;
    private Double holdings;
    private Double returns;

}
