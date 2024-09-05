package com.stock.service.controllers;

import com.stock.service.models.MarketTrends;
import com.stock.service.models.Stock;
import com.stock.service.services.StockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
@RequestMapping("/stock")
public class StockController {
    private final StockService stockService;

    @Autowired
    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    @GetMapping("/all")
    public Flux<Stock> getAllStocks() {
        return stockService.getAllStocks();
    }

    @GetMapping("/{id}")
    public Mono<Stock> getStockById(@PathVariable String id) {
        return stockService.getStockById(id);
    }

    @GetMapping("/trending")
    public Mono<MarketTrends> getMarketTrends() {
        return stockService.getMarketTrends();
    }

    @GetMapping("/getAll/{id}")
    public Mono<List<Stock>> getStockByIds(@PathVariable List<String> id){
        return stockService.getStocksByIds(id);
    }
}
