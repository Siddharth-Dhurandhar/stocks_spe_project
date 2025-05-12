package com.gaurav.microservices.price_monitor.controller;

import com.gaurav.microservices.price_monitor.service.StockPriceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/p_monitor")
public class PriceMonitorController {
    private final StockPriceService stockPriceService;

    @Autowired
    public PriceMonitorController(StockPriceService stockPriceService) {
        this.stockPriceService = stockPriceService;
    }

    @PutMapping("/update-price")
    public ResponseEntity<String> updatePrice() {
        stockPriceService.startScheduledUpdates();
        return ResponseEntity.ok("Started scheduled price updates (every 5 seconds)");
    }
}