package com.gaurav.microservices.user_activity.controller;

import com.gaurav.microservices.user_activity.dto.TransactionRequestDto;
import com.gaurav.microservices.user_activity.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    @Autowired
    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping("/buysell")
    public ResponseEntity<String> registerTransaction(@RequestBody TransactionRequestDto request) {
        return transactionService.registerTransaction(
                request.getUser_id(),
                request.getStock_id(),
                request.getQuantity(),
                request.getTransaction_type()
        );
    }
    @PostMapping("/deposit")
    public ResponseEntity<String> deposit(@RequestBody TransactionRequestDto request) {
        return transactionService.deposit(
                request.getUser_id(),
                request.getAmount()
        );
    }

    @PostMapping("/withdraw")
    public ResponseEntity<String> withdraw(@RequestBody TransactionRequestDto request) {
        return transactionService.withdraw(
                request.getUser_id(),
                request.getAmount()
        );
    }
}