package com.capstone.project.samplePortfolio.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;

import java.util.List;

@Data
@AllArgsConstructor
@Builder
public class Stock {
    @Id
    private String stockId;
    private String stockName;
    private String stockImage;
    private String stockSymbol;
    private Integer quantity;
    private Double totalBuy;
    private Double totalSell;
    private Double avgBuyPrice;
    private List<Transactions> transactions;
}
