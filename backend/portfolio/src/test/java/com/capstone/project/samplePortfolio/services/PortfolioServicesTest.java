package com.capstone.project.samplePortfolio.services;

import com.capstone.project.samplePortfolio.Vo.StockTemplate;
import com.capstone.project.samplePortfolio.dto.PortfolioRequest;
import com.capstone.project.samplePortfolio.dto.PortfolioResponse;
import com.capstone.project.samplePortfolio.entity.Portfolio;
import com.capstone.project.samplePortfolio.entity.Stock;
import com.capstone.project.samplePortfolio.entity.Transactions;
import com.capstone.project.samplePortfolio.exception.PortfolioNotFoundException;
import com.capstone.project.samplePortfolio.models.PortfolioData;
import com.capstone.project.samplePortfolio.models.Stockdetails;
import com.capstone.project.samplePortfolio.models.StockdetailsData;
import com.capstone.project.samplePortfolio.models.TransactionsDetails;
import com.capstone.project.samplePortfolio.repository.PortfolioRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PortfolioServicesTest {

    @Mock
    private PortfolioRepository mockPortfolioRepository;
    @Mock
    private WebClient mockWebClient;

    @InjectMocks
    private PortfolioServices portfolioServicesUnderTest;

    @Test
    void testAddPortfolio() {
        // Setup
        final PortfolioRequest request = PortfolioRequest.builder()
                .portfolioName("portfolioName")
                .investmentAgenda("investmentAgenda")
                .build();

        // Run the test
        portfolioServicesUnderTest.addPortfolio(request, "userId");

        // Verify the results
        ArgumentCaptor<Portfolio> portfolioCaptor = ArgumentCaptor.forClass(Portfolio.class);
        verify(mockPortfolioRepository).save(portfolioCaptor.capture());

        Portfolio capturedPortfolio = portfolioCaptor.getValue();
        assertNotNull(capturedPortfolio);

        // Verify individual fields
        assertEquals("portfolioName", capturedPortfolio.getPortfolioName());
        assertEquals("investmentAgenda", capturedPortfolio.getInvestmentAgenda());
        assertEquals("userId", capturedPortfolio.getUserID());
        assertNotNull(capturedPortfolio.getCreatedAt());
        assertNotNull(capturedPortfolio.getUpdatedAt());
        assertTrue(capturedPortfolio.getStocks().isEmpty());
    }

    @Test
    void testGetAllPortfolio() {
        // Setup
        final List<PortfolioResponse> expectedResult = List.of(PortfolioResponse.builder()
                .portfolioId("portfolioId")
                .portfolioName("portfolioName")
                .investmentAgenda("investmentAgenda")
                .createdAt(new GregorianCalendar(2020, Calendar.JANUARY, 1).getTime())
                .updatedAt(new GregorianCalendar(2020, Calendar.JANUARY, 1).getTime())
                .userID("userId")
                .stocks(List.of(Stock.builder()
                        .stockId("stockId")
                        .stockName("name")
                        .stockImage("image")
                        .stockSymbol("symbol")
                        .quantity(0)
                        .totalBuy(0.0)
                        .totalSell(0.0)
                        .avgBuyPrice(0.0)
                        .transactions(List.of(Transactions.builder()
                                .type("Buy")
                                .createdAt(new GregorianCalendar(2020, Calendar.JANUARY, 1).getTime())
                                .quantity(0)
                                .amount(0.0)
                                .build()))
                        .build()))
                .build());

        // Configure PortfolioRepository.findAll(...).
        final List<Portfolio> portfolioList = List.of(Portfolio.builder()
                .portfolioId("portfolioId")
                .portfolioName("portfolioName")
                .investmentAgenda("investmentAgenda")
                .createdAt(new GregorianCalendar(2020, Calendar.JANUARY, 1).getTime())
                .updatedAt(new GregorianCalendar(2020, Calendar.JANUARY, 1).getTime())
                .userID("userId")
                .stocks(List.of(Stock.builder()
                        .stockId("stockId")
                        .stockName("name")
                        .stockImage("image")
                        .stockSymbol("symbol")
                        .quantity(0)
                        .totalBuy(0.0)
                        .totalSell(0.0)
                        .avgBuyPrice(0.0)
                        .transactions(List.of(Transactions.builder()
                                .type("Buy")
                                .createdAt(new GregorianCalendar(2020, Calendar.JANUARY, 1).getTime())
                                .quantity(0)
                                .amount(0.0)
                                .build()))
                        .build()))
                .build());
        when(mockPortfolioRepository.findAll()).thenReturn(portfolioList);

        // Run the test
        final List<PortfolioResponse> result = portfolioServicesUnderTest.getAllPortfolio("userId");

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
    }

    @Test
    void testGetAllPortfolio_PortfolioRepositoryReturnsNoItems() {
        // Setup
        when(mockPortfolioRepository.findAll()).thenReturn(Collections.emptyList());

        // Run the test
        final List<PortfolioResponse> result = portfolioServicesUnderTest.getAllPortfolio("userId");

        // Verify the results
        assertThat(result).isEqualTo(Collections.emptyList());
    }

    @Test
    void testGetPortfolioById() throws Exception {
        // Setup
        final PortfolioResponse expectedResult = PortfolioResponse.builder()
                .portfolioId("portfolioId")
                .portfolioName("portfolioName")
                .investmentAgenda("investmentAgenda")
                .createdAt(new GregorianCalendar(2020, Calendar.JANUARY, 1).getTime())
                .updatedAt(new GregorianCalendar(2020, Calendar.JANUARY, 1).getTime())
                .userID("userId")
                .stocks(List.of(Stock.builder()
                        .stockId("stockId")
                        .stockName("name")
                        .stockImage("image")
                        .stockSymbol("symbol")
                        .quantity(0)
                        .totalBuy(0.0)
                        .totalSell(0.0)
                        .avgBuyPrice(0.0)
                        .transactions(List.of(Transactions.builder()
                                .type("Buy")
                                .createdAt(new GregorianCalendar(2020, Calendar.JANUARY, 1).getTime())
                                .quantity(0)
                                .amount(0.0)
                                .build()))
                        .build()))
                .build();

        // Configure PortfolioRepository.findById(...).
        final Optional<Portfolio> portfolio = Optional.of(Portfolio.builder()
                .portfolioId("portfolioId")
                .portfolioName("portfolioName")
                .investmentAgenda("investmentAgenda")
                .createdAt(new GregorianCalendar(2020, Calendar.JANUARY, 1).getTime())
                .updatedAt(new GregorianCalendar(2020, Calendar.JANUARY, 1).getTime())
                .userID("userId")
                .stocks(List.of(Stock.builder()
                        .stockId("stockId")
                        .stockName("name")
                        .stockImage("image")
                        .stockSymbol("symbol")
                        .quantity(0)
                        .totalBuy(0.0)
                        .totalSell(0.0)
                        .avgBuyPrice(0.0)
                        .transactions(List.of(Transactions.builder()
                                .type("Buy")
                                .createdAt(new GregorianCalendar(2020, Calendar.JANUARY, 1).getTime())
                                .quantity(0)
                                .amount(0.0)
                                .build()))
                        .build()))
                .build());
        when(mockPortfolioRepository.findById("portfolioId")).thenReturn(portfolio);

        // Run the test
        final PortfolioResponse result = portfolioServicesUnderTest.getPortfolioById("portfolioId");

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
    }

    @Test
    void testGetPortfolioById_PortfolioRepositoryReturnsAbsent() {
        // Setup
        when(mockPortfolioRepository.findById("portfolioId")).thenReturn(Optional.empty());

        // Run the test
        assertThatThrownBy(() -> portfolioServicesUnderTest.getPortfolioById("portfolioId"))
                .isInstanceOf(PortfolioNotFoundException.class);
    }

    @Test
    void testDeletePortfolio() throws Exception {
        // Setup
        // Configure PortfolioRepository.findById(...).
        final Optional<Portfolio> portfolio = Optional.of(Portfolio.builder()
                .portfolioId("portfolioId")
                .portfolioName("portfolioName")
                .investmentAgenda("investmentAgenda")
                .createdAt(new GregorianCalendar(2020, Calendar.JANUARY, 1).getTime())
                .updatedAt(new GregorianCalendar(2020, Calendar.JANUARY, 1).getTime())
                .userID("userId")
                .stocks(List.of(Stock.builder()
                        .stockId("stockId")
                        .stockName("name")
                        .stockImage("image")
                        .stockSymbol("symbol")
                        .quantity(0)
                        .totalBuy(0.0)
                        .totalSell(0.0)
                        .avgBuyPrice(0.0)
                        .transactions(List.of(Transactions.builder()
                                .type("Buy")
                                .createdAt(new GregorianCalendar(2020, Calendar.JANUARY, 1).getTime())
                                .quantity(0)
                                .amount(0.0)
                                .build()))
                        .build()))
                .build());
        when(mockPortfolioRepository.findById("portfolioId")).thenReturn(portfolio);

        // Run the test
        portfolioServicesUnderTest.deletePortfolio("portfolioId");

        // Verify the results
        verify(mockPortfolioRepository).deleteById("portfolioId");
    }

    @Test
    void testDeletePortfolio_PortfolioRepositoryFindByIdReturnsAbsent() {
        // Setup
        when(mockPortfolioRepository.findById("portfolioId")).thenReturn(Optional.empty());

        // Run the test
        assertThatThrownBy(() -> portfolioServicesUnderTest.deletePortfolio("portfolioId"))
                .isInstanceOf(PortfolioNotFoundException.class);
    }


    @Test
    void testUpdatePortfolio_PortfolioRepositoryFindByIdReturnsAbsent() {
        // Setup
        final PortfolioRequest portfolio = PortfolioRequest.builder()
                .portfolioName("portfolioName")
                .investmentAgenda("investmentAgenda")
                .build();
        when(mockPortfolioRepository.findById("portfolioId")).thenReturn(Optional.empty());

        // Run the test
        assertThatThrownBy(() -> portfolioServicesUnderTest.updatePortfolio("portfolioId", portfolio))
                .isInstanceOf(PortfolioNotFoundException.class);
    }


    @Test
    void testBuyStock_PortfolioRepositoryFindByIdReturnsAbsent() {
        // Setup
        when(mockPortfolioRepository.findById("portfolioId")).thenReturn(Optional.empty());

        // Run the test
        assertThatThrownBy(() -> portfolioServicesUnderTest.buyStock(0, "stockId", "portfolioId"))
                .isInstanceOf(PortfolioNotFoundException.class);
    }
    @Test
    void testGetAllStocks_PortfolioRepositoryReturnsAbsent() {
        // Setup
        when(mockPortfolioRepository.findById("portfolioId")).thenReturn(Optional.empty());

        // Run the test
        assertThatThrownBy(() -> portfolioServicesUnderTest.getAllStocks("portfolioId"))
                .isInstanceOf(PortfolioNotFoundException.class);
    }


    @Test
    void testSellStock_PortfolioRepositoryFindByIdReturnsAbsent() {
        // Setup
        when(mockPortfolioRepository.findById("portfolioId")).thenReturn(Optional.empty());

        // Run the test
        assertThatThrownBy(() -> portfolioServicesUnderTest.sellStock(0, "stockId", "portfolioId"))
                .isInstanceOf(PortfolioNotFoundException.class);
    }



    @Test
    void testGetTransactionsHistory_PortfolioRepositoryReturnsAbsent() {
        // Setup
        when(mockPortfolioRepository.findById("portfolioId")).thenReturn(Optional.empty());

        // Run the test
        final TransactionsDetails result = portfolioServicesUnderTest.getTransactionsHistory("portfolioId", "stockId");

        // Verify the results
        assertThat(result).isNull();
    }


    @Test
    void testGetPortfolioData_PortfolioRepositoryFindAllReturnsNoItems() {
        // Setup
        when(mockPortfolioRepository.findAll()).thenReturn(Collections.emptyList());

        // Run the test
        final List<PortfolioData> result = portfolioServicesUnderTest.getPortfolioData("userId");

        // Verify the results
        assertThat(result).isEqualTo(Collections.emptyList());
    }

    @Test
    void testGetPortfolioData_PortfolioRepositoryFindByIdReturnsAbsent() {
        // Setup
        // Configure PortfolioRepository.findAll(...).
        final List<Portfolio> portfolioList = List.of(Portfolio.builder()
                .portfolioId("portfolioId")
                .portfolioName("portfolioName")
                .investmentAgenda("investmentAgenda")
                .createdAt(new GregorianCalendar(2020, Calendar.JANUARY, 1).getTime())
                .updatedAt(new GregorianCalendar(2020, Calendar.JANUARY, 1).getTime())
                .userID("userId")
                .stocks(List.of(Stock.builder()
                        .stockId("stockId")
                        .stockName("name")
                        .stockImage("image")
                        .stockSymbol("symbol")
                        .quantity(0)
                        .totalBuy(0.0)
                        .totalSell(0.0)
                        .avgBuyPrice(0.0)
                        .transactions(List.of(Transactions.builder()
                                .type("Buy")
                                .createdAt(new GregorianCalendar(2020, Calendar.JANUARY, 1).getTime())
                                .quantity(0)
                                .amount(0.0)
                                .build()))
                        .build()))
                .build());
        when(mockPortfolioRepository.findAll()).thenReturn(portfolioList);

        when(mockPortfolioRepository.findById("portfolioId")).thenReturn(Optional.empty());

        // Run the test
        assertThatThrownBy(() -> portfolioServicesUnderTest.getPortfolioData("userId"))
                .isInstanceOf(RuntimeException.class);
    }
}
