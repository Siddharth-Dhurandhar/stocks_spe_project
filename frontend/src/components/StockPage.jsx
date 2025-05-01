// src/StockPage.jsx

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

  useEffect(() => {
    // Mock stock data for demonstration. Replace with real data from an API if needed
    const stockData = {
      1: {
        name: "Apple Inc.",
        symbol: "AAPL",
        price: "$145",
        marketCap: "2.5T",
      },
      2: {
        name: "Tesla Inc.",
        symbol: "TSLA",
        price: "$650",
        marketCap: "700B",
      },
      3: {
        name: "Microsoft Corp.",
        symbol: "MSFT",
        price: "$290",
        marketCap: "2.3T",
      },
      4: { name: "Google", symbol: "GOOGL", price: "$2800", marketCap: "1.9T" },
      5: { name: "Amazon", symbol: "AMZN", price: "$3300", marketCap: "1.6T" },
    };

    // Set stock details based on the ID
    setStockDetails(stockData[id]);

    // Mock price movement data for demonstration (historical prices over the last 7 days)
    const historicalData = [
      { date: "2022-04-18", price: 145 },
      { date: "2022-04-19", price: 142 },
      { date: "2022-04-20", price: 148 },
      { date: "2022-04-21", price: 154 },
      { date: "2022-04-22", price: 153 },
      { date: "2022-04-23", price: 160 },
      { date: "2022-04-24", price: 165 },
      { date: "2022-04-25", price: 163 },
      { date: "2022-04-26", price: 168 },
      { date: "2022-04-27", price: 170 },
      { date: "2022-04-28", price: 167 },
      { date: "2022-04-29", price: 173 },
      { date: "2022-04-30", price: 175 },
      { date: "2022-05-01", price: 171 },
      { date: "2022-05-02", price: 178 },
      { date: "2022-05-03", price: 180 },
      { date: "2022-05-04", price: 185 },
      { date: "2022-05-05", price: 183 },
      { date: "2022-05-06", price: 188 },
      { date: "2022-05-07", price: 190 },
      { date: "2022-05-08", price: 187 },
    ];

    setPriceData(historicalData);
  }, [id]);

  return (
    <div className="p-4">
      {stockDetails ? (
        <div>
          <div>
            <h1 className="text-3xl">
              {stockDetails.name} ({stockDetails.symbol})
            </h1>
            <p className="">Price: {stockDetails.price}</p>
            <p className="">Market Cap: {stockDetails.marketCap}</p>
          </div>
          <div className="flex flex-row">
            <div className="w-2/3">
              <h2>Price Movement (Last 7 Days)</h2>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={priceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#2d3748",
                      color: "white",
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="price" stroke="#16A085" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="w-1/3 flex flex-col m-4 p-2">
              <input
                type="number"
                placeholder="Enter quantity"
                className="border p-2 rounded mb-2"
              />
              <div className="flex gap-2">
                <button className="bg-green-600 text-white px-4 py-2 rounded w-full">
                  Buy
                </button>
                <button className="bg-red-600 text-white px-4 py-2 rounded w-full">
                  Sell
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading stock details...</p>
      )}
    </div>
  );
};

export default StockPage;
