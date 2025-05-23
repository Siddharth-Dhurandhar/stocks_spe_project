import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useUser } from "../context/UserContext";

const Portfolio = () => {
  const { user } = useUser();
  const [portfolioStocks, setPortfolioStocks] = useState([]);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [portfolioGain, setPortfolioGain] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock data for the performance chart
  const performanceData = [
    { name: "Jan", value: 4000 },
    { name: "Feb", value: 3000 },
    { name: "Mar", value: 5000 },
    { name: "Apr", value: 4500 },
    { name: "May", value: 6000 },
    { name: "Jun", value: 5500 },
    { name: "Jul", value: 7000 },
  ];

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const response = await fetch(
          "output_monitor/retrieve/portfolio",
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

  const COLORS = ["#22c55e", "#3b82f6", "#8b5cf6", "#ec4899", "#f97316", "#facc15", "#14b8a6", "#ef4444"];

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

  // Check if portfolio is empty
  if (portfolioStocks.length === 0) {
    return (
      <div className="glass-panel" style={{
        margin: "2rem",
        textAlign: "center",
        padding: "3rem"
      }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 1.5rem" }}>
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="8" y1="21" x2="16" y2="21"></line>
          <line x1="12" y1="17" x2="12" y2="21"></line>
        </svg>
        <h2>No Assets Yet</h2>
        <p style={{ color: "var(--text-muted)", maxWidth: "400px", margin: "0 auto" }}>
          Your portfolio is empty. Start investing to track your performance and assets.
        </p>
        <button className="btn-primary" style={{ marginTop: "1.5rem" }}>
          Explore Markets
        </button>
      </div>
    );
  }

  return (
    <div style={{ margin: "1rem" }}>
      {/* Floating Orbs Background */}
      <div className="floating-orbs">
        <div className="orb"></div>
        <div className="orb"></div>
        <div className="orb"></div>
      </div>
      
      {/* Header - Portfolio Overview */}
      <div className="glass-panel" style={{ marginBottom: "1.5rem" }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem"
        }}>
          <div>
            <h1 style={{ margin: "0 0 0.25rem 0", fontSize: "1.75rem" }}>Portfolio</h1>
            <p style={{ color: "var(--text-secondary)", margin: "0" }}>
              Your investment performance and assets
            </p>
          </div>
          <div style={{
            padding: "0.5rem 1rem",
            background: portfolioGain >= 0 
              ? "rgba(34, 197, 94, 0.15)" 
              : "rgba(239, 68, 68, 0.15)",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}>
            <span style={{ 
              color: portfolioGain >= 0 ? "var(--accent-green)" : "#ef4444",
              fontWeight: "600"
            }}>
              {portfolioGain >= 0 ? "▲" : "▼"} {Math.abs(portfolioGain).toFixed(2)}%
            </span>
            <span style={{ 
              fontSize: "0.75rem", 
              color: "var(--text-muted)" 
            }}>
              All time
            </span>
          </div>
        </div>
      </div>
      
      {/* Value Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3" style={{ marginBottom: "1.5rem" }}>
        {/* Total Value Card */}
        <div className="glass-panel">
          <div style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "0.5rem" }}>
            Total Value
          </div>
          <div style={{ 
            fontSize: "1.75rem", 
            fontWeight: "700", 
            background: "linear-gradient(90deg, #22c55e, #3b82f6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            ${portfolioValue.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "0.25rem", 
            marginTop: "0.5rem" 
          }}>
            <div style={{ 
              width: "8px", 
              height: "8px", 
              borderRadius: "50%",
              background: portfolioGain >= 0 ? "var(--accent-green)" : "#ef4444" 
            }}></div>
            <span style={{ 
              fontSize: "0.875rem",
              color: portfolioGain >= 0 ? "var(--accent-green)" : "#ef4444"
            }}>
              {portfolioGain >= 0 ? "+" : ""}{portfolioGain.toFixed(2)}%
            </span>
          </div>
        </div>
        
        {/* Holdings Card */}
        <div className="glass-panel">
          <div style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "0.5rem" }}>
            Holdings
          </div>
          <div style={{ fontSize: "1.75rem", fontWeight: "700" }}>
            {portfolioStocks.length}
          </div>
          <div style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "var(--text-muted)" }}>
            Assets across {new Set(portfolioStocks.map(s => s.stockName.split(' ')[0])).size} companies
          </div>
        </div>
        
        {/* Performance Card */}
        <div className="glass-panel">
          <div style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "0.75rem" }}>
            Performance (Last 7 Days)
          </div>
          
          <div style={{ height: "60px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Portfolio Details Section */}
      <div className="grid lg:grid-cols-5" style={{ gap: "1.5rem" }}>
        {/* Assets Table - Takes 3/5 of the space */}
        <div className="glass-panel lg:col-span-3">
          <h2 style={{ marginTop: "0", marginBottom: "1rem", fontSize: "1.25rem" }}>
            Assets
          </h2>
          
          <div style={{ overflowX: "auto" }}>
            <table style={{ 
              width: "100%", 
              borderCollapse: "separate", 
              borderSpacing: "0" 
            }}>
              <thead>
                <tr style={{ textAlign: "left" }}>
                  <th style={{ 
                    padding: "0.75rem 1rem",
                    borderBottom: "1px solid rgba(255,255,255,0.1)",
                    color: "var(--text-muted)",
                    fontWeight: "500",
                    fontSize: "0.875rem"
                  }}>Stock</th>
                  <th style={{ 
                    padding: "0.75rem 1rem",
                    borderBottom: "1px solid rgba(255,255,255,0.1)",
                    color: "var(--text-muted)",
                    fontWeight: "500",
                    fontSize: "0.875rem",
                    textAlign: "right"
                  }}>Quantity</th>
                  <th style={{ 
                    padding: "0.75rem 1rem",
                    borderBottom: "1px solid rgba(255,255,255,0.1)",
                    color: "var(--text-muted)",
                    fontWeight: "500",
                    fontSize: "0.875rem",
                    textAlign: "right"
                  }}>Price</th>
                  <th style={{ 
                    padding: "0.75rem 1rem",
                    borderBottom: "1px solid rgba(255,255,255,0.1)",
                    color: "var(--text-muted)",
                    fontWeight: "500",
                    fontSize: "0.875rem",
                    textAlign: "right"
                  }}>Value</th>
                  <th style={{ 
                    padding: "0.75rem 1rem",
                    borderBottom: "1px solid rgba(255,255,255,0.1)",
                    color: "var(--text-muted)",
                    fontWeight: "500",
                    fontSize: "0.875rem",
                    textAlign: "right"
                  }}>P&L</th>
                </tr>
              </thead>
              <tbody>
                {portfolioStocks.map((stock) => (
                  <tr key={stock.stockId}>
                    <td style={{ 
                      padding: "0.85rem 1rem",
                      borderBottom: "1px solid rgba(255,255,255,0.05)"
                    }}>
                      <div style={{ fontWeight: "600" }}>{stock.stockName}</div>
                    </td>
                    <td style={{ 
                      padding: "0.85rem 1rem",
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                      textAlign: "right"
                    }}>
                      {stock.totalQuantity.toLocaleString()}
                    </td>
                    <td style={{ 
                      padding: "0.85rem 1rem",
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                      textAlign: "right"
                    }}>
                      ${stock.currentPrice.toFixed(2)}
                    </td>
                    <td style={{ 
                      padding: "0.85rem 1rem",
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                      textAlign: "right",
                      fontWeight: "600"
                    }}>
                      ${(stock.currentPrice * stock.totalQuantity).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td style={{ 
                      padding: "0.85rem 1rem",
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                      textAlign: "right",
                      color: stock.status === "PROFIT" 
                        ? "var(--accent-green)" 
                        : stock.status === "LOSS" 
                          ? "#ef4444" 
                          : "var(--text-primary)",
                      fontWeight: "600"
                    }}>
                      {stock.status === "PROFIT" ? "+" : stock.status === "LOSS" ? "-" : ""}
                      ${Math.abs(stock.pnl).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Allocation Chart - Takes 2/5 of the space */}
        <div className="glass-panel lg:col-span-2">
          <h2 style={{ marginTop: "0", marginBottom: "1rem", fontSize: "1.25rem" }}>
            Allocation
          </h2>
          
          <div style={{ height: "350px" }}>
            <ResponsiveContainer width="100%" height="100%">
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
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={4}
                  fill="#8884d8"
                >
                  {portfolioStocks.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`$${value.toLocaleString("en-US", { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2
                  })}`, 'Invested Amount']}
                  contentStyle={{
                    background: "rgba(15, 23, 42, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "8px",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)"
                  }}
                />
                <Legend 
                  layout="vertical" 
                  verticalAlign="middle" 
                  align="right" 
                  wrapperStyle={{
                    fontSize: "0.75rem",
                    paddingLeft: "1rem"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "1fr 1fr", 
            gap: "0.5rem",
            marginTop: "1rem"
          }}>
            {portfolioStocks.map((stock, index) => (
              <div 
                key={stock.stockId}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.75rem"
                }}
              >
                <div style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: COLORS[index % COLORS.length]
                }}></div>
                <div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {stock.stockName}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Portfolio;