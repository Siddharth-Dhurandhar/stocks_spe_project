package com.gaurav.microservices.stock_ingestion.exceptionHandler;

public class StockNotFoundException extends RuntimeException {
    public StockNotFoundException(String message) {
        super(message);
    }

    public StockNotFoundException(Long id) {
        super("Stock not found with id: " + id);
    }
}