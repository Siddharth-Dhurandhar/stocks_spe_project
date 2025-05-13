package com.gaurav.microservices.stock_ingestion.services;

import com.gaurav.microservices.stock_ingestion.entity.StockCurrentPriceEntity;
import com.gaurav.microservices.stock_ingestion.entity.StockMasterEntity;
import com.gaurav.microservices.stock_ingestion.entity.StockPriceStreamEntity;
import com.gaurav.microservices.stock_ingestion.exceptionHandler.StockCreationException;
import com.gaurav.microservices.stock_ingestion.repository.StockCurrentPriceRepository;
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

    @Autowired
    private StockCurrentPriceRepository stockCurrentPriceRepository;

    public void createPriceEntriesForStocks(List<StockMasterEntity> savedStocks) {
        try {
            for (StockMasterEntity savedStock : savedStocks) {
                try {
                    // Create price stream entry
                    StockPriceStreamEntity priceStream = new StockPriceStreamEntity();
                    priceStream.setStock(savedStock);
                    priceStream.setStockPrice(savedStock.getInitialPrice());
                    priceStream.setPercentageChange(0.0F);
                    priceStream.setCreated_at(LocalDateTime.now()); // Fix for previous issue

                    stockPriceStreamRepository.save(priceStream);

                    // Create current price entry
                    StockCurrentPriceEntity currentPrice = new StockCurrentPriceEntity();
                    currentPrice.setStock(savedStock);
                    currentPrice.setStockName(savedStock.getStockName());
                    currentPrice.setPrice(savedStock.getInitialPrice());

                    stockCurrentPriceRepository.save(currentPrice);

                } catch (Exception e) {
                    System.err.println("Detailed exception while saving entries: " + e.getClass().getName());
                    e.printStackTrace();
                    throw new StockCreationException("Failed to create entries for: " +
                            savedStock.getStockName(), e);
                }
            }
        } catch (StockCreationException e) {
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
            throw new StockCreationException("Failed to create entries", e);
        }
    }
}