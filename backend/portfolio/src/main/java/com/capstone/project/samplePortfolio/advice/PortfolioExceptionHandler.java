package com.capstone.project.samplePortfolio.advice;

import com.capstone.project.samplePortfolio.exception.InvalidNumberOfStocks;
import com.capstone.project.samplePortfolio.exception.PortfolioNotFoundException;
import com.capstone.project.samplePortfolio.exception.StockNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;
@RestControllerAdvice
public class PortfolioExceptionHandler {

    // Handle PortfolioNotFoundException exception
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(PortfolioNotFoundException.class)
    public Map<String, String> handlePortfolioNotFoundException(PortfolioNotFoundException portfolioNotFoundException) {
        Map<String, String> errorMap = new HashMap<>();
        errorMap.put("errorMsg", portfolioNotFoundException.getMessage());
        return errorMap;
    }

    // Handle InvalidNumberOfStocks exception
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(InvalidNumberOfStocks.class)
    public Map<String, String> handleInvalidNumberOfStocksException(InvalidNumberOfStocks invalidNumberOfStocks) {
        Map<String, String> errorMap = new HashMap<>();
        errorMap.put("errorMsg", invalidNumberOfStocks.getMessage());
        return errorMap;
    }

    // Handle StockNotFoundException exception
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(StockNotFoundException.class)
    public Map<String, String> handleStockNotFoundException(StockNotFoundException stockNotFoundException) {
        Map<String, String> errorMap = new HashMap<>();
        errorMap.put("errorMsg", stockNotFoundException.getMessage());
        return errorMap;
    }

    // Handle MethodArgumentNotValidException, which typically occurs when request data fails validation
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Map<String, String> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
        Map<String, String> errorMap = new HashMap<>();

        // Extract and map validation errors to field names
        ex.getBindingResult().getFieldErrors().forEach(error -> {
            errorMap.put(error.getField(), error.getDefaultMessage());
        });

        return errorMap;
    }
}
