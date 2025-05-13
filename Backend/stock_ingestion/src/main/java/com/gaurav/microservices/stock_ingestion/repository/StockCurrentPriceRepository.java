package com.gaurav.microservices.stock_ingestion.repository;

import com.gaurav.microservices.stock_ingestion.entity.StockCurrentPriceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StockCurrentPriceRepository extends JpaRepository<StockCurrentPriceEntity, Long> {
}