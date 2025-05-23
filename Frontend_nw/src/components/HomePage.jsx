import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { logout } from '../services/authService';
import { useUser } from '../context/UserContext';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [marketOverview, setMarketOverview] = useState([]);
  const [topStocks, setTopStocks] = useState([]);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Market trend data (mock data)
  const marketTrendData = [
    { name: '9AM', sp500: 4520, nasdaq: 14250, dow: 35100 },
    { name: '10AM', sp500: 4535, nasdaq: 14300, dow: 35150 },
    { name: '11AM', sp500: 4510, nasdaq: 14225, dow: 35050 },
    { name: '12PM', sp500: 4550, nasdaq: 14350, dow: 35200 },
    { name: '1PM', sp500: 4560, nasdaq: 14400, dow: 35250 },
    { name: '2PM', sp500: 4555, nasdaq: 14380, dow: 35220 },
    { name: '3PM', sp500: 4575, nasdaq: 14420, dow: 35300 },
  ];
  
  // Assets allocation data (mock data)
  const allocationData = [
    { name: 'Technology', value: 35 },
    { name: 'Finance', value: 20 },
    { name: 'Healthcare', value: 15 },
    { name: 'Consumer', value: 10 },
    { name: 'Energy', value: 8 },
    { name: 'Other', value: 12 }
  ];
  
  const COLORS = ["#22c55e", "#3b82f6", "#8b5cf6", "#ec4899", "#f97316", "#14b8a6"];
  
  // Market insights (mock data)
  const marketInsights = [
    {
      title: "Tech Sector Surges",
      description: "Technology stocks continue to outperform the broader market with AI leaders showing strong momentum.",
      trend: "up"
    },
    {
      title: "Fed Rate Decision",
      description: "The Federal Reserve announced plans to maintain current interest rates, providing stability to financial markets.",
      trend: "neutral"
    },
    {
      title: "Energy Sector Challenges",
      description: "Oil prices declined 3% amid concerns about global demand, impacting energy sector stocks.",
      trend: "down"
    }
  ];

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // Fetch top performing stocks
        const stocksResponse = await fetch(
          "/output_monitor/retrieve/allStockDetails"
        );
        
        if (!stocksResponse.ok) {
          throw new Error("Failed to fetch stock data");
        }
        
        const stocksData = await stocksResponse.json();
        
        // Sort by highest volatility and take top 4
        const sortedStocks = [...stocksData].sort((a, b) => b.volatility - a.volatility).slice(0, 4);
        setTopStocks(sortedStocks);
        
        // Set market overview (mock data)
        setMarketOverview([
          { name: "S&P 500", value: "4,573.25", change: "+0.87%", trend: "up" },
          { name: "NASDAQ", value: "14,389.12", change: "+1.15%", trend: "up" },
          { name: "DOW", value: "35,234.44", change: "+0.53%", trend: "up" },
          { name: "10Y YIELD", value: "3.92%", change: "-0.05%", trend: "down" }
        ]);
        
        // If user is logged in, fetch portfolio value
        if (user) {
          try {
            const portfolioResponse = await fetch(
              "/output_monitor/retrieve/portfolio",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: user }),
              }
            );
            
            if (portfolioResponse.ok) {
              const portfolioData = await portfolioResponse.json();
              const totalValue = portfolioData.reduce(
                (sum, stock) => sum + (stock.currentPrice * stock.totalQuantity),
                0
              );
              setPortfolioValue(totalValue);
            }
          } catch (error) {
            console.error("Error fetching portfolio:", error);
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchHomeData();
  }, [user]);
  
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
    <div style={{ margin: "1rem", overflow: "hidden" }}>
      {/* Floating Orbs Background */}
      <div className="floating-orbs">
        <div className="orb"></div>
        <div className="orb"></div>
        <div className="orb"></div>
        <div className="orb"></div>
      </div>
      
      {/* Hero Section */}
      <div className="glass-panel" style={{
        marginBottom: "1.5rem",
        background: "linear-gradient(135deg, rgba(30, 41, 59, 0.6), rgba(30, 58, 138, 0.4))",
        overflow: "hidden",
        position: "relative",
        padding: "2.5rem"
      }}>
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            maxWidth: "600px"
          }}>
            <h1 style={{
              fontSize: "2.5rem",
              marginBottom: "1rem",
              background: "linear-gradient(90deg, #22c55e, #3b82f6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              STOX
            </h1>
            <h2 style={{
              fontSize: "1.75rem",
              marginBottom: "1.5rem",
              color: "var(--text-primary)" // Added light color
            }}>
              A New Era of Stock Trading
            </h2>
            <p style={{
              fontSize: "1.125rem",
              color: "var(--text-secondary)",
              marginBottom: "2rem",
              lineHeight: "1.7"
            }}>
              Experience simplified, intuitive trading with advanced analytics and real-time market data. Build your portfolio with confidence.
            </p>
            <div style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap"
            }}>
              <Link to="/all" style={{ textDecoration: "none" }}>
                <button className="btn-primary" style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <polyline points="19 12 12 19 5 12"></polyline>
                  </svg>
                  Explore Markets
                </button>
              </Link>
              <Link to="/portfolio" style={{ textDecoration: "none" }}>
                <button style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: "white",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                  </svg>
                  View Portfolio
                </button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div style={{
          position: "absolute",
          right: "-5%",
          top: "50%",
          transform: "translateY(-50%)",
          width: "250px",
          height: "250px",
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(139, 92, 246, 0.1) 70%)",
          borderRadius: "50%",
          filter: "blur(60px)",
          zIndex: 0
        }}></div>
      </div>
      
      {/* Market Overview */}
      <div className="glass-panel" style={{
        marginBottom: "1.5rem",
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem"
        }}>
          <h2 style={{ margin: 0, fontSize: "1.25rem", color: "var(--text-primary)" }}>Market Overview</h2>
          <span style={{ 
            fontSize: "0.75rem", 
            color: "var(--text-muted)",
            background: "rgba(255, 255, 255, 0.05)",
            padding: "0.25rem 0.5rem",
            borderRadius: "4px"
          }}>
            Live
            <span style={{ 
              display: "inline-block", 
              width: "6px", 
              height: "6px", 
              background: "var(--accent-green)", 
              borderRadius: "50%", 
              marginLeft: "0.5rem",
              animation: "pulse 2s infinite"
            }}></span>
          </span>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4" style={{ gap: "1rem" }}>
          {marketOverview.map((item, index) => (
            <div key={index} style={{
              background: "rgba(255, 255, 255, 0.05)",
              borderRadius: "12px",
              padding: "1rem"
            }}>
              <div style={{ 
                fontSize: "0.75rem", 
                color: "var(--text-muted)",
                marginBottom: "0.5rem"
              }}>
                {item.name}
              </div>
              <div style={{ 
                fontSize: "1.25rem", 
                fontWeight: "700",
                marginBottom: "0.25rem"
              }}>
                {item.value}
              </div>
              <div style={{ 
                fontSize: "0.875rem",
                color: item.trend === "up" ? "var(--accent-green)" : item.trend === "down" ? "#ef4444" : "var(--text-muted)",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem"
              }}>
                {item.trend === "up" ? "▲" : item.trend === "down" ? "▼" : "•"} {item.change}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Two column layout for dashboard and insights */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: "1.5rem",
        marginBottom: "1.5rem"
      }}>
        {/* Market Trend Chart */}
        <div className="glass-panel">
          <h2 style={{ margin: "0 0 1rem 0", fontSize: "1.25rem", color: "var(--text-primary)" }}>Market Trends</h2>
          <div style={{ height: "300px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={marketTrendData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorSp500" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorNasdaq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorDow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: 'var(--text-muted)' }} 
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fill: 'var(--text-muted)' }} 
                  axisLine={false}
                  tickLine={false}
                  domain={['dataMin - 100', 'dataMax + 100']}
                />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                <Tooltip 
                  contentStyle={{
                    background: "rgba(15, 23, 42, 0.9)",
                    border: "1px solid var(--glass-border)",
                    borderRadius: "8px"
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="sp500" 
                  stroke="#3b82f6" 
                  fillOpacity={1} 
                  fill="url(#colorSp500)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="nasdaq" 
                  stroke="#8b5cf6" 
                  fillOpacity={1} 
                  fill="url(#colorNasdaq)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="dow" 
                  stroke="#22c55e" 
                  fillOpacity={1} 
                  fill="url(#colorDow)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            gap: "2rem", 
            marginTop: "1rem" 
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ width: "12px", height: "12px", background: "#3b82f6", borderRadius: "2px" }}></div>
              <span style={{ fontSize: "0.875rem" }}>S&P 500</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ width: "12px", height: "12px", background: "#8b5cf6", borderRadius: "2px" }}></div>
              <span style={{ fontSize: "0.875rem" }}>NASDAQ</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ width: "12px", height: "12px", background: "#22c55e", borderRadius: "2px" }}></div>
              <span style={{ fontSize: "0.875rem" }}>DOW</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Two column layout for trading features */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: "1.5rem",
        marginBottom: "1.5rem"
      }}>
        {/* Top performers section */}
        <div className="glass-panel">
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem"
          }}>
            <h2 style={{ margin: 0, fontSize: "1.25rem", color: "var(--text-primary)" }}>Top Performers</h2>
            <Link to="/all" style={{ 
              textDecoration: "none", 
              color: "var(--accent-blue)",
              fontSize: "0.875rem",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem"
            }}>
              View All
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </Link>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4" style={{ gap: "1rem" }}>
            {topStocks.map((stock) => (
              <Link
                to={`/stock/${stock.stockId}`}
                key={stock.stockId}
                style={{ textDecoration: "none" }}
              >
                <div style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  borderRadius: "12px",
                  padding: "1rem",
                  transition: "all 0.3s ease",
                  border: "1px solid rgba(255,255,255,0.05)",
                  position: "relative",
                  overflow: "hidden"
                }}>
                  <div style={{ marginBottom: "0.75rem" }}>
                    <h3 style={{ 
                      fontSize: "1rem", 
                      margin: "0 0 0.25rem 0",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      color: "var(--text-primary)"
                    }}>
                      {stock.stockName}
                    </h3>
                    <div style={{ 
                      fontSize: "0.75rem", 
                      color: "var(--text-muted)"
                    }}>
                      {stock.stockSymbol}
                    </div>
                  </div>
                  
                  <div style={{ 
                    fontSize: "1.25rem", 
                    fontWeight: "700",
                    color: "var(--accent-green)"
                  }}>
                    ${stock.initialPrice.toFixed(2)}
                  </div>
                  
                  <div style={{ 
                    fontSize: "0.75rem", 
                    color: "var(--accent-green)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem"
                  }}>
                    ▲ {stock.volatility}%
                  </div>
                  
                  {/* Bottom accent line */}
                  <div style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    height: "3px",
                    width: "100%",
                    background: "linear-gradient(90deg, var(--accent-blue), var(--accent-green))"
                  }}></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      {/* Feature highlights */}
      <div className="glass-panel" style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ margin: "0 0 1.5rem 0", fontSize: "1.25rem", textAlign: "center", color: "var(--text-primary)" }}>
          Why Choose STOX
        </h2>
        
        <div className="grid sm:grid-cols-2 md:grid-cols-3" style={{ gap: "1.5rem" }}>
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            padding: "1rem"
          }}>
            <div style={{
              width: "50px",
              height: "50px",
              borderRadius: "12px",
              background: "rgba(59, 130, 246, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1rem"
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <h3 style={{ fontSize: "1.125rem", margin: "0 0 0.5rem 0", color: "var(--text-primary)" }}>Real-Time Data</h3>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", margin: 0 }}>
              Access live market data and insights to make informed trading decisions
            </p>
          </div>
          
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            padding: "1rem"
          }}>
            <div style={{
              width: "50px",
              height: "50px",
              borderRadius: "12px",
              background: "rgba(34, 197, 94, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1rem"
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
            <h3 style={{ fontSize: "1.125rem", margin: "0 0 0.5rem 0", color: "var(--text-primary)" }}>Zero Commission</h3>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", margin: 0 }}>
              Trade stocks with no commission fees and maximize your returns
            </p>
          </div>
          
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            padding: "1rem"
          }}>
            <div style={{
              width: "50px",
              height: "50px",
              borderRadius: "12px",
              background: "rgba(139, 92, 246, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1rem"
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-purple)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
                <path d="M8 14h.01"></path>
                <path d="M12 14h.01"></path>
                <path d="M16 14h.01"></path>
                <path d="M8 18h.01"></path>
                <path d="M12 18h.01"></path>
                <path d="M16 18h.01"></path>
              </svg>
            </div>
            <h3 style={{ fontSize: "1.125rem", margin: "0 0 0.5rem 0", color: "var(--text-primary)" }}>Advanced Analytics</h3>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", margin: 0 }}>
              Track performance with powerful metrics and visualization tools
            </p>
          </div>
        </div>
      </div>
      
      {/* Market Insights */}
      <div className="glass-panel">
        <h2 style={{ margin: "0 0 1rem 0", fontSize: "1.25rem", color: "var(--text-primary)" }}>Market Insights</h2>
        
        <div style={{
          display: "grid",
          gap: "1rem"
        }}>
          {marketInsights.map((insight, index) => (
            <div key={index} style={{
              padding: "1rem",
              background: "rgba(255,255,255,0.05)",
              borderRadius: "12px",
              display: "flex",
              gap: "1rem",
              alignItems: "flex-start"
            }}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                background: insight.trend === "up" 
                  ? "rgba(34, 197, 94, 0.2)" 
                  : insight.trend === "down" 
                    ? "rgba(239, 68, 68, 0.2)" 
                    : "rgba(59, 130, 246, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}>
                {insight.trend === "up" ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="19" x2="12" y2="5"></line>
                    <polyline points="5 12 12 5 19 12"></polyline>
                  </svg>
                ) : insight.trend === "down" ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <polyline points="19 12 12 19 5 12"></polyline>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                )}
              </div>
              
              <div>
                <h3 style={{ 
                  fontSize: "1rem", 
                  fontWeight: "600",
                  margin: "0 0 0.35rem 0",
                  color: "var(--text-primary)"
                }}>
                  {insight.title}
                </h3>
                <p style={{ 
                  fontSize: "0.875rem", 
                  color: "var(--text-secondary)",
                  margin: 0,
                  lineHeight: "1.5"
                }}>
                  {insight.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @media (min-width: 1024px) {
          div[style*="gridTemplateColumns: 1fr"] {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;