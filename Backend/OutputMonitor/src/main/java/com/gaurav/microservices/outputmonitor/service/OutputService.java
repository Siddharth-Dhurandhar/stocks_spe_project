package com.gaurav.microservices.outputmonitor.service;

import com.gaurav.microservices.outputmonitor.entity.StockMasterEntity;
import com.gaurav.microservices.outputmonitor.repository.StockMasterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OutputService {

    private final StockMasterRepository stockMasterRepository;

    @Autowired
    public OutputService(StockMasterRepository stockMasterRepository) {
        this.stockMasterRepository = stockMasterRepository;
    }

    public List<StockMasterEntity> getAllStocks() {
        return stockMasterRepository.findAll();
    }
}