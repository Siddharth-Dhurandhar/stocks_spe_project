package com.gaurav.microservices.stock_ingestion.repository;

import com.gaurav.microservices.stock_ingestion.entity.StockPriceStreamEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StockPriceStreamRepository extends JpaRepository<StockPriceStreamEntity, Long> {
}