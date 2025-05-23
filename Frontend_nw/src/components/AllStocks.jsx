import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AllStocks = () => {
  const [stocks, setStocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await fetch(
          "/output_monitor/retrieve/allStockDetails"
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

  const filteredStocks = stocks.filter(stock => 
    stock.stockName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    stock.stockSymbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <div style={{
      margin: "1rem",
      overflow: "hidden" 
    }}>
      {/* Floating Orbs Background */}
      <div className="floating-orbs">
        <div className="orb"></div>
        <div className="orb"></div>
        <div className="orb"></div>
      </div>
      
      {/* Header Section */}
      <div className="glass-panel" style={{
        marginBottom: "1.5rem",
        position: "relative",
        zIndex: 1
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem"
        }}>
          <div>
            <h1 style={{
              fontSize: "1.75rem",
              margin: 0
            }}>Markets</h1>
            <p style={{ 
              color: "var(--text-secondary)",
              margin: "0.25rem 0 0 0" 
            }}>
              Discover and track stocks in real-time
            </p>
          </div>
          <div style={{
            position: "relative",
            width: "100%",
            maxWidth: "320px"
          }}>
            <input
              type="text"
              placeholder="Search stocks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem 1rem 0.75rem 2.5rem",
                background: "rgba(15, 23, 42, 0.6)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "8px",
                color: "var(--text-primary)",
                fontSize: "0.875rem"
              }}
            />
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              style={{
                position: "absolute",
                left: "0.75rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)"
              }}
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Stocks Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3" style={{
        gap: "1rem"
      }}>
        {filteredStocks.map((stock) => (
          <Link
            to={`/stock/${stock.stockId}`}
            key={stock.stockId}
            style={{ textDecoration: "none" }}
          >
            <div className="glass-panel" style={{
              cursor: "pointer",
              transition: "all 0.3s ease",
              overflow: "hidden",
              position: "relative"
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <div>
                  <h3 style={{ 
                    fontSize: "1.25rem", 
                    margin: "0 0 0.25rem 0" 
                  }}>
                    {stock.stockName}
                  </h3>
                  <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "0.5rem" 
                  }}>
                    <span style={{ 
                      display: "inline-block",
                      padding: "0.25rem 0.5rem",
                      background: "rgba(59, 130, 246, 0.2)",
                      color: "var(--accent-blue)",
                      borderRadius: "4px",
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      letterSpacing: "0.05em"
                    }}>
                      {stock.stockSymbol}
                    </span>
                    <span style={{ 
                      color: "var(--text-muted)",
                      fontSize: "0.75rem"
                    }}>
                      {stock.stockExchange}
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ 
                    fontSize: "1.25rem",
                    fontWeight: "700",
                    color: stock.volatility > 2 ? "var(--accent-green)" : stock.volatility > 1 ? "var(--accent-orange)" : "var(--text-primary)"
                  }}>
                    ${stock.initialPrice.toFixed(2)}
                  </div>
                  <div style={{ 
                    fontSize: "0.75rem",
                    color: "var(--text-muted)"
                  }}>
                    Volatility: <span style={{ 
                      color: stock.volatility > 2 ? "var(--accent-green)" : stock.volatility > 1 ? "var(--accent-orange)" : "var(--text-primary)",
                    }}>{stock.volatility}%</span>
                  </div>
                </div>
              </div>
              
              {/* Decorative bar to indicate volatility */}
              <div style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                height: "3px",
                width: `${Math.min(stock.volatility * 30, 100)}%`,
                background: stock.volatility > 2 
                  ? "linear-gradient(90deg, var(--accent-blue), var(--accent-green))" 
                  : stock.volatility > 1 
                    ? "linear-gradient(90deg, var(--accent-orange), var(--accent-pink))" 
                    : "linear-gradient(90deg, var(--accent-blue), var(--accent-purple))",
                borderRadius: "0 3px 3px 0"
              }}></div>
            </div>
          </Link>
        ))}
      </div>
      
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AllStocks;