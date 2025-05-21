package com.gaurav.microservices.user_activity.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class TransactionService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public ResponseEntity<String> registerTransaction(long userId, long stockId, int quantity, String transactionType) {
        try {
            // Get calculated_price from stock_current_price table
            String priceQuery = "SELECT price FROM stock_current_price WHERE stock_id = ?";
            Float calculatedPrice = jdbcTemplate.queryForObject(priceQuery, Float.class, stockId);

            if (calculatedPrice == null) {
                return new ResponseEntity<>("Stock price not found for the given stock ID", HttpStatus.NOT_FOUND);
            }

            // Calculate the total amount
            float amount = quantity * calculatedPrice;

            // Check if user has enough stocks when selling
            if (transactionType.equalsIgnoreCase("SELL")) {
                String ownedStocksQuery =
                        "SELECT (COALESCE((SELECT SUM(quantity) FROM user_transactions WHERE user_id = ? AND stock_id = ? AND transaction_type = 'BUY'), 0) - " +
                                "COALESCE((SELECT SUM(quantity) FROM user_transactions WHERE user_id = ? AND stock_id = ? AND transaction_type = 'SELL'), 0)) AS available_stocks";

                Integer availableStocks;
                try {
                    availableStocks = jdbcTemplate.queryForObject(ownedStocksQuery, Integer.class, userId, stockId, userId, stockId);
                    if (availableStocks == null) {
                        availableStocks = 0;
                    }
                } catch (Exception e) {
                    availableStocks = 0;
                }

                if (availableStocks < quantity) {
                    return new ResponseEntity<>("Insufficient stocks. You own " + availableStocks + " but are trying to sell " + quantity, HttpStatus.BAD_REQUEST);
                }
            }

            // Get the user's latest balance
            String balanceQuery = "SELECT balance FROM user_transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 1";
            Float currentBalance;
            try {
                currentBalance = jdbcTemplate.queryForObject(balanceQuery, Float.class, userId);
                if (currentBalance == null) {
                    currentBalance = 0.0f;
                }
            } catch (Exception e) {
                currentBalance = 0.0f;
            }

            // Calculate new balance based on transaction type
            float newBalance;
            if (transactionType.equalsIgnoreCase("BUY") || transactionType.equalsIgnoreCase("WITHDRAW")) {
                newBalance = currentBalance - amount;
                if (newBalance < 0) {
                    return new ResponseEntity<>("Insufficient Balance", HttpStatus.BAD_REQUEST);
                }
            } else if (transactionType.equalsIgnoreCase("SELL") || transactionType.equalsIgnoreCase("DEPOSIT")) {
                newBalance = currentBalance + amount;
            } else {
                return new ResponseEntity<>("Invalid transaction type", HttpStatus.BAD_REQUEST);
            }

            // Insert transaction record
            String insertQuery = "INSERT INTO user_transactions "
                    + "(amount, purchased_price, quantity, transaction_type, stock_id, user_id, balance) "
                    + "VALUES (?, ?, ?, ?, ?, ?, ?)";

            jdbcTemplate.update(insertQuery,
                    amount,
                    calculatedPrice,
                    quantity,
                    transactionType,
                    stockId,
                    userId,
                    newBalance);

            return new ResponseEntity<>("Transaction registered successfully", HttpStatus.CREATED);

        } catch (Exception e) {
            return new ResponseEntity<>("Failed to register transaction: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<String> deposit(long userId, float amount) {
        try {
            String balanceQuery = "SELECT balance FROM user_transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 1";
            Float currentBalance;
            try {
                currentBalance = jdbcTemplate.queryForObject(balanceQuery, Float.class, userId);
                if (currentBalance == null) {
                    currentBalance = 0.0f;
                }
            } catch (Exception e) {
                currentBalance = 0.0f;
            }

            float newBalance = currentBalance + amount;

            // Insert transaction record with updated balance
            String insertQuery = "INSERT INTO user_transactions "
                    + "(amount, transaction_type, user_id, balance) "
                    + "VALUES (?, ?, ?, ?)";

            jdbcTemplate.update(insertQuery,
                    amount,
                    "DEPOSIT",
                    userId,
                    newBalance);

            return new ResponseEntity<>("Deposit successful", HttpStatus.CREATED);

        } catch (Exception e) {
            return new ResponseEntity<>("Failed to process deposit: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<String> withdraw(long userId, float amount) {
        try {
            // Get the user's latest balance (0 if not found)
            String balanceQuery = "SELECT balance FROM user_transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 1";
            Float currentBalance;
            try {
                currentBalance = jdbcTemplate.queryForObject(balanceQuery, Float.class, userId);
                if (currentBalance == null) {
                    currentBalance = 0.0f;
                }
            } catch (Exception e) {
                currentBalance = 0.0f;
            }

            float newBalance = currentBalance - amount;

            // Check if sufficient balance
            if (newBalance < 0) {
                return new ResponseEntity<>("Insufficient Balance", HttpStatus.BAD_REQUEST);
            }

            // Insert transaction record with updated balance
            String insertQuery = "INSERT INTO user_transactions "
                    + "(amount, transaction_type, user_id, balance) "
                    + "VALUES (?, ?, ?, ?)";

            jdbcTemplate.update(insertQuery,
                    amount,
                    "WITHDRAW",
                    userId,
                    newBalance);

            return new ResponseEntity<>("Withdrawal successful", HttpStatus.CREATED);

        } catch (Exception e) {
            return new ResponseEntity<>("Failed to process withdrawal: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}