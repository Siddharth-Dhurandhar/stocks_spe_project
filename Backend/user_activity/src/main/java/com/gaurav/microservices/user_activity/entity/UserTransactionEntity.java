package com.gaurav.microservices.user_activity.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_transactions")
@Data
public class UserTransactionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long transactionId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @ManyToOne
    @JoinColumn(name = "stock_id")
    private StockMasterEntity stock;

    @Column
    private Float purchasedPrice;

    @Column
    private Integer quantity;

    @Column(nullable = false)
    private Float amount;

    @Column(nullable = false, columnDefinition = "FLOAT DEFAULT 0")
    private Float balance;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType transactionType;

    @Column(nullable = false, updatable = false, columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    @CreationTimestamp
    private LocalDateTime created_at;

    public enum TransactionType {
        BUY, SELL, DEPOSIT, WITHDRAW
    }
}