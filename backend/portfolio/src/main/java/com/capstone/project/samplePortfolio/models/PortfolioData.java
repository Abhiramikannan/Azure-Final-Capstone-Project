package com.capstone.project.samplePortfolio.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PortfolioData {
    private String portfolioName;
    private double totalBalance;
    private double totalReturns;
}
