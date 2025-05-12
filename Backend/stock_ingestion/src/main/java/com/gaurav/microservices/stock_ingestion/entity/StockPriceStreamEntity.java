package com.gaurav.microservices.stock_ingestion.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "stock_price_stream")
@Data
public class StockPriceStreamEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long streamPriceIndex;

    @ManyToOne
    @JoinColumn(name = "stockId", nullable = false)
    private StockMasterEntity stock;

    @Column(nullable = false)
    private Float stockPrice;

    private Float percentageChange;

    @Column(name = "created_at", nullable = false, updatable = false,
            columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime created_at;
}