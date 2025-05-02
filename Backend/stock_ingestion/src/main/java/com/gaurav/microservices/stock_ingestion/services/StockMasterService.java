package com.gaurav.microservices.stock_ingestion.services;


import com.gaurav.microservices.stock_ingestion.entity.StockMasterEntity;
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
        return stockMasterRepository.save(stock);
    }

    public List<StockMasterEntity> getAllStocks() {
        return stockMasterRepository.findAll();
    }

    public Optional<StockMasterEntity> getStockById(Long id) {
        return stockMasterRepository.findById(id);
    }
}