package com.capstone.project.samplePortfolio.models;

import com.capstone.project.samplePortfolio.Vo.StockTemplate;
import com.capstone.project.samplePortfolio.entity.Stock;
import lombok.Data;

@Data
public class Stockdetails {
    private Stock stock;
    private double holdings;
    private double returns;
    private Double priceChangePercentage24h;
    private Double priceChange24h;
    private Double currentPrice;
}
