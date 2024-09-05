package com.capstone.project.samplePortfolio.Vo;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StockTemplate {
    @JsonProperty("id")
    private String id;

    @JsonProperty("symbol")
    private String symbol;

    @JsonProperty("name")
    private String name;

    @JsonProperty("image")
    private String image;

    @JsonProperty("current_price")
    private Double currentPrice;

    @JsonProperty("market_cap")
    private Long marketCap;

    @JsonProperty("market_cap_rank")
    private Integer marketCapRank;

    @JsonProperty("fully_diluted_valuation")
    private Long fullyDilutedValuation;

    @JsonProperty("total_volume")
    private Long totalVolume;

    @JsonProperty("high_24h")
    private Double high24h;

    @JsonProperty("low_24h")
    private Double low24h;

    @JsonProperty("price_change_24h")
    private Double priceChange24h;

    @JsonProperty("price_change_percentage_24h")
    private Double priceChangePercentage24h;

    @JsonProperty("market_cap_change_24h")
    private Long marketCapChange24h;

    @JsonProperty("market_cap_change_percentage_24h")
    private Double marketCapChangePercentage24h;

    @JsonProperty("circulating_supply")
    private Double circulatingSupply;

    @JsonProperty("total_supply")
    private Double totalSupply;

    @JsonProperty("max_supply")
    private Object maxSupply;

    @JsonProperty("ath")
    private Double ath;

    @JsonProperty("ath_change_percentage")
    private Double athChangePercentage;

    @JsonProperty("ath_date")
    private String athDate;

    @JsonProperty("atl")
    private Double atl;

    @JsonProperty("atl_change_percentage")
    private Double atlChangePercentage;

    @JsonProperty("atl_date")
    private String atlDate;

    @JsonProperty("roi")
    private Object roi;

    @JsonProperty("last_updated")
    private String lastUpdated;

    @JsonProperty("sparkline_in_7d")
    private Sparkline sparkline;

    @JsonProperty("price_change_percentage_24h_in_currency")
    private Double priceChangePercentage24hInCurrency;

    @JsonProperty("price_change_percentage_7d_in_currency")
    private Double priceChangePercentage7dInCurrency;
}
