package com.gaurav.microservices.stock_ingestion.exceptionHandler;

public class StockCreationException extends RuntimeException {
    public StockCreationException(String message) {
        super(message);
    }

    public StockCreationException(String message, Throwable cause) {
        super(message, cause);
    }
}