package com.capstone.project.samplePortfolio.services;

import com.capstone.project.samplePortfolio.entity.Transactions;
import com.capstone.project.samplePortfolio.exception.InvalidNumberOfStocks;
import com.capstone.project.samplePortfolio.exception.PortfolioNotFoundException;
import com.capstone.project.samplePortfolio.exception.StockNotFoundException;
import com.capstone.project.samplePortfolio.models.PortfolioData;
import com.capstone.project.samplePortfolio.models.Stockdetails;
import com.capstone.project.samplePortfolio.Vo.StockTemplate;
import com.capstone.project.samplePortfolio.models.StockdetailsData;
import com.capstone.project.samplePortfolio.dto.PortfolioRequest;
import com.capstone.project.samplePortfolio.dto.PortfolioResponse;
import com.capstone.project.samplePortfolio.entity.Portfolio;
import com.capstone.project.samplePortfolio.entity.Stock;
import com.capstone.project.samplePortfolio.models.TransactionsDetails;
import com.capstone.project.samplePortfolio.repository.PortfolioRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.*;
import java.util.stream.Collectors;



@Service
@Slf4j
public class PortfolioServices {
    @Autowired
    private PortfolioRepository portfolioRepository;

    @Autowired
    private WebClient webClient;

//   Add a portfolio
public void addPortfolio(PortfolioRequest request, String userId) {
    // Create a new Portfolio object with information from the request and additional properties
    Portfolio portfolio = Portfolio.builder()
            .portfolioName(request.getPortfolioName())
            .investmentAgenda(request.getInvestmentAgenda())
            .createdAt(new Date())  // Set the creation date to the current date
            .updatedAt(new Date())  // Set the update date to the current date
            .userID(userId)         // Set the user ID
            .stocks(new ArrayList<>()) // Initialize an empty list of stocks
            .build();

    // Save the newly created portfolio to the repository
    portfolioRepository.save(portfolio);
}

    //    Get all portfolio of particular user by user id
    public List<PortfolioResponse> getAllPortfolio(String userId) {
        // Retrieve all portfolios from the repository
        List<Portfolio> portfolioList = portfolioRepository.findAll();

        // Filter the portfolios to get only those belonging to the specified user
        List<Portfolio> userPortfolio = portfolioList.stream()
                .filter(portfolio -> portfolio.getUserID().equals(userId))
                .collect(Collectors.toList());

        // Convert the user's portfolios to a list of PortfolioResponse objects
        List<PortfolioResponse> portfolioResponses = userPortfolio.stream()
                .map(portfolio -> PortfolioResponse.builder()
                        .portfolioId(portfolio.getPortfolioId())
                        .portfolioName(portfolio.getPortfolioName())
                        .investmentAgenda(portfolio.getInvestmentAgenda())
                        .createdAt(portfolio.getCreatedAt())
                        .updatedAt(portfolio.getUpdatedAt())
                        .stocks(portfolio.getStocks())
                        .userID(portfolio.getUserID())
                        .build())
                .collect(Collectors.toList());

        return portfolioResponses;
    }

    //    get particular portfolio by portfolioId
public PortfolioResponse getPortfolioById(String portfolioId) throws PortfolioNotFoundException {
    // Retrieve the portfolio by ID or throw an exception if it doesn't exist
    Optional<Portfolio> portfolio = portfolioRepository.findById(portfolioId);
    if (portfolio.isPresent()) {
        // Create a PortfolioResponse object with information from the retrieved portfolio
        PortfolioResponse portfolioResponse = PortfolioResponse.builder()
                .portfolioId(portfolio.get().getPortfolioId())
                .portfolioName(portfolio.get().getPortfolioName())
                .investmentAgenda(portfolio.get().getInvestmentAgenda())
                .createdAt(portfolio.get().getCreatedAt())
                .updatedAt(portfolio.get().getUpdatedAt())
                .userID(portfolio.get().getUserID())
                .stocks(portfolio.get().getStocks())
                .build();
        return portfolioResponse;
    }
    // Throw an exception if the portfolio doesn't exist
    throw new PortfolioNotFoundException("Portfolio with id " + portfolioId + " not found");
}

    //    delete a particular portfolio by portfolioId
public void deletePortfolio(String portfolioId) throws PortfolioNotFoundException {
    // Retrieve the portfolio by ID or throw an exception if it doesn't exist
    Optional<Portfolio> portfolio = portfolioRepository.findById(portfolioId);
    if (portfolio.isPresent()) {
        // Delete the portfolio from the repository
        portfolioRepository.deleteById(portfolioId);

        // Create a PortfolioResponse (not used here) from the deleted portfolio's information
        portfolio.map(value -> PortfolioResponse.builder()
                .portfolioId(value.getPortfolioId())
                .portfolioName(value.getPortfolioName())
                .investmentAgenda(value.getInvestmentAgenda())
                .createdAt(value.getCreatedAt())
                .updatedAt(value.getUpdatedAt())
                .userID(value.getUserID())
                .stocks(value.getStocks())
                .build()
        );
        return; // The return is not needed; it doesn't impact the behavior
    }
    // Throw an exception if the portfolio doesn't exist
    throw new PortfolioNotFoundException("Portfolio with id " + portfolioId + " not found");
}


    //    update particular portfolio by portfolioId
public PortfolioResponse updatePortfolio(String portfolioId, PortfolioRequest portfolio) throws PortfolioNotFoundException {
    // Retrieve the existing portfolio by ID or throw an exception if it doesn't exist
    Optional<Portfolio> portfolio1 = portfolioRepository.findById(portfolioId);
    if (portfolio1.isPresent()) {
        // Update the portfolio properties with values from the request
        portfolio1.get().setPortfolioId(portfolioId);
        portfolio1.get().setPortfolioName(portfolio.getPortfolioName());
        portfolio1.get().setInvestmentAgenda(portfolio.getInvestmentAgenda());
        portfolio1.get().setUpdatedAt(new Date());

        // Preserve some properties, like UserID, CreatedAt, and Stocks, that are not modified
        portfolio1.get().setUserID(portfolio1.get().getUserID());
        portfolio1.get().setCreatedAt(portfolio1.get().getCreatedAt());
        portfolio1.get().setStocks(portfolio1.get().getStocks());

        // Save the updated portfolio
        portfolioRepository.save(portfolio1.get());

        // Create a PortfolioResponse with the updated information and return it
        return PortfolioResponse.builder()
                .portfolioId(portfolioId)
                .portfolioName(portfolio1.get().getPortfolioName())
                .investmentAgenda(portfolio1.get().getInvestmentAgenda())
                .createdAt(portfolio1.get().getCreatedAt())
                .updatedAt(portfolio1.get().getUpdatedAt())
                .userID(portfolio1.get().getUserID())
                .stocks(portfolio1.get().getStocks())
                .build();
    } else {
        // Throw an exception if the portfolio doesn't exist
        throw new PortfolioNotFoundException("Portfolio with id " + portfolioId + " not found");
    }
}

    //    to get all details of stocks by stockId
    public StockTemplate getAllStocksDetails(String stockId) {
        return webClient.get().uri("http://localhost:8080/stock/" + stockId).retrieve()
                .bodyToMono(StockTemplate.class).block();
    }
    public void buyStock(int numberOfStocks, String stockId, String portfolioId) throws PortfolioNotFoundException, StockNotFoundException {
        // Retrieve the portfolio or throw an exception if it doesn't exist
        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new PortfolioNotFoundException("Portfolio with id " + portfolioId + " not found"));

        // Retrieve stock information or throw an exception if it doesn't exist
        List<StockTemplate> stocks = webClient.get()
                .uri("http://localhost:8080/stock/getAll/" + stockId)
                .retrieve()
                .bodyToFlux(StockTemplate.class)
                .collectList()
                .block();
        StockTemplate stock = stocks.stream()
                .findFirst()
                .orElseThrow(() -> new StockNotFoundException("Stock does not exist"));

        // Get the list of stocks in the portfolio
        List<Stock> stocksList = portfolio.getStocks();

        // Find the previous stock, if it exists
        Optional<Stock> previousStock = stocksList.stream()
                .filter(data -> data.getStockId().equals(stockId))
                .findFirst();

        // Calculate total buy price, total sell, and average buy price
        double totalBuy = stock.getCurrentPrice() * numberOfStocks;
        double totalSell = previousStock.map(Stock::getTotalSell).orElse(0.0);
        double avgBuyPrice = (previousStock.map(Stock::getTotalBuy).orElse(0.0) + totalBuy) / (numberOfStocks + previousStock.map(Stock::getQuantity).orElse(0));

        // Create a list of transactions
        List<Transactions> transactionsList = previousStock.map(Stock::getTransactions).orElse(new ArrayList<>());
        Transactions transactions = new Transactions("Buy", new Date(), numberOfStocks, numberOfStocks * stock.getCurrentPrice());
        transactionsList.add(transactions);

        // If the previous stock exists, remove it from the list
        if (previousStock.isPresent()) {
            stocksList.remove(previousStock.get());
        }

        // Create a new stock with updated information
        Stock newStock = new Stock(stockId, stock.getName(), stock.getImage(), stock.getSymbol(),
                numberOfStocks + previousStock.map(Stock::getQuantity).orElse(0),
                totalBuy, totalSell, avgBuyPrice, transactionsList);

        // Add the new stock to the list
        stocksList.add(newStock);

        // Update the portfolio's stock list and save it
        portfolio.setStocks(stocksList);
        portfolioRepository.save(portfolio);
    }


    public StockdetailsData getAllStocks(String portfolioId) throws PortfolioNotFoundException {
        // Retrieve the portfolio by ID or throw an exception if it doesn't exist
        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new PortfolioNotFoundException("Portfolio with id " + portfolioId + " not found"));

        // Get the list of stocks in the portfolio
        List<Stock> portfolioStocks = portfolio.getStocks();

        // If the portfolio has no stocks, return an empty StockdetailsData
        if (portfolioStocks.isEmpty()) {
            return new StockdetailsData(); // No stocks in the portfolio.
        }

        // Create a comma-separated string of stock IDs from the portfolio stocks
        String stockIds = portfolioStocks.stream()
                .map(Stock::getStockId)
                .collect(Collectors.joining(","));

        // Retrieve stock templates for the stock IDs from a web service
        List<StockTemplate> templates = webClient.get()
                .uri("http://localhost:8080/stock/getAll/" + stockIds)
                .retrieve()
                .bodyToFlux(StockTemplate.class)
                .collectList()
                .block();

        // Initialize lists and variables for stock details, returns, and balance
        List<Stockdetails> stockList = new ArrayList<>();
        double returns = 0;
        double balance = 0;

        // Iterate through each stock in the portfolio
        for (Stock stock : portfolioStocks) {
            // Find the corresponding stock template, if it exists
            StockTemplate stockTemplate = templates.stream()
                    .filter(t -> t.getId().equals(stock.getStockId()))
                    .findFirst()
                    .orElse(null);

            // If a stock template is found, create stock details and calculate returns and balance
            if (stockTemplate != null) {
                Stockdetails stockDetails = new Stockdetails();
                stockDetails.setStock(stock);
                double holdings = stockTemplate.getCurrentPrice() * stock.getQuantity();
                stockDetails.setHoldings(holdings);
                stockDetails.setReturns(holdings - (stock.getTotalBuy() - stock.getTotalSell()));
                stockDetails.setCurrentPrice(stockTemplate.getCurrentPrice());
                stockDetails.setPriceChangePercentage24h(stockTemplate.getPriceChangePercentage24h());
                stockDetails.setPriceChange24h(stockTemplate.getPriceChange24h());
                stockList.add(stockDetails);

                returns += stockDetails.getReturns();
                balance += stockDetails.getHoldings();
            }
        }

        // Create a StockdetailsData object and set its properties
        StockdetailsData stockdetailsList = new StockdetailsData();
        stockdetailsList.setStockDetails(stockList);
        stockdetailsList.setTotalReturns(returns);
        stockdetailsList.setTotalBalance(balance);

        return stockdetailsList;
    }

    public void sellStock(int quantity, String stockId, String portfolioId) throws PortfolioNotFoundException, InvalidNumberOfStocks, StockNotFoundException {
        // Retrieve the portfolio by ID or throw an exception if it doesn't exist
        Portfolio portfolio = portfolioRepository.findById(portfolioId)
                .orElseThrow(() -> new PortfolioNotFoundException("Portfolio with id " + portfolioId + " not found"));

        // Retrieve stock information for the given stock ID or throw an exception if it doesn't exist
        List<StockTemplate> stocks = webClient.get()
                .uri("http://localhost:8080/stock/getAll/" + stockId)
                .retrieve()
                .bodyToFlux(StockTemplate.class)
                .collectList()
                .block();

        StockTemplate stock = stocks.stream()
                .findFirst()
                .orElseThrow(() -> new StockNotFoundException("Stock not found"));

        // Get the list of stocks in the portfolio
        List<Stock> stocksList = portfolio.getStocks();

        // Find the previous stock in the portfolio for the given stock ID, or throw an exception if it doesn't exist
        Stock previousStock = stocksList.stream()
                .filter(data -> data.getStockId().equals(stockId))
                .findFirst()
                .orElseThrow(() -> new StockNotFoundException("Stock not found"));

        // Retrieve the current quantity of the previous stock
        int previousStockQuantity = previousStock.getQuantity();

        // Check if there are enough stocks to sell
        if (previousStockQuantity >= quantity) {
            // Calculate the updated quantity, total sell, and create a new transaction
            int updatedQuantity = previousStockQuantity - quantity;
            double totalSell = previousStock.getTotalSell() + (stock.getCurrentPrice() * quantity);
            List<Transactions> transactionsList = previousStock.getTransactions();
            Transactions transactions = new Transactions("Sell", new Date(), quantity, quantity * stock.getCurrentPrice());
            transactionsList.add(transactions);

            // Create a new stock with updated information
            Stock newStock = new Stock(stockId, stock.getName(), stock.getImage(), stock.getSymbol(),
                    updatedQuantity, previousStock.getTotalBuy(), totalSell, previousStock.getAvgBuyPrice(), transactionsList);

            // Remove the previous stock and add the new stock to the list
            stocksList.remove(previousStock);
            stocksList.add(newStock);
        } else {
            // If there are not enough stocks to sell, throw an exception
            throw new InvalidNumberOfStocks("Invalid Number of stocks");
        }

        // Update the portfolio's stock list and save it
        portfolio.setStocks(stocksList);
        portfolioRepository.save(portfolio);
    }



    public TransactionsDetails getTransactionsHistory(String portfolioId, String stockId) {
        // Retrieve the portfolio by ID or return null if it doesn't exist
        Optional<Portfolio> portfolio = portfolioRepository.findById(portfolioId);
        if (portfolio.isPresent()) {
            TransactionsDetails transactionsDetails = new TransactionsDetails();
            List<Stock> stockList = portfolio.get().getStocks();

            // Find the stock in the portfolio for the given stock ID or return null if it doesn't exist
            Optional<Stock> stock = stockList.stream().filter(data -> data.getStockId().equals(stockId)).findFirst();
            if (stock.isPresent()) {
                // Retrieve stock information from a web service
                List<StockTemplate> stocks = webClient.get()
                        .uri("http://localhost:8080/stock/getAll/" + stockId)
                        .retrieve()
                        .bodyToFlux(StockTemplate.class)
                        .collectList()
                        .block();
                StockTemplate stockTemplate = stocks.get(0);

                // Calculate holdings and get the list of transactions for the stock
                double holdings = stockTemplate.getCurrentPrice() * stock.get().getQuantity();
                List<Transactions> transactionsList = stock.get().getTransactions();

                // Set the properties of the TransactionsDetails object
                transactionsDetails.setStock(stock.get());
                transactionsDetails.setTransactionsDetailsList(transactionsList);
                transactionsDetails.setHoldings(holdings);
                transactionsDetails.setReturns(holdings - (stock.get().getTotalBuy() - stock.get().getTotalSell()));

                return transactionsDetails;
            }
            return null;
        }
        return null;
    }

    public List<PortfolioData> getPortfolioData(String userId) {
        // Get all portfolios for the specified user
        List<PortfolioResponse> getPortfolios = getAllPortfolio(userId);

        // Initialize a list to store PortfolioData objects
        List<PortfolioData> portfolioDataList = new ArrayList<>();

        // If the user has no portfolios, return an empty list
        if (getPortfolios.isEmpty()) {
            return portfolioDataList;
        }

        // Limit the number of portfolios to the top three
        List<PortfolioResponse> getThreePortfolios = getPortfolios.stream().limit(3).collect(Collectors.toList());

        // Process each of the top three portfolios
        getThreePortfolios.forEach(p -> {
            try {
                // Retrieve stock details data for the portfolio
                StockdetailsData stockdetailsData = getAllStocks(p.getPortfolioId());

                // Create a PortfolioData object with the portfolio name, total balance, and total returns
                PortfolioData portfolioData = new PortfolioData(
                        p.getPortfolioName(),
                        stockdetailsData.getTotalBalance(),
                        stockdetailsData.getTotalReturns()
                );

                // Add the PortfolioData to the list
                portfolioDataList.add(portfolioData);
            } catch (PortfolioNotFoundException e) {
                // If a PortfolioNotFoundException is encountered, throw a runtime exception
                throw new RuntimeException(e);
            }
        });

        return portfolioDataList;
    }

}