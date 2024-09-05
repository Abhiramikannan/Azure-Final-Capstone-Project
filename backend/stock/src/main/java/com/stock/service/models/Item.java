package com.stock.service.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class Item {
    @JsonProperty("id")
    private String id;
    @JsonProperty("coin_id")
    private int coin_id;
    @JsonProperty("name")
    private String name;
    @JsonProperty("symbol")
    private String symbol;
    @JsonProperty("market_cap_rank")
    private int market_cap_rank;
    @JsonProperty("thumb")
    private String thumb;
    @JsonProperty("small")
    private String small;
    @JsonProperty("large")
    private String large;
    @JsonProperty("slug")
    private String slug;
    @JsonProperty("price_btc")
    private double price_btc;
    @JsonProperty("score")
    private int score;
}
