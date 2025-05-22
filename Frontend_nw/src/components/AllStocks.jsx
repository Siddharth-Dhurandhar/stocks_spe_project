import React, { useEffect, useState } from "react";

const AllStocks = () => {
  const [stocks, setStocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8085/output_monitor/retrieve/allStockDetails"
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch stock data: ${response.status}`);
        }
        const data = await response.json();
        setStocks(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching stock data:", error);
        setIsLoading(false);
      }
    };

    fetchStockData();
  }, []);

  if (isLoading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p>Loading stocks...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h1>All Stocks</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {stocks.map((stock) => (
          <li
            key={stock.stockId}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "15px",
              marginBottom: "15px",
              display: "flex",
              justifyContent: "space-between",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              backgroundColor: "#fff"
            }}
          >
            <div>
              <h3 style={{ margin: "0 0 8px 0" }}>
                {stock.stockName} ({stock.stockSymbol})
              </h3>
              <p style={{ margin: "0", color: "#666" }}>
                {stock.stockExchange}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <h3 style={{ margin: "0 0 8px 0", color: "#2c3e50" }}>
                ${stock.initialPrice.toFixed(2)}
              </h3>
              <p style={{ margin: "0", color: "#666" }}>
                Volatility: {stock.volatility}%
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllStocks;