package com.gaurav.microservices.outputmonitor.controller;

import com.gaurav.microservices.outputmonitor.dto.PortfolioDTO;
import com.gaurav.microservices.outputmonitor.entity.StockMasterEntity;
import com.gaurav.microservices.outputmonitor.entity.StockPriceStreamEntity;
import com.gaurav.microservices.outputmonitor.service.OutputService;
import com.gaurav.microservices.outputmonitor.dto.UserRequestDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

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

    @PostMapping("/stockDetail")
    public ResponseEntity<?> getStockDetail(@RequestBody UserRequestDTO userRequest) {
        if (userRequest.getStockId() == null) {
            return ResponseEntity.badRequest().body("Error: stockId is required");
        }
        try {
            StockMasterEntity stockDetail = outputService.getStockDetail(userRequest.getStockId());
            if (stockDetail != null) {
                return ResponseEntity.ok(stockDetail);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error retrieving stock details: " + e.getMessage());
        }
    }

    @PostMapping("/stockPriceHistory")
    public ResponseEntity<?> getStockPriceHistory(@RequestBody UserRequestDTO userRequest) {
        if (userRequest.getStockId() == null) {
            return ResponseEntity.badRequest().body("Error: stockId is required");
        }
        try {
            List<StockPriceStreamEntity> priceHistory = outputService.getStockPriceHistory(userRequest.getStockId());
            return ResponseEntity.ok(priceHistory);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error retrieving stock price history: " + e.getMessage());
        }
    }


    @PostMapping("/balance")
    public ResponseEntity<?> getBalance(@RequestBody UserRequestDTO userRequest) {
        try {
            Float balance = outputService.getUserBalance(userRequest.getUserId());
            if (balance != null) {
                return ResponseEntity.ok(balance);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error retrieving balance: " + e.getMessage());
        }
    }
    @PostMapping("/getPNLperStock")
    public float getPNLperStock(@RequestBody UserRequestDTO userRequest) {
        System.out.println(userRequest.getUserId() );
        return outputService.calculatePNLForStock(userRequest.getUserId(), userRequest.getStockId());

    }
    @PostMapping("/getTotalPNL")
    public float getTotalPNL(@RequestBody UserRequestDTO userRequest) {
        return outputService.calculateTotalPNL(userRequest.getUserId());
    }
    @PostMapping("/portfolio")
    public ResponseEntity<?> getPortfolio(@RequestBody UserRequestDTO userRequest) {
        if (userRequest.getUserId() == null) {
            return ResponseEntity.badRequest().body("Error: userId is required");
        }
        List<PortfolioDTO> portfolio = outputService.portfolioCalculate(userRequest.getUserId());
        return ResponseEntity.ok(portfolio);
    }

    @PostMapping("/getUserDetails")
    public ResponseEntity<?> getUserDetails(@RequestBody UserRequestDTO userRequest) {
        if (userRequest.getUserId() == null) {
            return ResponseEntity.badRequest().body("Error: userId is required");
        }
        try {
            Map<String, Object> userDetails = outputService.getUserDetails(userRequest.getUserId());
            if (userDetails != null && !userDetails.isEmpty()) {
                return ResponseEntity.ok(userDetails);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error retrieving user details: " + e.getMessage());
        }
    }



}