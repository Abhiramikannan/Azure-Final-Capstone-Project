package com.stock.service.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class MarketTrends {
    @JsonProperty("coins")
    private List<Coin> coins;

    /* @JsonProperty("nfts")
    private List<NFT> nfts; */
}
