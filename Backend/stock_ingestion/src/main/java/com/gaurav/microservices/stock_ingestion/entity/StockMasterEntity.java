package com.gaurav.microservices.stock_ingestion.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "stock_master")
@Data
public class StockMasterEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long stockId;

    @Column(nullable = false)
    private String stockName;

    @Column(nullable = false)
    private String stockSymbol;

    @Column(nullable = false)
    private String stockExchange;

    private String stockSector;

    @Column(nullable = false)
    private Float initialPrice;

    @Column(length = 500)
    private String stockDescription;
}