///////////////////////////////////
// FETCH CODE COMMENT
///////////////////////////////////

// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";

// const HomePage = () => {
//   const [stocks, setStocks] = useState([]);
//   const [isLoading, setIsLoading] = useState(true); // Loading state

//   // mock data
//   // useEffect(() => {
//   //   const mockStocks = [
//   //     {
//   //       id: 1,
//   //       name: "Apple Inc.",
//   //       symbol: "AAPL",
//   //       price: 175.23,
//   //       change: 1.25,
//   //     },
//   //     {
//   //       id: 2,
//   //       name: "Tesla Inc.",
//   //       symbol: "TSLA",
//   //       price: 245.67,
//   //       change: -0.85,
//   //     },
//   //     {
//   //       id: 3,
//   //       name: "Microsoft Corp.",
//   //       symbol: "MSFT",
//   //       price: 310.45,
//   //       change: 2.15,
//   //     },
//   //     { id: 4, name: "Google", symbol: "GOOGL", price: 2800.12, change: -1.45 },
//   //     { id: 5, name: "Amazon", symbol: "AMZN", price: 3450.89, change: 0.75 },
//   //   ];

//   //   // Simulate a delay to mimic API call
//   //   setTimeout(() => {
//   //     setStocks(mockStocks);
//   //     setIsLoading(false); // Set loading to false after data is fetched
//   //   }, 1000);
//   // }, []);

//   // actual fetching every 0.5 seconds
//   useEffect(() => {
//     const fetchStockData = async () => {
//       try {
//         const response = await fetch(
//           "http://localhost:8085/output_monitor/retrieve/allStockDetails"
//         ); // Replace with your backend URL
//         if (!response.ok) {
//           throw new Error("Failed to fetch stock data");
//         }
//         const data = await response.json();
//         setStocks(data);
//         setIsLoading(false); // Set loading to false after the first fetch
//       } catch (error) {
//         console.error("Error fetching stock data:", error);
//       }
//     };

//     console.log(fetchStockData);

//     // Fetch data every 0.5 seconds
//     const intervalId = setInterval(fetchStockData, 500);

//     // Cleanup interval on component unmount
//     return () => clearInterval(intervalId);
//   }, []);

//   if (isLoading) {
//     return (
//       <div className="bg-gradient-to-b from-black via-gray-900 to-black min-h-screen flex items-center justify-center text-gray-100 font-sans selection:bg-green-600 selection:text-gray-900">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500 mx-auto mb-6"></div>
//           <p className="text-lg font-semibold text-gray-400 tracking-wide">
//             Loading stocks...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gradient-to-b from-black via-gray-900 to-black min-h-screen text-gray-100 font-sans selection:bg-green-600 selection:text-gray-900">
//       <main className="max-w-7xl mx-auto px-6 py-16">
//         <h2 className="text-4xl font-extrabold mb-12 text-green-400 drop-shadow-md tracking-wide">
//           Stocks List
//         </h2>

//         <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
//           {stocks.map((stock) => (
//             <li
//               key={stock.id}
//               className="bg-black bg-opacity-70 backdrop-blur-sm rounded-3xl shadow-[0_0_30px_2px_rgba(34,197,94,0.6)] border border-green-700/40 hover:shadow-[0_0_40px_4px_rgba(34,197,94,0.8)] transition-shadow duration-300 cursor-pointer"
//             >
//               <Link to={`/stock/${stock.id}`} className="block p-8">
//                 <div className="flex justify-between items-center">
//                   <h3 className="text-2xl font-semibold text-green-300 tracking-wide select-text">
//                     {stock.name}{" "}
//                     <span className="text-green-500 font-mono text-base ml-2">
//                       ({stock.symbol})
//                     </span>
//                   </h3>
//                   <div
//                     className={`text-xl font-bold select-text ${
//                       stock.change >= 0 ? "text-green-400" : "text-red-500"
//                     } flex items-center space-x-1`}
//                     aria-label={stock.change >= 0 ? "Gain" : "Loss"}
//                   >
//                     {stock.change >= 0 ? (
//                       <svg
//                         className="w-5 h-5"
//                         fill="none"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                         viewBox="0 0 24 24"
//                         xmlns="http://www.w3.org/2000/svg"
//                         aria-hidden="true"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           d="M5 15l7-7 7 7"
//                         ></path>
//                       </svg>
//                     ) : (
//                       <svg
//                         className="w-5 h-5"
//                         fill="none"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                         viewBox="0 0 24 24"
//                         xmlns="http://www.w3.org/2000/svg"
//                         aria-hidden="true"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           d="M19 9l-7 7-7-7"
//                         ></path>
//                       </svg>
//                     )}
//                     <span>{Math.abs(stock.change)}%</span>
//                   </div>
//                 </div>
//                 <p className="text-lg text-green-200 mt-4 select-text">
//                   Price:{" "}
//                   <span className="font-semibold">
//                     ${stock.price.toFixed(2)}
//                   </span>
//                 </p>
//               </Link>
//             </li>
//           ))}
//         </ul>
//       </main>
//     </div>
//   );
// };

// export default HomePage;

///////////////////////////////////
// FETCH CODE COMMENT END
///////////////////////////////////

import React, { useEffect, useState } from "react";

const HomePage = () => {
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
      <div>
        <p>Loading stocks...</p>
      </div>
    );
  }

  return (
    <div>
      <main>
        <h1>Stocks List</h1>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {stocks.map((stock) => (
            <li
              key={stock.stockId}
              style={{
                border: "1px solid black",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              <h2>
                {stock.stockName} ({stock.stockSymbol})
              </h2>
              <p>
                Exchange: <strong>{stock.stockExchange}</strong>
              </p>
              <p>
                Sector: <strong>{stock.stockSector}</strong>
              </p>
              <p>
                Initial Price: <strong>${stock.initialPrice}</strong>
              </p>
              <p>
                Volatility: <strong>{stock.volatility}%</strong>
              </p>
              <p>{stock.stockDescription}</p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default HomePage;
