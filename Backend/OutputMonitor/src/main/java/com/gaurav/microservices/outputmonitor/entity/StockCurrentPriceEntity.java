package com.gaurav.microservices.outputmonitor.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "stock_current_price")
@Data
public class StockCurrentPriceEntity {

    @Id
    @Column(name = "stock_id")
    private Long stockId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "stock_id")
    private StockMasterEntity stock;

    @Column(name = "stock_name", nullable = false)
    private String stockName;

    @Column(name = "price", nullable = false)
    private Float price;

    @Column(name = "percent_change")
    private Float percent_change;
}