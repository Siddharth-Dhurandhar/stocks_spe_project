package com.gaurav.microservices.outputmonitor.service;

import com.gaurav.microservices.outputmonitor.dto.PortfolioDTO;
import com.gaurav.microservices.outputmonitor.entity.StockMasterEntity;
import com.gaurav.microservices.outputmonitor.dto.ProfitStatus;
import com.gaurav.microservices.outputmonitor.entity.StockPriceStreamEntity;
import com.gaurav.microservices.outputmonitor.repository.StockMasterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class OutputService {

    private final StockMasterRepository stockMasterRepository;
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public OutputService(StockMasterRepository stockMasterRepository, JdbcTemplate jdbcTemplate) {
        this.stockMasterRepository = stockMasterRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<StockMasterEntity> getAllStocks() {
        // Get all stocks from repository
        List<StockMasterEntity> stocks = stockMasterRepository.findAll();

        // For each stock, replace initialPrice with current price
        for (StockMasterEntity stock : stocks) {
            try {
                String query = "SELECT price FROM stock_current_price WHERE stock_id = ?";
                Float currentPrice = jdbcTemplate.queryForObject(query, Float.class, stock.getStockId());

                // Replace initialPrice with current price if available
                if (currentPrice != null) {
                    stock.setInitialPrice(currentPrice);
                }
            } catch (EmptyResultDataAccessException e) {
                // No current price found, keep initialPrice as is
                continue;
            } catch (Exception e) {
                // Log error but continue processing other stocks
                System.err.println("Error fetching current price for stock ID " + stock.getStockId() + ": " + e.getMessage());
            }
        }

        return stocks;
    }

    public Float getUserBalance(Long userId) {
        try {
            String query = "SELECT balance FROM user_transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 1";
            List<Float> results = jdbcTemplate.queryForList(query, Float.class, userId);

            return results.isEmpty() ? null : results.get(0);
        } catch (Exception e) {
            throw new RuntimeException("Failed to retrieve balance for user: " + userId, e);
        }
    }

    public float calculatePNLForStock(Long userId, Long stockId) {
            // Calculate total cost and quantity of bought shares
            String costQuery = "SELECT COALESCE(SUM(amount), 0) as total_cost, COALESCE(SUM(quantity), 0) as total_quantity " +
                    "FROM user_transactions " +
                    "WHERE user_id = ? AND stock_id = ? AND transaction_type = 'BUY'";
            Map<String, Object> costResult = jdbcTemplate.queryForMap(costQuery, userId, stockId);

            float totalCost = ((Number) costResult.get("total_cost")).floatValue();
            int totalBoughtShares = ((Number) costResult.get("total_quantity")).intValue();
            float avgCostPerShare = totalBoughtShares > 0 ? totalCost / totalBoughtShares : 0;

            // Calculate total proceeds and quantity of sold shares
            String sellQuery = "SELECT COALESCE(SUM(amount), 0) as total_proceeds, COALESCE(SUM(quantity), 0) as total_sold " +
                    "FROM user_transactions " +
                    "WHERE user_id = ? AND stock_id = ? AND transaction_type = 'SELL'";
            Map<String, Object> sellResult = jdbcTemplate.queryForMap(sellQuery, userId, stockId);

            float totalProceeds = ((Number) sellResult.get("total_proceeds")).floatValue();
            int totalSoldShares = ((Number) sellResult.get("total_sold")).intValue();

            // Calculate cost basis of sold shares
            float costBasisOfSoldShares = totalSoldShares * avgCostPerShare;

            // Calculate realized PNL (profit/loss)
            float realizedPNL = totalProceeds - costBasisOfSoldShares;

            return realizedPNL;

    }
    public float calculateTotalPNL(Long userId) {
        // Get all distinct stock IDs for the user's transactions
        String stockQuery = "SELECT DISTINCT stock_id FROM user_transactions " +
                "WHERE user_id = ? AND stock_id IS NOT NULL";
        List<Long> stockIds = jdbcTemplate.queryForList(stockQuery, Long.class, userId);

        // Calculate PNL for each stock and sum them
        float totalPNL = 0.0f;
        for (Long stockId : stockIds) {
            totalPNL += calculatePNLForStock(userId, stockId);
        }

        return totalPNL;
    }

    public List<PortfolioDTO> portfolioCalculate(Long userId) {
        List<PortfolioDTO> portfolio = new ArrayList<>();

        try {
            // Get all distinct stock IDs for the user's transactions
            String stockQuery = "SELECT DISTINCT stock_id FROM user_transactions " +
                    "WHERE user_id = ? AND stock_id IS NOT NULL";
            List<Long> stockIds = jdbcTemplate.queryForList(stockQuery, Long.class, userId);

            for (Long stockId : stockIds) {
                // 1. Calculate totalQuantity (BUY - SELL)
                String quantityQuery = "SELECT " +
                        "(SELECT COALESCE(SUM(quantity), 0) FROM user_transactions WHERE user_id = ? AND stock_id = ? AND transaction_type = 'BUY') - " +
                        "(SELECT COALESCE(SUM(quantity), 0) FROM user_transactions WHERE user_id = ? AND stock_id = ? AND transaction_type = 'SELL') " +
                        "AS total_quantity";
                Integer totalQuantity = jdbcTemplate.queryForObject(quantityQuery, Integer.class, userId, stockId, userId, stockId);

                // Skip if user doesn't hold any shares of this stock
                if (totalQuantity == null || totalQuantity <= 0) {
                    continue;
                }

                PortfolioDTO stockPortfolio = new PortfolioDTO();
                stockPortfolio.setUserId(userId);
                stockPortfolio.setStockId(stockId);
                stockPortfolio.setTotalQuantity(totalQuantity);

                // 2. Calculate PNL for this stock
                float pnl = calculatePNLForStock(userId, stockId);
                stockPortfolio.setPNL(pnl);

                // 3. Get stock name from stock_master
                String stockNameQuery = "SELECT stock_name FROM stock_master WHERE stock_id = ?";
                String stockName = jdbcTemplate.queryForObject(stockNameQuery, String.class, stockId);
                stockPortfolio.setStockName(stockName);

                // 4. Set status based on PNL
                if (pnl > 0) {
                    stockPortfolio.setStatus(ProfitStatus.PROFIT);
                } else if (pnl < 0) {
                    stockPortfolio.setStatus(ProfitStatus.LOSS);
                } else {
                    stockPortfolio.setStatus(ProfitStatus.NEUTRAL);
                }

                // 5. Get current price
                String priceQuery = "SELECT price FROM stock_current_price WHERE stock_id = ?";
                Float currentPrice = jdbcTemplate.queryForObject(priceQuery, Float.class, stockId);
                stockPortfolio.setCurrentPrice(currentPrice);

                // 6. Calculate invested amount (quantity * currentPrice)
                float investedAmount = totalQuantity * currentPrice;
                stockPortfolio.setInvestedAmount(investedAmount);

                portfolio.add(stockPortfolio);
            }
        } catch (Exception e) {
            throw new RuntimeException("Error calculating portfolio for user: " + userId, e);
        }

        return portfolio;
    }

    public Map<String, Object> getUserDetails(Long userId) {
        try {
            String query = "SELECT * FROM user_master WHERE user_id = ?";
            List<Map<String, Object>> results = jdbcTemplate.queryForList(query, userId);

            return results.isEmpty() ? null : results.get(0);
        } catch (Exception e) {
            throw new RuntimeException("Failed to retrieve details for user: " + userId, e);
        }
    }

    public StockMasterEntity getStockDetail(Long stockId) {
        try {
            String query = "SELECT * FROM stock_master WHERE stock_id = ?";
            return jdbcTemplate.queryForObject(query,
                    new BeanPropertyRowMapper<>(StockMasterEntity.class),
                    stockId);
        } catch (EmptyResultDataAccessException e) {
            return null;
        } catch (Exception e) {
            throw new RuntimeException("Failed to retrieve stock details for stockId: " + stockId, e);
        }
    }

    public List<StockPriceStreamEntity> getStockPriceHistory(Long stockId) {
        try {
            String query = "SELECT * FROM stock_price_stream WHERE stock_id = ? ORDER BY created_at ASC";
            return jdbcTemplate.query(query,
                    (rs, rowNum) -> {
                        StockPriceStreamEntity entity = new StockPriceStreamEntity();
                        entity.setStreamPriceIndex(rs.getLong("stream_price_index"));

                        StockMasterEntity stockEntity = new StockMasterEntity();
                        stockEntity.setStockId(rs.getLong("stock_id"));
                        entity.setStock(stockEntity);

                        entity.setStockPrice(rs.getFloat("stock_price"));
                        entity.setPercentageChange(rs.getObject("percentage_change") != null ? rs.getFloat("percentage_change") : null);
                        entity.setCreated_at(rs.getTimestamp("created_at").toLocalDateTime());

                        return entity;
                    },
                    stockId);
        } catch (Exception e) {
            throw new RuntimeException("Failed to retrieve price history for stockId: " + stockId, e);
        }
    }
}