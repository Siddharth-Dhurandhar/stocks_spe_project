import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useUser } from "../context/UserContext";

const Portfolio = () => {
  const { user } = useUser();
  const [portfolioStocks, setPortfolioStocks] = useState([]);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [portfolioGain, setPortfolioGain] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8085/output_monitor/retrieve/portfolio",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: user }),
          }
        );
        
        if (!response.ok) {
          throw new Error(`Failed to fetch portfolio data: ${response.status}`);
        }
        
        const data = await response.json();

        // Calculate total value and gain/loss
        const totalInvested = data.reduce(
          (sum, stock) => sum + stock.investedAmount,
          0
        );
        
        const totalCurrentValue = data.reduce(
          (sum, stock) => sum + (stock.currentPrice * stock.totalQuantity),
          0
        );
        
        const totalPnl = data.reduce(
          (sum, stock) => sum + stock.pnl,
          0
        );
        
        const totalGain = totalInvested > 0 
          ? (totalPnl / totalInvested) * 100 
          : 0;

        setPortfolioStocks(data);
        setPortfolioValue(totalCurrentValue);
        setPortfolioGain(totalGain);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching portfolio data:", error);
        setIsLoading(false);
      }
    };

    if (user) {
      fetchPortfolioData();
    }
  }, [user]);

  const COLORS = ["#22c55e", "#ef4444", "#3b82f6", "#facc15", "#8b5cf6", "#ec4899", "#f97316", "#14b8a6"];

  if (isLoading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p>Loading portfolio data...</p>
      </div>
    );
  }

  // Check if portfolio is empty
  if (portfolioStocks.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "50px 20px" }}>
        <h2>No stocks in your portfolio</h2>
        <p>Start investing to build your portfolio!</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <header style={{ borderBottom: "1px solid black", padding: "1rem" }}>
        <h1 style={{ textAlign: "center" }}>My Portfolio</h1>

        {/* Summary Cards */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            marginTop: "1rem",
          }}
        >
          {[
            {
              label: "Portfolio Value",
              value: `$${portfolioValue.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`,
            },
            {
              label: "Total Return",
              value:
                portfolioGain >= 0
                  ? `+${portfolioGain.toFixed(2)}%`
                  : `${portfolioGain.toFixed(2)}%`,
              color: portfolioGain >= 0 ? "green" : "red",
            },
            {
              label: "Holdings",
              value: portfolioStocks.length,
            },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              style={{
                border: "1px solid black",
                borderRadius: "8px",
                padding: "1rem",
                minWidth: "120px",
                textAlign: "center",
              }}
            >
              <h3 style={{ fontSize: "0.8rem", marginBottom: "0.5rem" }}>
                {label}
              </h3>
              <p style={{ 
                fontWeight: "bold", 
                fontSize: "1.2rem",
                color: color
              }}>
                {value}
              </p>
            </div>
          ))}
        </div>
      </header>

      {/* Main Section */}
      <main style={{ maxWidth: 900, margin: "2rem auto" }}>
        <div
          style={{
            display: "flex",
            gap: "2rem",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {/* Portfolio List */}
          <section
            style={{
              flex: "1 1 400px",
              border: "1px solid black",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <header
              style={{
                padding: "1rem",
                borderBottom: "1px solid black",
                backgroundColor: "#f0f0f0",
              }}
            >
              <h2>Stocks in Portfolio</h2>
            </header>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 1fr",
                fontWeight: "bold",
                padding: "0.5rem 1rem",
                backgroundColor: "#e0e0e0",
              }}
            >
              <div>Stock</div>
              <div style={{ textAlign: "right" }}>Current Price</div>
              <div style={{ textAlign: "right" }}>Value</div>
              <div style={{ textAlign: "right" }}>P&L</div>
            </div>

            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {portfolioStocks.map((stock) => (
                <li
                  key={stock.stockId}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr 1fr 1fr",
                    alignItems: "center",
                    padding: "0.75rem 1rem",
                    borderBottom: "1px solid black",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: "bold" }}>{stock.stockName}</div>
                    <div style={{ fontSize: "0.85rem", color: "#555" }}>
                      {stock.totalQuantity} shares
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    ${stock.currentPrice.toFixed(2)}
                  </div>

                  <div style={{ textAlign: "right", fontWeight: "bold" }}>
                    ${(stock.currentPrice * stock.totalQuantity).toFixed(2)}
                  </div>

                  <div
                    style={{
                      textAlign: "right",
                      fontWeight: "bold",
                      color: stock.status === "PROFIT" ? "green" : stock.status === "LOSS" ? "red" : "black",
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      gap: "0.3rem",
                    }}
                  >
                    {stock.status === "PROFIT" ? "▲" : stock.status === "LOSS" ? "▼" : "◆"} 
                    ${stock.pnl.toFixed(2)}
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Investment Breakdown Chart */}
          <section
            style={{
              flex: "1 1 380px",
              border: "1px solid black",
              borderRadius: "8px",
              padding: "1rem",
              minWidth: 380,
              maxWidth: 520,
              height: 480,
            }}
          >
            <header
              style={{
                borderBottom: "1px solid black",
                paddingBottom: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              <h2>Investment Breakdown</h2>
            </header>

            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={portfolioStocks.map((stock) => ({
                    name: stock.stockName,
                    value: stock.investedAmount,
                  }))}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={75}
                  outerRadius={130}
                  paddingAngle={4}
                  labelLine={false}
                  label={false}
                  fill="#22c55e"
                >
                  {portfolioStocks.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke="#000"
                      strokeWidth={2}
                      opacity={0.95}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`$${value.toFixed(2)}`, "Invested"]}
                  contentStyle={{
                    backgroundColor: "#111827",
                    color: "#d1fae5",
                    borderRadius: "12px",
                    border: "none",
                    boxShadow:
                      "0 15px 30px -10px rgba(34,197,94,0.4), 0 10px 20px -5px rgba(0,0,0,0.7)",
                    fontSize: "14px",
                    padding: "10px 18px",
                  }}
                  itemStyle={{ color: "#d1fae5" }}
                />
                <Legend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  iconSize={14}
                  wrapperStyle={{
                    color: "#111827",
                    fontSize: "14px",
                    paddingLeft: "16px",
                    fontWeight: "600",
                    letterSpacing: "0.03em",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <footer style={{ marginTop: "1rem" }}>
              <h3>Portfolio Diversity</h3>
              <p>
                Your investment is distributed across{" "}
                <strong>{portfolioStocks.length}</strong> different stocks.
              </p>
            </footer>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Portfolio;