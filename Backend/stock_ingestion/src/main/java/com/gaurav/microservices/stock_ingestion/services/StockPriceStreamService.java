package com.gaurav.microservices.stock_ingestion.services;

import com.gaurav.microservices.stock_ingestion.entity.StockMasterEntity;
import com.gaurav.microservices.stock_ingestion.entity.StockPriceStreamEntity;
import com.gaurav.microservices.stock_ingestion.exceptionHandler.StockCreationException;
import com.gaurav.microservices.stock_ingestion.repository.StockPriceStreamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class StockPriceStreamService {
    private final StockPriceStreamRepository stockPriceStreamRepository;

    @Autowired
    public StockPriceStreamService(StockPriceStreamRepository stockPriceStreamRepository) {
        this.stockPriceStreamRepository = stockPriceStreamRepository;
    }

    @Transactional
    public void createPriceEntriesForStocks(List<StockMasterEntity> savedStocks) {
        try {
            for (StockMasterEntity savedStock : savedStocks) {
                try {
                    StockPriceStreamEntity priceStream = new StockPriceStreamEntity();
                    priceStream.setStock(savedStock);
                    priceStream.setStockPrice(savedStock.getInitialPrice());
                    priceStream.setPercentageChange(0.0F); // Initial entry has 0% change
                    priceStream.setCreated_at(LocalDateTime.now());

                    // Add logging right before saving
                    System.out.println("Attempting to save price entry for stock: " +
                            savedStock.getStockName() + " with price: " +
                            savedStock.getInitialPrice());

                    stockPriceStreamRepository.save(priceStream);
                } catch (Exception e) {
                    // Print detailed exception info
                    System.err.println("Detailed exception while saving price entry: " + e.getClass().getName());
                    e.printStackTrace();
                    throw new StockCreationException("Failed to create price entry for: " +
                            savedStock.getStockName(), e);
                }
            }
        } catch (StockCreationException e) {
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
            throw new StockCreationException("Failed to create price entries", e);
        }
    }
}