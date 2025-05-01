// src/HomePage.jsx

import React from "react";
import { Link } from "react-router-dom";

// header saare page pe: app ka naam, 3 links: homepage, portfolio, avatar(isme hi settings)
// current price, cp ke just neeche kitna % up/down change,
const HomePage = () => {
  // Mock stock data
  const stocks = [
    { id: 1, name: "Apple Inc.", symbol: "AAPL", price: 175.23, change: 1.25 },
    { id: 2, name: "Tesla Inc.", symbol: "TSLA", price: 245.67, change: -0.85 },
    {
      id: 3,
      name: "Microsoft Corp.",
      symbol: "MSFT",
      price: 310.45,
      change: 2.15,
    },
    { id: 4, name: "Google", symbol: "GOOGL", price: 2800.12, change: -1.45 },
    { id: 5, name: "Amazon", symbol: "AMZN", price: 3450.89, change: 0.75 },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1>Stocks List</h1>
      <ul>
        {stocks.map((stock) => (
          <li
            key={stock.id}
            // style={{
            //   margin: "10px 0",
            // }}
            className="m-1 p-2 border-2 border-gray-700 rounded-sm"
          >
            <Link
              to={`/stock/${stock.id}`}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div className="text-white font-bold">
                {stock.name} ({stock.symbol})
              </div>
              <div className="flex flex-col">
                <div>${stock.price}</div>
                <div
                  className={`${
                    stock.change >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {stock.change >= 0 ? `+${stock.change}%` : `${stock.change}%`}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

// const HomePage = () => {
//   return (
//     <div>
//       <h1>Welcome to the Home Page</h1>
//       <p>This is the homepage of your app.</p>
//     </div>
//   );
// };

export default HomePage;
