package com.stock.service.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class Coin {
    @JsonProperty("item")
    private Item item;
}
