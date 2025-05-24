package com.gaurav.microservices.price_monitor.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

@Service
public class StockPriceService {
    private final JdbcTemplate jdbcTemplate;
    private ScheduledExecutorService scheduler;
    private ScheduledFuture<?> scheduledTask;

    @Autowired
    public StockPriceService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
        this.scheduler = Executors.newSingleThreadScheduledExecutor();
    }

    public int updateAllPrices() {
        String getStockIdsQuery = "SELECT DISTINCT stock_id FROM stock_master";
        List<String> stockIds = jdbcTemplate.queryForList(getStockIdsQuery, String.class);

        int totalInserted = 0;
        Random random = new Random();

        for (String stockId : stockIds) {
            String getLatestPriceQuery =
                    "SELECT stock_price FROM stock_price_stream WHERE stock_id = ? " +
                            "ORDER BY created_at DESC LIMIT 1";

            try {
                Double latestPrice = jdbcTemplate.queryForObject(getLatestPriceQuery, Double.class, stockId);

                if (latestPrice != null) {
                    // Generate random percentage change between -2% and +2%
                    double percentageChange = -2.0 + (random.nextDouble() * 4.0);

                    // Calculate new price based on percentage change
                    double priceChange = latestPrice * (percentageChange / 100);
                    double newPrice = latestPrice + priceChange;

                    // Round to 2 decimal places
                    newPrice = Math.round(newPrice * 100.0) / 100.0;
                    percentageChange = Math.round(percentageChange * 100.0) / 100.0;

                    // Insert new price data with percentage change
                    String insertQuery = "INSERT INTO stock_price_stream (stock_id, stock_price, percentage_change) VALUES (?, ?, ?)";
                    totalInserted += jdbcTemplate.update(insertQuery, stockId, newPrice, percentageChange);

                    // Update the price in stock_current_price table
                    String updateCurrentPriceQuery = "UPDATE stock_current_price SET price = ?, percent_change=? WHERE stock_id = ?";
                    jdbcTemplate.update(updateCurrentPriceQuery, newPrice, percentageChange, stockId);
                } else {
                    // No price found - fetch from stock_master
                    String getMasterDataQuery = "SELECT price, stock_name FROM stock_master WHERE stock_id = ?";

                    List<Map<String, Object>> results = jdbcTemplate.queryForList(getMasterDataQuery, stockId);

                    if (!results.isEmpty()) {
                        Map<String, Object> data = results.get(0);
                        Double initialPrice = ((Number) data.get("price")).doubleValue();
                        String stockName = (String) data.get("stock_name");

                        // Set percentage change to 0
                        double percentageChange = 0.0;

                        // Insert new price data with zero percentage change
                        String insertQuery = "INSERT INTO stock_price_stream (stock_id, stock_price, percentage_change) VALUES (?, ?, ?)";
                        jdbcTemplate.update(insertQuery, stockId, initialPrice, percentageChange);

                        // Update or insert into stock_current_price table
                        String upsertCurrentPriceQuery =
                                "INSERT INTO stock_current_price (stock_id, price, percent_change, stock_name) " +
                                        "VALUES (?, ?, ?, ?) " +
                                        "ON DUPLICATE KEY UPDATE price = VALUES(price), percent_change = VALUES(percent_change), stock_name = VALUES(stock_name)";
                        jdbcTemplate.update(upsertCurrentPriceQuery, stockId, initialPrice, percentageChange, stockName);

                        totalInserted++;
                    } else {
                        System.err.println("No data found in stock_master for stock_id " + stockId);
                    }
                }

                // Check if total rows exceeds 5000 and delete oldest entries if needed
                String countQuery = "SELECT COUNT(*) FROM stock_price_stream";
                Integer totalRows = jdbcTemplate.queryForObject(countQuery, Integer.class);
                if (totalRows != null && totalRows > 5000) {
                    int rowsToDelete = totalRows - 5000;
                    String deleteOldestQuery = "DELETE FROM stock_price_stream ORDER BY created_at ASC LIMIT ?";
                    jdbcTemplate.update(deleteOldestQuery, rowsToDelete);
                    System.out.println("Cleaned up " + rowsToDelete + " oldest price records to maintain 5000 row limit");
                }
            } catch (Exception e) {
                System.err.println("Error processing stock_id " + stockId + ": " + e.getMessage());
            }
        }

        return totalInserted;
    }

    public void startScheduledUpdates() {
        // Cancel any existing task
        if (scheduledTask != null && !scheduledTask.isCancelled()) {
            scheduledTask.cancel(false);
        }

        // Schedule the new task to run every 5 seconds
        scheduledTask = scheduler.scheduleAtFixedRate(() -> {
            try {
                updateAllPrices();
                System.out.println("Scheduled price update completed at: " + java.time.LocalDateTime.now());
            } catch (Exception e) {
                System.err.println("Error in scheduled price update: " + e.getMessage());
            }
        }, 0, 500, TimeUnit.MILLISECONDS);
    }

    public void stopScheduledUpdates() {
        if (scheduledTask != null && !scheduledTask.isCancelled()) {
            scheduledTask.cancel(false);
            System.out.println("Scheduled price updates stopped");
        }
    }
}