package com.gaurav.microservices.outputmonitor.service;

import com.gaurav.microservices.outputmonitor.entity.StockMasterEntity;
import com.gaurav.microservices.outputmonitor.repository.StockMasterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OutputService {

    private final StockMasterRepository stockMasterRepository;
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public OutputService(StockMasterRepository stockMasterRepository, JdbcTemplate jdbcTemplate) {
        this.stockMasterRepository = stockMasterRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<StockMasterEntity> getAllStocks() {
        return stockMasterRepository.findAll();
    }

    public Float getUserBalance(Long userId) {
        try {
            String query = "SELECT balance FROM user_transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 1";
            List<Float> results = jdbcTemplate.queryForList(query, Float.class, userId);

            return results.isEmpty() ? null : results.get(0);
        } catch (Exception e) {
            throw new RuntimeException("Failed to retrieve balance for user: " + userId, e);
        }
    }
}