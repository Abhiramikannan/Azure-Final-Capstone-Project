package com.stock.service.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class Sparkline {
    @JsonProperty
    private List<Double> price;
}