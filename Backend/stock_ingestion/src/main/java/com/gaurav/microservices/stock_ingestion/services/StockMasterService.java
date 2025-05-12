package com.gaurav.microservices.stock_ingestion.services;

import com.gaurav.microservices.stock_ingestion.entity.StockMasterEntity;
import com.gaurav.microservices.stock_ingestion.exceptionHandler.StockCreationException;
import com.gaurav.microservices.stock_ingestion.repository.StockMasterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StockMasterService {
    private final StockMasterRepository stockMasterRepository;

    @Autowired
    public StockMasterService(StockMasterRepository stockMasterRepository) {
        this.stockMasterRepository = stockMasterRepository;
    }

    public StockMasterEntity saveStock(StockMasterEntity stock) {
        try {
            StockMasterEntity savedStock = stockMasterRepository.save(stock);
            return savedStock;
        } catch (Exception e) {
            throw new StockCreationException("Failed to save stock: " + stock.getStockName(), e);
        }
    }

    public List<StockMasterEntity> getAllStocks() {
        try {
            return stockMasterRepository.findAll();
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch all stocks", e);
        }
    }

    public Optional<StockMasterEntity> getStockById(Long id) {
        try {
            return stockMasterRepository.findById(id);
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch stock with id: " + id, e);
        }
    }
}