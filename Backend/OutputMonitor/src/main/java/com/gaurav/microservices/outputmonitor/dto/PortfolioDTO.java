package com.gaurav.microservices.outputmonitor.dto;

import com.gaurav.microservices.outputmonitor.dto.ProfitStatus;

public class PortfolioDTO {
    private Long userId;
    private Long stockId;
    private String stockName;
    private int totalQuantity;
    private float PNL;
    private float investedAmount;
    private ProfitStatus status;
    private float currentPrice;

    // Getters and setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getStockId() {
        return stockId;
    }

    public void setStockId(Long stockId) {
        this.stockId = stockId;
    }

    public int getTotalQuantity() {
        return totalQuantity;
    }

    public void setTotalQuantity(int totalQuantity) {
        this.totalQuantity = totalQuantity;
    }

    public float getPNL() {
        return PNL;
    }

    public void setPNL(float PNL) {
        this.PNL = PNL;
    }

    public ProfitStatus getStatus() {
        return status;
    }

    public void setStatus(ProfitStatus status) {
        this.status = status;
    }

    public float getCurrentPrice() {
        return currentPrice;
    }

    public void setCurrentPrice(float currentPrice) {
        this.currentPrice = currentPrice;
    }

    public String getStockName() {
        return stockName;
    }

    public void setStockName(String stockName) {
        this.stockName = stockName;
    }

    public float getInvestedAmount() {
        return investedAmount;
    }

    public void setInvestedAmount(float investedAmount) {
        this.investedAmount = investedAmount;
    }
}