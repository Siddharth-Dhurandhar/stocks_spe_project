import React, { useEffect, useState, useRef } from "react";
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
  AreaChart,
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
  const [selectedPercentage, setSelectedPercentage] = useState("50%");
  const [transactionType, setTransactionType] = useState("buy");
  const [latestPrice, setLatestPrice] = useState(null);
  const [isPriceUp, setIsPriceUp] = useState(true);
  const intervalRef = useRef(null);
  
  // Add this line to define the percentage options
  const percentageOptions = ["25%", "50%", "75%", "100%"];

  // Fetch functions
  const fetchStockData = async () => {
    try {
      const response = await fetch(
        "/output_monitor/retrieve/stockDetail",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            stockId: parseInt(id),
          }),
        }
      );
      if (!response.ok) throw new Error(`Failed to fetch stock data: ${response.status}`);
      const data = await response.json();
      const processedData = {
        ...data,
        initialPrice: parseFloat(data.initialPrice) || 0,
        volatility: parseFloat(data.volatility) || 1
      };
      setStockDetails(processedData);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  };

  const fetchPriceHistory = async () => {
    try {
      const response = await fetch(
        "/output_monitor/retrieve/stockPriceHistory",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            stockId: parseInt(id),
          }),
        }
      );
      if (!response.ok) throw new Error(`Failed to fetch price history: ${response.status}`);
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        const formattedData = data.map(item => ({
          date: item.created_at,
          price: item.stockPrice,
          percentChange: item.percentageChange
        }));
        formattedData.sort((a, b) => new Date(a.date) - new Date(b.date));
        setPriceData(formattedData);
        const latestData = formattedData[formattedData.length - 1];
        setLatestPrice(latestData.price);
        setIsPriceUp(latestData.percentChange >= 0);
      }
    } catch (error) {
      console.error("Error fetching price history:", error);
    }
  };

  // Polling effect
  useEffect(() => {
    setIsLoading(true);
    fetchStockData();
    fetchPriceHistory();
    setIsLoading(false);

    const interval = setInterval(() => {
      fetchStockData();
      fetchPriceHistory();
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line
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
      // Make sure we have a valid price
      const price = parseFloat(stockDetails?.initialPrice) || 0;
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
      const endpoint =
        "/user_activity/transactions/buysell";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user,
          quantity: parseInt(quantity),
          stock_id: parseInt(id),
          transaction_type: transactionType === "buy" ? "BUY" : "SELL",
        }),
      });

      if (!response.ok) {
        let errorMsg = `Transaction failed: ${response.status}`;
        const errorText = await response.text();
        try {
          const errorData = JSON.parse(errorText);
          if (errorData && errorData.message) {
            errorMsg = errorData.message;
          } else if (errorText) {
            errorMsg = errorText;
          }
        } catch {
          if (errorText) errorMsg = errorText;
        }
        throw new Error(errorMsg);
      }

      // Success
      setQuantity("");
      setTotalPrice(0);
      alert(
        `Successfully ${
          transactionType === "buy" ? "purchased" : "sold"
        } ${quantity} shares!`
      );
    } catch (error) {
      console.error(
        `Error ${transactionType === "buy" ? "buying" : "selling"} stock:`,
        error
      );
      setErrorMessage(error.message || "Transaction failed. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div
        className="loading-container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <div
          className="loading-spinner"
          style={{
            width: "50px",
            height: "50px",
            border: "3px solid rgba(59, 130, 246, 0.2)",
            borderRadius: "50%",
            borderTop: "3px solid var(--accent-blue)",
            animation: "spin 1s linear infinite",
          }}
        ></div>
      </div>
    );
  }

  // Replace the timeframe filtering function with percentage-based filtering
  const getFilteredData = () => {
    if (!priceData?.length) return [];

    const totalDataPoints = priceData.length;
    let percentToShow = 50; // Default 50%
    
    switch (selectedPercentage) {
      case "25%":
        percentToShow = 25;
        break;
      case "50%":
        percentToShow = 50;
        break;
      case "75%":
        percentToShow = 75;
        break;
      case "100%":
        percentToShow = 100;
        break;
      default:
        percentToShow = 50;
    }
    
    const dataPointsToShow = Math.max(1, Math.ceil(totalDataPoints * (percentToShow / 100)));
    return priceData.slice(-dataPointsToShow); // Get the latest X% of data points
  };

  const filteredData = getFilteredData();
  const priceChange =
    filteredData.length >= 2
      ? filteredData[filteredData.length - 1].price - filteredData[0].price
      : 0;
  const priceChangePercent =
    filteredData.length >= 2 && filteredData[0].price !== 0
      ? (priceChange / filteredData[0].price) * 100
      : 0;
  // Rename this variable to avoid the redeclaration
  const isPriceIncreasing = priceChange >= 0;

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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <h1 style={{ margin: "0 0 0.25rem 0", fontSize: "1.75rem" }}>
              {stockDetails?.stockName || "Loading..."}
            </h1>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  padding: "0.25rem 0.5rem",
                  background: "rgba(59, 130, 246, 0.2)",
                  color: "var(--accent-blue)",
                  borderRadius: "4px",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  letterSpacing: "0.05em",
                }}
              >
                {stockDetails?.stockSymbol}
              </span>
              <span
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.875rem",
                }}
              >
                {stockDetails?.stockExchange}
              </span>
              <span
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.875rem",
                }}
              >
                {stockDetails?.stockSector}
              </span>
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: "700",
                color: isPriceUp ? "var(--accent-green)" : "#ef4444",
              }}
            >
              ${latestPrice ? latestPrice.toFixed(2) : (stockDetails?.initialPrice ? stockDetails.initialPrice.toFixed(2) : "0.00")}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: "0.5rem",
              }}
            >
              <span
                style={{
                  color: isPriceUp ? "var(--accent-green)" : "#ef4444", 
                  fontWeight: "600",
                  fontSize: "0.875rem",
                }}
              >
                {isPriceUp ? "▲" : "▼"} {filteredData.length > 0 ? 
                  Math.abs(filteredData[filteredData.length-1].percentChange).toFixed(2) : 
                  (stockDetails?.volatility ? stockDetails.volatility.toFixed(2) : "0.00")}%
              </span>
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                }}
              >
                {selectedPercentage} data
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gap: "1.5rem",
          gridTemplateColumns: "1fr",
          "@media (min-width: 1024px)": {
            gridTemplateColumns: "2fr 1fr",
          },
        }}
      >
        {/* Chart Section */}
        <div className="glass-panel">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <h2 style={{ margin: 0, fontSize: "1.25rem" }}>Price Chart</h2>

            {/* Replace the timeframe buttons */}
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {percentageOptions.map((percent) => (
                <button
                  key={percent}
                  onClick={() => setSelectedPercentage(percent)}
                  style={{
                    padding: "0.35rem 0.75rem",
                    borderRadius: "8px",
                    border: "none",
                    background:
                      selectedPercentage === percent
                        ? "var(--accent-blue)"
                        : "rgba(255, 255, 255, 0.1)",
                    color:
                      selectedPercentage === percent ? "white" : "var(--text-secondary)",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  {percent}
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
                  tick={{ fill: "var(--text-muted)", fontSize: 12 }}
                  dy={10}
                  tickFormatter={(timestamp) => {
                    // Convert the API timestamp string to a readable format
                    const date = new Date(timestamp);
                    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  }}
                />
                <YAxis
                  domain={['auto', 'auto']}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--text-muted)", fontSize: 12 }}
                  dx={-10}
                  tickFormatter={(value) => `$${Math.round(value)}`}
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
                    boxShadow: "var(--card-shadow)",
                  }}
                  labelStyle={{ color: "var(--text-primary)" }}
                  itemStyle={{
                    color: isPriceUp ? "var(--accent-green)" : "#ef4444",
                  }}
                  formatter={(value) => [`$${value.toFixed(2)}`, "Price"]}
                  labelFormatter={(timestamp) => {
                    // Format the full date and time for tooltip
                    return new Date(timestamp).toLocaleString();
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke={isPriceUp ? "var(--accent-green)" : "#ef4444"}
                  fill="url(#colorPrice)"
                  strokeWidth={2}
                  animationDuration={500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Stock Description */}
          <div
            style={{
              marginTop: "1.5rem",
              padding: "1rem",
              background: "rgba(255,255,255,0.05)",
              borderRadius: "8px",
            }}
          >
            <h3
              style={{
                fontSize: "1rem",
                margin: "0 0 0.5rem 0",
              }}
            >
              About {stockDetails?.stockName}
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: "0.875rem",
                color: "var(--text-secondary)",
                lineHeight: "1.5",
              }}
            >
              {stockDetails?.stockDescription || "No description available."}
            </p>
          </div>
        </div>

        {/* Trading Panel */}
        <div
          className="glass-panel"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <h2
            style={{
              margin: "0 0 1.5rem 0",
              fontSize: "1.25rem",
            }}
          >
            Trade {stockDetails?.stockSymbol}
          </h2>

          {/* Transaction Type Toggle */}
          <div
            style={{
              display: "flex",
              marginBottom: "1.5rem",
              background: "rgba(255,255,255,0.05)",
              borderRadius: "8px",
              padding: "0.25rem",
            }}
          >
            <button
              onClick={() => setTransactionType("buy")}
              style={{
                flex: 1,
                padding: "0.75rem",
                borderRadius: "6px",
                border: "none",
                background:
                  transactionType === "buy"
                    ? "var(--accent-green)"
                    : "transparent",
                color:
                  transactionType === "buy" ? "white" : "var(--text-secondary)",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease",
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
                background:
                  transactionType === "sell" ? "#ef4444" : "transparent",
                color:
                  transactionType === "sell"
                    ? "white"
                    : "var(--text-secondary)",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease",
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
            <label htmlFor="quantity" className="input-label">
              Quantity
            </label>
          </div>

          {/* Market Price display */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "1rem",
            padding: "0.75rem 1rem",
            background: "rgba(255,255,255,0.05)",
            borderRadius: "8px",
          }}>
            <span style={{ color: "var(--text-secondary)" }}>Market Price</span>
            <span style={{ fontWeight: "600" }}>
              ${latestPrice ? latestPrice.toFixed(2) : (stockDetails?.initialPrice || 0).toFixed(2)}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "2rem",
              padding: "0.75rem 1rem",
              background: "rgba(255,255,255,0.05)",
              borderRadius: "8px",
              fontWeight: "600",
              fontSize: "1.125rem",
            }}
          >
            <span>Estimated Total</span>
            <span>${totalPrice}</span>
          </div>

          {errorMessage && (
            <div
              style={{
                padding: "0.75rem",
                borderRadius: "8px",
                background: "rgba(239, 68, 68, 0.2)",
                color: "#ef4444",
                marginBottom: "1.5rem",
                fontSize: "0.875rem",
              }}
            >
              {errorMessage}
            </div>
          )}

          <button
            onClick={handleTransaction}
            style={{
              padding: "0.875rem",
              borderRadius: "8px",
              border: "none",
              background:
                transactionType === "buy" ? "var(--accent-green)" : "#ef4444",
              color: "white",
              fontWeight: "600",
              cursor: "pointer",
              marginTop: "auto",
              boxShadow:
                transactionType === "buy"
                  ? "0 0 15px rgba(34, 197, 94, 0.4)"
                  : "0 0 15px rgba(239, 68, 68, 0.4)",
              transition: "all 0.2s ease",
            }}
          >
            {transactionType === "buy" ? "Buy" : "Sell"}{" "}
            {stockDetails?.stockSymbol}
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
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default StockPage;
