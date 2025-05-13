package com.gaurav.microservices.outputmonitor.controller;

import com.gaurav.microservices.outputmonitor.entity.StockMasterEntity;
import com.gaurav.microservices.outputmonitor.service.OutputService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/retrieve")
public class OutputController {

    private final OutputService outputService;

    @Autowired
    public OutputController(OutputService outputService) {
        this.outputService = outputService;
    }

    @GetMapping("/allStockDetails")
    public ResponseEntity<List<StockMasterEntity>> getAllStocks() {
        List<StockMasterEntity> stocks = outputService.getAllStocks();
        return ResponseEntity.ok(stocks);
    }
}