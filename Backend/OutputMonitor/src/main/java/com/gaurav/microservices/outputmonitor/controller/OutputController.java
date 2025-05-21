package com.gaurav.microservices.outputmonitor.controller;

import com.gaurav.microservices.outputmonitor.entity.StockMasterEntity;
import com.gaurav.microservices.outputmonitor.service.OutputService;
import com.gaurav.microservices.outputmonitor.dto.UserRequestDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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


}