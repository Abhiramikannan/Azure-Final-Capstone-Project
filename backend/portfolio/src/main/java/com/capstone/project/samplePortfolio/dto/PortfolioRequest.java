package com.capstone.project.samplePortfolio.dto;

import com.capstone.project.samplePortfolio.entity.Stock;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PortfolioRequest {

    @NotNull(message = "Portfolio name should not be null")
    private String portfolioName;
    @NotNull(message = "InvestmentAgenda should not be null")
    private String investmentAgenda;
    private Date createdAt;
    private Date updatedAt;
    private String userID;
    private List<Stock> stocks;
}
