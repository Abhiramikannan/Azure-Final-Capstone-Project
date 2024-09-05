package com.stock.service.controllers;

import com.stock.service.models.Coin;
import com.stock.service.models.Item;
import com.stock.service.models.MarketTrends;
import com.stock.service.models.Stock;
import com.stock.service.services.StockService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

@ExtendWith(SpringExtension.class)
@WebMvcTest(StockController.class)
class StockControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private StockService mockStockService;



    @Test
    void testGetStockById_StockServiceReturnsNoItem() throws Exception {
        // Setup
        when(mockStockService.getStockById("id")).thenReturn(Mono.empty());

        // Run the test
        final MockHttpServletResponse response = mockMvc.perform(get("/stock/{id}", "id")
                        .accept(MediaType.APPLICATION_JSON))
                .andReturn().getResponse();

        // Verify the results
        assertThat(response.getStatus()).isEqualTo(HttpStatus.OK.value());
        assertThat(response.getContentAsString()).isEqualTo("");
    }


    @Test
    void testGetMarketTrends_StockServiceReturnsNoItem() throws Exception {
        // Setup
        when(mockStockService.getMarketTrends()).thenReturn(Mono.empty());

        // Run the test
        final MockHttpServletResponse response = mockMvc.perform(get("/stock/trending")
                        .accept(MediaType.APPLICATION_JSON))
                .andReturn().getResponse();

        // Verify the results
        assertThat(response.getStatus()).isEqualTo(HttpStatus.OK.value());
        assertThat(response.getContentAsString()).isEqualTo("");
    }



    @Test
    void testGetStockByIds_StockServiceReturnsNoItem() throws Exception {
        // Setup
        when(mockStockService.getStocksByIds(List.of("value"))).thenReturn(Mono.empty());

        // Run the test
        final MockHttpServletResponse response = mockMvc.perform(get("/stock/getAll/{id}", "id")
                        .accept(MediaType.APPLICATION_JSON))
                .andReturn().getResponse();

        // Verify the results
        assertThat(response.getStatus()).isEqualTo(HttpStatus.OK.value());
        assertThat(response.getContentAsString()).isEqualTo("");
    }


}
