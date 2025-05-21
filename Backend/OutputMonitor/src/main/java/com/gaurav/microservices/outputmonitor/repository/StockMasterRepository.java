package com.gaurav.microservices.outputmonitor.repository;

import com.gaurav.microservices.outputmonitor.entity.StockMasterEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StockMasterRepository extends JpaRepository<StockMasterEntity, Long> {

}