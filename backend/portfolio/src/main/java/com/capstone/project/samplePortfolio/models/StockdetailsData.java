package com.capstone.project.samplePortfolio.models;

import com.capstone.project.samplePortfolio.Vo.StockTemplate;
import lombok.Data;

import java.util.List;
@Data
public class StockdetailsData {
    private List<Stockdetails> stockDetails;
    private double totalBalance;
    private double totalReturns;

}
