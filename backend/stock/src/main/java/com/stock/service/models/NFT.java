package com.stock.service.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class NFT {
    @JsonProperty("id")
    private String id;
    @JsonProperty("name")
    private String name;
    @JsonProperty("symbol")
    private String symbol;
    @JsonProperty("thumb")
    private String thumb;
    @JsonProperty("nft_contract_id")
    private int nft_contract_id;
    @JsonProperty("native_currency_symbol")
    private String native_currency_symbol;
    @JsonProperty("floor_price_in_native_currency")
    private double floor_price_in_native_currency;
    @JsonProperty("floor_price_24h_percentage_change")
    private double floor_price_24h_percentage_change;
}
