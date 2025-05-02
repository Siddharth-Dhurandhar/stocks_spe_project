package com.gaurav.microservices.stock_ingestion.controller;

import com.gaurav.microservices.stock_ingestion.entity.StockMasterEntity;
import com.gaurav.microservices.stock_ingestion.services.StockMasterService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/base")
public class StockMasterController {

    private final StockMasterService stockMasterService;
    @Autowired
    public StockMasterController(StockMasterService stockMasterService) {
        this.stockMasterService = stockMasterService;
    }

    @PostMapping("/createStocks")
    public ResponseEntity<StockMasterEntity> createStock(@RequestBody StockMasterEntity stock) {
        StockMasterEntity savedStock = stockMasterService.saveStock(stock);
        return new ResponseEntity<>(savedStock, HttpStatus.CREATED);
    }

    @GetMapping("/getStocks")
    public ResponseEntity<List<StockMasterEntity>> getAllStocks() {
        List<StockMasterEntity> stocks = stockMasterService.getAllStocks();
        return ResponseEntity.ok(stocks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StockMasterEntity> getStockById(@PathVariable Long id) {
        return stockMasterService.getStockById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}