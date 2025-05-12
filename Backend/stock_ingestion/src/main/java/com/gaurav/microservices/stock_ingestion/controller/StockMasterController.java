package com.gaurav.microservices.stock_ingestion.controller;

import com.gaurav.microservices.stock_ingestion.entity.StockMasterEntity;
import com.gaurav.microservices.stock_ingestion.exceptionHandler.StockCreationException;
import com.gaurav.microservices.stock_ingestion.exceptionHandler.StockNotFoundException;
import com.gaurav.microservices.stock_ingestion.services.StockMasterService;
import com.gaurav.microservices.stock_ingestion.services.StockPriceStreamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/base")
public class StockMasterController {
    private final StockMasterService stockMasterService;
    private final StockPriceStreamService stockPriceStreamService;

    @Autowired
    public StockMasterController(StockMasterService stockMasterService,
                                 StockPriceStreamService stockPriceStreamService) {
        this.stockMasterService = stockMasterService;
        this.stockPriceStreamService = stockPriceStreamService;
    }

    @PostMapping("/createStocks")
    public ResponseEntity<List<StockMasterEntity>> createStocks(@RequestBody List<StockMasterEntity> stocks) {
        try {
            List<StockMasterEntity> savedStocks = new ArrayList<>();

            // Save stocks in the controller
            for (StockMasterEntity stock : stocks) {
                try {
                    StockMasterEntity savedStock = stockMasterService.saveStock(stock);
                    savedStocks.add(savedStock);
                } catch (Exception e) {
                    throw new StockCreationException("Failed to save stock: " + stock.getStockName(), e);
                }
            }

            try {
                // Create price entries in the service
                stockPriceStreamService.createPriceEntriesForStocks(savedStocks);
            } catch (Exception e) {
                throw new StockCreationException("Failed to create price entries for stocks", e);
            }

            return new ResponseEntity<>(savedStocks, HttpStatus.CREATED);
        } catch (StockCreationException e) {
            throw e;
        } catch (Exception e) {
            throw new StockCreationException("An unexpected error occurred while creating stocks", e);
        }
    }

    @GetMapping("/getStocks")
    public ResponseEntity<List<StockMasterEntity>> getAllStocks() {
        try {
            List<StockMasterEntity> stocks = stockMasterService.getAllStocks();
            return ResponseEntity.ok(stocks);
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch stocks", e);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<StockMasterEntity> getStockById(@PathVariable Long id) {
        try {
            return stockMasterService.getStockById(id)
                    .map(ResponseEntity::ok)
                    .orElseThrow(() -> new StockNotFoundException(id));
        } catch (StockNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch stock with id: " + id, e);
        }
    }
}