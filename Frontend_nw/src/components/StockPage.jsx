import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";
import { useUser } from "../context/UserContext";

const StockPage = () => {
  const { id } = useParams();
  const { user } = useUser();
  const [stockDetails, setStockDetails] = useState(null);
  const [priceData, setPriceData] = useState([]);
  const [quantity, setQuantity] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("1W"); // 1D, 1W, 1M, 3M, 1Y
  const [transactionType, setTransactionType] = useState("buy"); // buy or sell

  // Fetch stock details and price data
  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setIsLoading(true);
        // In a real app, replace this with your actual API endpoint
        const response = await fetch(
          `http://gateway-service/output_monitor/retrieve/stockDetails/${id}`
        );
        
        if (!response.ok) {
          throw new Error(`Failed to fetch stock data: ${response.status}`);
        }
        
        const data = await response.json();
        setStockDetails(data);
        
        // Generate mock historical data based on stock's initial price and volatility
        const generateMockPriceData = (initialPrice, volatility, days) => {
          const data = [];
          let currentPrice = initialPrice;
          
          for (let i = days; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            
            // Use volatility to determine price movement range
            const maxChange = initialPrice * (volatility / 100) * 0.5;
            const change = (Math.random() * 2 - 1) * maxChange;
            currentPrice = Math.max(0.01, currentPrice + change);
            
            data.push({
              date: date.toISOString().split('T')[0],
              price: parseFloat(currentPrice.toFixed(2))
            });
          }
          
          return data;
        };
        
        // Generate mock price data if real data isn't available
        const mockPriceData = generateMockPriceData(data.initialPrice, data.volatility, 30);
        setPriceData(mockPriceData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching stock data:", error);
        setIsLoading(false);
      }
    };

    fetchStockData();
  }, [id]);

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    setQuantity(value);

    if (value < 0) {
      setErrorMessage("Invalid amount. Quantity cannot be negative.");
      setTotalPrice(0);
    } else if (value === "") {
      setErrorMessage("");
      setTotalPrice(0);
    } else {
      setErrorMessage("");
      const price = stockDetails?.initialPrice || 0;
      setTotalPrice((value * price).toFixed(2));
    }
  };

  const handleTransaction = async () => {
    if (!quantity || quantity <= 0) {
      setErrorMessage("Please enter a valid quantity.");
      return;
    }
    
    setErrorMessage("");
    
    try {
      const endpoint = transactionType === "buy" 
        ? "http://gateway-service/output_monitor/portfolio/buy" 
        : "http://gateway-service/output_monitor/portfolio/sell";
      
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user,
          stockId: parseInt(id),
          quantity: parseInt(quantity),
          price: stockDetails?.initialPrice
        }),
      });

      if (!response.ok) {
        throw new Error(`Transaction failed: ${response.status}`);
      }

      // Success
      setQuantity("");
      setTotalPrice(0);
      alert(`Successfully ${transactionType === "buy" ? "purchased" : "sold"} ${quantity} shares!`);
    } catch (error) {
      console.error(`Error ${transactionType === "buy" ? "buying" : "selling"} stock:`, error);
      setErrorMessage(error.message || "Transaction failed. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container" style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "50vh"
      }}>
        <div className="loading-spinner" style={{
          width: "50px",
          height: "50px",
          border: "3px solid rgba(59, 130, 246, 0.2)",
          borderRadius: "50%",
          borderTop: "3px solid var(--accent-blue)",
          animation: "spin 1s linear infinite"
        }}></div>
      </div>
    );
  }

  // Filter data based on selected timeframe
  const getTimeframeData = () => {
    if (!priceData?.length) return [];
    
    const now = new Date();
    let cutoffDate = new Date();
    
    switch(timeframe) {
      case "1D":
        cutoffDate.setDate(now.getDate() - 1);
        break;
      case "1W":
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case "1M":
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case "3M":
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
      case "1Y":
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        cutoffDate.setDate(now.getDate() - 7); // Default to 1W
    }
    
    return priceData.filter(item => new Date(item.date) >= cutoffDate);
  };

  const filteredData = getTimeframeData();
  const priceChange = filteredData.length >= 2 
    ? filteredData[filteredData.length - 1].price - filteredData[0].price 
    : 0;
  const priceChangePercent = filteredData.length >= 2 && filteredData[0].price !== 0
    ? (priceChange / filteredData[0].price) * 100
    : 0;
  const isPriceUp = priceChange >= 0;

  return (
    <div style={{ margin: "1rem", overflow: "hidden" }}>
      {/* Floating Orbs Background */}
      <div className="floating-orbs">
        <div className="orb"></div>
        <div className="orb"></div>
        <div className="orb"></div>
      </div>
      
      {/* Header with Stock Info */}
      <div className="glass-panel" style={{ marginBottom: "1.5rem" }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem"
        }}>
          <div>
            <h1 style={{ margin: "0 0 0.25rem 0", fontSize: "1.75rem" }}>
              {stockDetails?.stockName || "Loading..."}
            </h1>
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "0.75rem" 
            }}>
              <span style={{ 
                display: "inline-block",
                padding: "0.25rem 0.5rem",
                background: "rgba(59, 130, 246, 0.2)",
                color: "var(--accent-blue)",
                borderRadius: "4px",
                fontSize: "0.875rem",
                fontWeight: "600",
                letterSpacing: "0.05em"
              }}>
                {stockDetails?.stockSymbol}
              </span>
              <span style={{ 
                color: "var(--text-muted)",
                fontSize: "0.875rem"
              }}>
                {stockDetails?.stockExchange}
              </span>
              <span style={{ 
                color: "var(--text-muted)",
                fontSize: "0.875rem"
              }}>
                {stockDetails?.stockSector}
              </span>
            </div>
          </div>
          
          <div style={{ textAlign: "right" }}>
            <div style={{ 
              fontSize: "1.5rem", 
              fontWeight: "700",
              color: isPriceUp ? "var(--accent-green)" : "#ef4444"
            }}>
              ${filteredData.length ? filteredData[filteredData.length - 1].price : "0.00"}
            </div>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "0.5rem"
            }}>
              <span style={{ 
                color: isPriceUp ? "var(--accent-green)" : "#ef4444",
                fontWeight: "600",
                fontSize: "0.875rem"
              }}>
                {isPriceUp ? "▲" : "▼"} ${Math.abs(priceChange).toFixed(2)} ({Math.abs(priceChangePercent).toFixed(2)}%)
              </span>
              <span style={{ 
                fontSize: "0.75rem", 
                color: "var(--text-muted)" 
              }}>
                {timeframe}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div style={{ 
        display: "grid", 
        gap: "1.5rem",
        gridTemplateColumns: "1fr",
        "@media (min-width: 1024px)": { 
          gridTemplateColumns: "2fr 1fr" 
        }
      }}>
        {/* Chart Section */}
        <div className="glass-panel">
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
            flexWrap: "wrap",
            gap: "1rem"
          }}>
            <h2 style={{ margin: 0, fontSize: "1.25rem" }}>
              Price Chart
            </h2>
            
            <div style={{ 
              display: "flex", 
              gap: "0.5rem" 
            }}>
              {["1D", "1W", "1M", "3M", "1Y"].map((period) => (
                <button
                  key={period}
                  onClick={() => setTimeframe(period)}
                  style={{
                    padding: "0.35rem 0.75rem",
                    borderRadius: "8px",
                    border: "none",
                    background: timeframe === period 
                      ? "var(--accent-blue)" 
                      : "rgba(255, 255, 255, 0.1)",
                    color: timeframe === period 
                      ? "white" 
                      : "var(--text-secondary)",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          
          <div style={{ height: "350px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop 
                      offset="5%" 
                      stopColor={isPriceUp ? "var(--accent-green)" : "#ef4444"} 
                      stopOpacity={0.3}
                    />
                    <stop 
                      offset="95%" 
                      stopColor={isPriceUp ? "var(--accent-green)" : "#ef4444"} 
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  domain={['dataMin - 10', 'dataMax + 10']}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                  dx={-10}
                />
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  vertical={false} 
                  stroke="rgba(255,255,255,0.1)" 
                />
                <Tooltip 
                  contentStyle={{
                    background: "rgba(15, 23, 42, 0.9)",
                    border: "1px solid var(--glass-border)",
                    borderRadius: "8px",
                    boxShadow: "var(--card-shadow)"
                  }}
                  labelStyle={{ color: "var(--text-primary)" }}
                  itemStyle={{ color: isPriceUp ? "var(--accent-green)" : "#ef4444" }}
                  formatter={(value) => [`$${value}`, "Price"]}
                />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke={isPriceUp ? "var(--accent-green)" : "#ef4444"}
                  fill={`url(#colorPrice)`}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          {/* Stock Description */}
          <div style={{
            marginTop: "1.5rem",
            padding: "1rem",
            background: "rgba(255,255,255,0.05)",
            borderRadius: "8px"
          }}>
            <h3 style={{ 
              fontSize: "1rem",
              margin: "0 0 0.5rem 0"
            }}>About {stockDetails?.stockName}</h3>
            <p style={{ 
              margin: 0,
              fontSize: "0.875rem",
              color: "var(--text-secondary)",
              lineHeight: "1.5"
            }}>
              {stockDetails?.stockDescription || "No description available."}
            </p>
          </div>
        </div>
        
        {/* Trading Panel */}
        <div className="glass-panel" style={{ display: "flex", flexDirection: "column" }}>
          <h2 style={{ 
            margin: "0 0 1.5rem 0", 
            fontSize: "1.25rem" 
          }}>
            Trade {stockDetails?.stockSymbol}
          </h2>
          
          {/* Transaction Type Toggle */}
          <div style={{ 
            display: "flex", 
            marginBottom: "1.5rem",
            background: "rgba(255,255,255,0.05)",
            borderRadius: "8px",
            padding: "0.25rem"
          }}>
            <button 
              onClick={() => setTransactionType("buy")}
              style={{
                flex: 1,
                padding: "0.75rem",
                borderRadius: "6px",
                border: "none",
                background: transactionType === "buy" 
                  ? "var(--accent-green)" 
                  : "transparent",
                color: transactionType === "buy" 
                  ? "white" 
                  : "var(--text-secondary)",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              Buy
            </button>
            <button 
              onClick={() => setTransactionType("sell")}
              style={{
                flex: 1,
                padding: "0.75rem",
                borderRadius: "6px",
                border: "none",
                background: transactionType === "sell" 
                  ? "#ef4444" 
                  : "transparent",
                color: transactionType === "sell" 
                  ? "white" 
                  : "var(--text-secondary)",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              Sell
            </button>
          </div>
          
          {/* Trading Details */}
          <div className="input-group">
            <input
              type="number"
              id="quantity"
              className="input"
              placeholder=" "
              value={quantity}
              onChange={handleQuantityChange}
            />
            <label htmlFor="quantity" className="input-label">Quantity</label>
          </div>
          
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            marginBottom: "1rem",
            padding: "0.75rem 1rem",
            background: "rgba(255,255,255,0.05)",
            borderRadius: "8px" 
          }}>
            <span style={{ color: "var(--text-secondary)" }}>
              Market Price
            </span>
            <span style={{ fontWeight: "600" }}>
              ${stockDetails?.initialPrice}
            </span>
          </div>
          
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            marginBottom: "2rem",
            padding: "0.75rem 1rem",
            background: "rgba(255,255,255,0.05)",
            borderRadius: "8px",
            fontWeight: "600",
            fontSize: "1.125rem"
          }}>
            <span>
              Estimated Total
            </span>
            <span>
              ${totalPrice}
            </span>
          </div>
          
          {errorMessage && (
            <div style={{
              padding: "0.75rem",
              borderRadius: "8px",
              background: "rgba(239, 68, 68, 0.2)",
              color: "#ef4444",
              marginBottom: "1.5rem",
              fontSize: "0.875rem"
            }}>
              {errorMessage}
            </div>
          )}
          
          <button 
            onClick={handleTransaction}
            style={{
              padding: "0.875rem",
              borderRadius: "8px",
              border: "none",
              background: transactionType === "buy" 
                ? "var(--accent-green)" 
                : "#ef4444",
              color: "white",
              fontWeight: "600",
              cursor: "pointer",
              marginTop: "auto",
              boxShadow: transactionType === "buy" 
                ? "0 0 15px rgba(34, 197, 94, 0.4)" 
                : "0 0 15px rgba(239, 68, 68, 0.4)",
              transition: "all 0.2s ease"
            }}
          >
            {transactionType === "buy" ? "Buy" : "Sell"} {stockDetails?.stockSymbol}
          </button>
        </div>
      </div>
      
      <style jsx>{`
        @media (min-width: 1024px) {
          div[style*="gridTemplateColumns: 1fr"] {
            grid-template-columns: 2fr 1fr;
          }
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default StockPage;