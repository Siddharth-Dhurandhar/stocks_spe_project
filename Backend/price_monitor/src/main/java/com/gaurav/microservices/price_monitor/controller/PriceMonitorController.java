package com.gaurav.microservices.price_monitor.controller;

import com.gaurav.microservices.price_monitor.service.StockPriceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping
public class PriceMonitorController {
    private final StockPriceService stockPriceService;

    @Autowired
    public PriceMonitorController(StockPriceService stockPriceService) {
        this.stockPriceService = stockPriceService;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void startPriceUpdatesAutomatically() {
        stockPriceService.startScheduledUpdates();
        System.out.println("Started scheduled price updates automatically");
    }
}