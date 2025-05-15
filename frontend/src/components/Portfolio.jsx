import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Portfolio = () => {
  const [portfolioStocks, setPortfolioStocks] = useState([]);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [portfolioGain, setPortfolioGain] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const mockPortfolio = [
      {
        id: 1,
        name: "Apple Inc.",
        symbol: "AAPL",
        price: 175.23,
        change: 1.25,
        invested: 5000,
        quantity: 28.5,
        currentValue: 4994.06,
      },
      {
        id: 2,
        name: "Tesla Inc.",
        symbol: "TSLA",
        price: 245.67,
        change: -0.85,
        invested: 3000,
        quantity: 12.2,
        currentValue: 2997.17,
      },
      {
        id: 3,
        name: "Microsoft Corp.",
        symbol: "MSFT",
        price: 310.45,
        change: 2.15,
        invested: 2000,
        quantity: 6.4,
        currentValue: 1986.88,
      },
      {
        id: 4,
        name: "Google",
        symbol: "GOOGL",
        price: 2800.12,
        change: -1.45,
        invested: 1000,
        quantity: 0.36,
        currentValue: 1008.04,
      },
    ];

    const totalValue = mockPortfolio.reduce(
      (sum, stock) => sum + stock.currentValue,
      0
    );
    const totalInvested = mockPortfolio.reduce(
      (sum, stock) => sum + stock.invested,
      0
    );
    const totalGain = ((totalValue - totalInvested) / totalInvested) * 100;

    setPortfolioStocks(mockPortfolio);
    setPortfolioValue(totalValue);
    setPortfolioGain(totalGain);

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  //   const staticChartData = [
  //     { name: "Apple Inc.", value: 50 },
  //     { name: "Tesla Inc.", value: 30 },
  //     { name: "Microsoft Corp.", value: 15 },
  //     { name: "Google", value: 5 },
  //   ];

  // useEffect(() => {
  //   const fetchPortfolioData = async () => {
  //     try {
  //       const response = await fetch("http://localhost:8080/api/portfolio"); // Replace with your backend API endpoint
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch portfolio data");
  //       }
  //       const data = await response.json();

  //       // Calculate total portfolio value and gain/loss
  //       const totalValue = data.reduce(
  //         (sum, stock) => sum + stock.currentValue,
  //         0
  //       );
  //       const totalInvested = data.reduce(
  //         (sum, stock) => sum + stock.invested,
  //         0
  //       );
  //       const totalGain = ((totalValue - totalInvested) / totalInvested) * 100;

  //       setPortfolioStocks(data);
  //       setPortfolioValue(totalValue);
  //       setPortfolioGain(totalGain);
  //     } catch (error) {
  //       console.error("Error fetching portfolio data:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchPortfolioData();
  // }, []);

  const COLORS = ["#22c55e", "#ef4444", "#3b82f6", "#facc15"];

  if (isLoading) {
    return (
      <div className="bg-gradient-to-b from-black via-gray-900 to-black min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-green-500 border-b-green-500 mx-auto mb-6 shadow-lg"></div>
          <p className="text-lg font-semibold text-gray-400 tracking-wide">
            Loading portfolio data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-black via-gray-900 to-black min-h-screen text-gray-100 font-sans selection:bg-green-600 selection:text-gray-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900 to-black p-10 shadow-2xl border-b border-green-700/40">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-extrabold text-center tracking-wide text-green-400 drop-shadow-md">
            My Portfolio
          </h1>

          {/* Summary Cards */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                label: "Portfolio Value",
                value: `$${portfolioValue.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`,
                color: "text-green-400",
              },
              {
                label: "Total Return",
                value:
                  portfolioGain >= 0
                    ? `+${portfolioGain.toFixed(2)}%`
                    : `${portfolioGain.toFixed(2)}%`,
                color: portfolioGain >= 0 ? "text-green-400" : "text-red-400",
              },
              {
                label: "Holdings",
                value: portfolioStocks.length,
                color: "text-gray-100",
              },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className="bg-gray-900 bg-opacity-60 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-green-700/30 hover:scale-[1.03] transform transition-transform duration-300 cursor-default"
              >
                <h3 className="text-xs font-semibold uppercase text-green-300 tracking-widest">
                  {label}
                </h3>
                <p
                  className={`mt-3 text-4xl font-extrabold tracking-tight ${color} select-text`}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Main Section */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Portfolio List */}
          <section className="flex-1 bg-black bg-opacity-70 backdrop-blur-sm rounded-3xl shadow-[0_0_30px_2px_rgba(34,197,94,0.6)] border border-green-700/40 overflow-hidden">
            <header className="p-8 border-b border-green-700/50">
              <h2 className="text-3xl font-semibold tracking-wide text-green-400 drop-shadow-md">
                Stocks in Portfolio
              </h2>
            </header>

            <div className="grid grid-cols-5 bg-black bg-opacity-50 text-green-300 font-semibold text-sm px-8 py-4 tracking-wide select-none">
              <div className="col-span-2">Stock</div>
              <div className="text-right">Current Price</div>
              <div className="text-right">Value</div>
              <div className="text-right">Change</div>
            </div>

            <ul className="divide-y divide-green-700/50">
              {portfolioStocks.map((stock) => (
                <li
                  key={stock.id}
                  className="grid grid-cols-5 items-center px-8 py-5 hover:bg-green-900/20 transition-colors duration-300 cursor-default"
                >
                  <div className="col-span-2">
                    <h3 className="text-xl font-semibold text-green-300 select-text">
                      {stock.name}
                    </h3>
                    <div className="flex items-center space-x-3 mt-1 text-sm text-green-400">
                      <span className="tracking-wide">{stock.symbol}</span>
                      <span className="bg-green-800 bg-opacity-60 rounded-full px-4 py-1 font-mono text-xs select-text">
                        {stock.quantity} shares
                      </span>
                    </div>
                  </div>

                  <div className="text-right text-green-200 font-medium select-text">
                    ${stock.price.toFixed(2)}
                  </div>

                  <div className="text-right text-green-300 font-semibold select-text">
                    ${stock.currentValue.toFixed(2)}
                  </div>

                  <div className="text-right flex items-center justify-end font-semibold select-text">
                    <span
                      className={`flex items-center space-x-2 text-lg ${
                        stock.change >= 0 ? "text-green-400" : "text-red-500"
                      }`}
                      aria-label={stock.change >= 0 ? "Gain" : "Loss"}
                    >
                      {stock.change >= 0 ? (
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 15l7-7 7 7"
                          ></path>
                        </svg>
                      ) : (
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 9l-7 7-7-7"
                          ></path>
                        </svg>
                      )}
                      <span className="text-lg font-bold">
                        {Math.abs(stock.change)}%
                      </span>
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Investment Breakdown Chart */}
          <section
            className="w-full lg:w-2/5 bg-black bg-opacity-60 backdrop-blur-md rounded-3xl shadow-[0_0_20px_1px_rgba(34,197,94,0.3)] border border-green-700/30 overflow-hidden flex flex-col"
            style={{ minWidth: 380, maxWidth: 520 }}
          >
            <header className="p-8 border-b border-green-700/30 flex justify-between items-center">
              <h2 className="text-3xl font-semibold tracking-wide text-green-400 drop-shadow-md">
                Investment Breakdown
              </h2>
            </header>

            <div className="flex-grow p-8">
              <ResponsiveContainer width="100%" height={450}>
                <PieChart>
                  <Pie
                    data={portfolioStocks.map((stock) => ({
                      name: stock.name,
                      value: stock.currentValue,
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
                    formatter={(value) => [`$${value.toFixed(2)}`, "Value"]}
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
                      color: "#bbf7d0",
                      fontSize: "14px",
                      paddingLeft: "16px",
                      fontWeight: "600",
                      letterSpacing: "0.03em",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <footer className="p-8 bg-green-900 bg-opacity-20 border-t border-green-700/30 rounded-b-3xl select-text">
              <h3 className="text-xl font-semibold mb-2 text-green-300">
                Portfolio Diversity
              </h3>
              <p className="text-green-200 text-base leading-relaxed max-w-xs">
                Your investment is distributed across{" "}
                <span className="font-semibold">{portfolioStocks.length}</span>{" "}
                different stocks.
              </p>
            </footer>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Portfolio;
