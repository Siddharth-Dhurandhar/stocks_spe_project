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
} from "recharts";

const StockPage = () => {
  const { id } = useParams(); // Access the stock ID from the URL
  const [stockDetails, setStockDetails] = useState(null);
  const [priceData, setPriceData] = useState([]);
  const [quantity, setQuantity] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  // mock data
  useEffect(() => {
    const mockStockDetails = {
      1: {
        name: "Apple Inc.",
        symbol: "AAPL",
        price: 145,
        marketCap: "2.5T",
      },
      2: {
        name: "Tesla Inc.",
        symbol: "TSLA",
        price: 650,
        marketCap: "700B",
      },
      3: {
        name: "Microsoft Corp.",
        symbol: "MSFT",
        price: 290,
        marketCap: "2.3T",
      },
      4: { name: "Google", symbol: "GOOGL", price: 2800, marketCap: "1.9T" },
      5: { name: "Amazon", symbol: "AMZN", price: 3300, marketCap: "1.6T" },
    };

    const mockHistoricalData = [
      { date: "2022-04-18", price: 145 },
      { date: "2022-04-19", price: 142 },
      { date: "2022-04-20", price: 148 },
      { date: "2022-04-21", price: 154 },
      { date: "2022-04-22", price: 153 },
      { date: "2022-04-23", price: 160 },
      { date: "2022-04-24", price: 165 },
    ];

    setStockDetails(mockStockDetails[id]);
    setPriceData(mockHistoricalData);
  }, [id]);

  // actual data fetch
  useEffect(() => {
    const fetchStockDetails = async () => {
      try {
        // Fetch stock details
        const stockResponse = await fetch(`http://localhost:8080/base/${id}`); // Replace with your backend URL
        if (!stockResponse.ok) {
          throw new Error("Failed to fetch stock details");
        }
        const stockData = await stockResponse.json();
        setStockDetails(stockData);

        // Fetch historical data
        const historicalResponse = await fetch(
          `http://localhost:8080/base/${id}/historical`
        ); // Replace with your backend URL
        if (!historicalResponse.ok) {
          throw new Error("Failed to fetch historical data");
        }
        const historicalData = await historicalResponse.json();
        setPriceData(historicalData);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };

    // Fetch data every 0.5 seconds
    const intervalId = setInterval(fetchStockDetails, 500);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
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
      setTotalPrice((value * stockDetails.price).toFixed(2));
    }
  };

  const handleBuy = async () => {
    if (quantity <= 0) {
      setErrorMessage("Invalid amount. Quantity must be greater than zero.");
      return;
    }

    const requestBody = {
      stockId: id,
      stockName: stockDetails.name,
      stockSymbol: stockDetails.symbol,
      quantity: parseInt(quantity, 10),
      totalPrice: parseFloat(totalPrice),
    };

    try {
      const response = await fetch("http://localhost:8080/api/buyStock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        alert("Stock purchased successfully!");
        setQuantity("");
        setTotalPrice(0);
      } else {
        alert("Failed to purchase stock. Please try again.");
      }
    } catch (error) {
      console.error("Error purchasing stock:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  const handleSell = async () => {
    if (quantity <= 0) {
      setErrorMessage("Invalid amount. Quantity must be greater than zero.");
      return;
    }

    const requestBody = {
      stockId: id,
      stockName: stockDetails.name,
      stockSymbol: stockDetails.symbol,
      quantity: parseInt(quantity, 10),
    };

    try {
      const response = await fetch("http://localhost:8080/api/sellStock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        alert("Stock sold successfully!");
        setQuantity("");
        setTotalPrice(0);
      } else {
        alert("Failed to sell stock. Please try again.");
      }
    } catch (error) {
      console.error("Error selling stock:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="bg-gradient-to-b from-black via-gray-900 to-black min-h-screen text-gray-100 font-sans selection:bg-green-600 selection:text-gray-900">
      <main className="max-w-7xl mx-auto px-6 py-16">
        {stockDetails ? (
          <>
            {/* Stock Details */}
            <div className="bg-black bg-opacity-70 backdrop-blur-sm rounded-3xl shadow-[0_0_30px_2px_rgba(34,197,94,0.6)] border border-green-700/40 p-8 mb-10">
              <h2 className="text-4xl font-extrabold mb-4 text-green-400 drop-shadow-md tracking-wide select-text">
                {stockDetails.name}{" "}
                <span className="text-green-500 font-mono text-2xl select-text">
                  ({stockDetails.symbol})
                </span>
              </h2>
              <p className="text-lg text-green-300 mb-2 select-text">
                <span className="font-semibold">Price:</span> $
                {stockDetails.price}
              </p>
              <p className="text-lg text-green-300 select-text">
                <span className="font-semibold">Market Cap:</span>{" "}
                {stockDetails.marketCap}
              </p>
            </div>

            {/* Chart and Actions */}
            <div className="flex flex-col lg:flex-row gap-10">
              {/* Price Movement Chart */}
              <div className="bg-black bg-opacity-70 backdrop-blur-md rounded-3xl shadow-[0_0_30px_2px_rgba(34,197,94,0.6)] border border-green-700/40 w-full lg:w-2/3 p-8">
                <h3 className="text-3xl font-semibold mb-6 text-green-400 drop-shadow-md tracking-wide">
                  Price Movement (Last 7 Days)
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={priceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#264653" />
                    <XAxis dataKey="date" stroke="#a7f3d0" />
                    <YAxis stroke="#a7f3d0" />
                    <Tooltip
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
                      wrapperStyle={{ color: "#bbf7d0", fontSize: "14px" }}
                      iconType="circle"
                    />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#22c55e"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Buy/Sell Actions */}
              <div className="bg-black bg-opacity-70 backdrop-blur-md rounded-3xl shadow-[0_0_30px_2px_rgba(34,197,94,0.6)] border border-green-700/40 w-full lg:w-1/3 p-8 flex flex-col justify-start">
                <h3 className="text-3xl font-semibold mb-6 text-green-400 drop-shadow-md tracking-wide">
                  Trade Actions
                </h3>
                <input
                  type="number"
                  placeholder="Enter quantity"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="border border-green-700 bg-black bg-opacity-50 text-green-200 p-3 rounded-lg mb-2 placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                />
                {errorMessage && (
                  <p className="text-red-500 text-sm mb-2">{errorMessage}</p>
                )}
                {quantity > 0 && (
                  <p className="text-green-300 text-sm mb-4">
                    Total Price: ${totalPrice}
                  </p>
                )}
                <div className="flex gap-4">
                  <button
                    onClick={handleBuy}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
                  >
                    Buy
                  </button>
                  <button
                    onClick={handleSell}
                    className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
                  >
                    Sell
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <p className="text-center text-lg text-green-400">
            Loading stock details...
          </p>
        )}
      </main>
    </div>
  );
};

export default StockPage;
