package com.stock.service.services;

import com.stock.service.models.MarketTrends;
import com.stock.service.models.Stock;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StockService {
    @Autowired
    private WebClient.Builder webClientBuilder;

    @Value("${STOCK_API_URL}")
    private String baseURL;

    public Flux<Stock> getAllStocks() {
        return webClientBuilder.baseUrl(baseURL)
                .build()
                .get()
                .uri("coins/markets?vs_currency=inr&order=market_cap_desc&per_page=250&page=1&sparkline=true&price_change_percentage=24h,7d&locale=en")
                .retrieve()
                .bodyToFlux(Stock.class);
    }

    public Mono<Stock> getStockById(String ID) {
        return webClientBuilder.baseUrl(baseURL)
                .build()
                .get()
                .uri("coins/markets?vs_currency=inr&ids="+ ID + "&sparkline=true&price_change_percentage=24h,7d&locale=en")
                .retrieve()
                .bodyToFlux(Stock.class)
                .collectList()
                .flatMap(stockList -> Mono.justOrEmpty(stockList.stream().findFirst()));
    }
    public Mono<List<Stock>> getStocksByIds(List<String> ids) {
        String commaSeparatedIds=String.join(",",ids);
        return webClientBuilder.baseUrl(baseURL)
                .build()
                .get()
                .uri("coins/markets?vs_currency=inr&ids="+ commaSeparatedIds + "&sparkline=true&price_change_percentage=24h,7d&locale=en")
                .retrieve()
                .bodyToFlux(Stock.class)
                .collectList();

    }

    public Mono<MarketTrends> getMarketTrends() {
        return webClientBuilder.baseUrl(baseURL)
                .build()
                .get()
                .uri("search/trending")
                .retrieve()
                .bodyToMono(MarketTrends.class);
    }

}


