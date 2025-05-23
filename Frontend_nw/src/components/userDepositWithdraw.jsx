// import React, { useState, useEffect } from "react";
// import { useUser } from "../context/UserContext"; // Assuming you have a UserContext
// import "./userDepositWithdraw.css"; // You'll need to create this CSS file

// const UserDepositWithdraw = () => {
//   const { user } = useUser();
//   const [amount, setAmount] = useState("");
//   const [balance, setBalance] = useState(0);
//   const [isLoading, setIsLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [transactionType, setTransactionType] = useState("deposit"); // 'deposit' or 'withdraw'

//   // Fetch current balance when component mounts
//   useEffect(() => {
//     const fetchBalance = async () => {
//       if (!user) return;
//       console.log(user);

//       setIsLoading(true);
//       try {
//         const response = await fetch(
//           `http://localhost:8085/output_monitor/retrieve/balance`,
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               userId: user,
//             }),
//           }
//         );

//         if (!response.ok) {
//           throw new Error("Failed to fetch wallet balance");
//         }

//         const data = await response.json();
//         setBalance(Number(data));
//         console.log("API data:", data);
//       } catch (error) {
//         console.error("Error fetching balance:", error);
//         setErrorMessage(
//           "Unable to load your current balance. Please try again later."
//         );
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchBalance();
//   }, [user]);

//   const handleAmountChange = (e) => {
//     const value = e.target.value;
//     // Only allow numbers and decimals
//     if (value === "" || /^\d+(\.\d{0,2})?$/.test(value)) {
//       setAmount(value);
//       setErrorMessage("");
//     }
//   };

//   const handleTransactionTypeChange = (type) => {
//     setTransactionType(type);
//     setErrorMessage("");
//     setSuccessMessage("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validate input
//     if (!amount || parseFloat(amount) <= 0) {
//       setErrorMessage("Please enter a valid amount greater than zero.");
//       return;
//     }

//     // For withdraw, check if sufficient balance
//     if (transactionType === "withdraw" && parseFloat(amount) > balance) {
//       setErrorMessage("Insufficient funds. Please enter a smaller amount.");
//       return;
//     }

//     setIsLoading(true);
//     setErrorMessage("");
//     setSuccessMessage("");

//     try {
//       const endpoint = `http://localhost:8085/user_activity/transactions/${transactionType}`;

//       const response = await fetch(endpoint, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           userId: user,
//           amount: parseFloat(amount),
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`Transaction failed with status: ${response.status}`);
//       }

//       // Re-fetch balance after successful transaction
//       await fetchBalance();

//       const data = await response.json();
//       setBalance(data.newBalance);
//       setAmount("");
//       setSuccessMessage(
//         `Successfully ${
//           transactionType === "deposit" ? "deposited" : "withdrawn"
//         } $${amount}`
//       );
//     } catch (error) {
//       console.error(`Error during ${transactionType}:`, error);
//       setErrorMessage(
//         error.message || `Failed to ${transactionType}. Please try again.`
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="wallet-container">
//       <h2>Wallet Management</h2>

//       <div className="balance-display">
//         <h3>Current Balance</h3>
//         {isLoading && !balance ? (
//           <div className="loading-spinner"></div>
//         ) : (
//           <p className="balance-amount">${Number(balance || 0).toFixed(2)}</p>
//         )}
//       </div>

//       <div className="transaction-type-selector">
//         <button
//           className={`type-button ${
//             transactionType === "deposit" ? "active" : ""
//           }`}
//           onClick={() => handleTransactionTypeChange("deposit")}
//         >
//           Deposit
//         </button>
//         <button
//           className={`type-button ${
//             transactionType === "withdraw" ? "active" : ""
//           }`}
//           onClick={() => handleTransactionTypeChange("withdraw")}
//         >
//           Withdraw
//         </button>
//       </div>

//       <form onSubmit={handleSubmit} className="transaction-form">
//         <div className="form-group">
//           <label htmlFor="amount">Amount ($)</label>
//           <input
//             type="text"
//             id="amount"
//             value={amount}
//             onChange={handleAmountChange}
//             placeholder="Enter amount"
//             disabled={isLoading}
//           />
//         </div>

//         {errorMessage && <p className="error-message">{errorMessage}</p>}
//         {successMessage && <p className="success-message">{successMessage}</p>}

//         <button
//           type="submit"
//           className="submit-button"
//           disabled={isLoading || !amount}
//         >
//           {isLoading ? (
//             <span className="loading-spinner-small"></span>
//           ) : transactionType === "deposit" ? (
//             "Deposit Funds"
//           ) : (
//             "Withdraw Funds"
//           )}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default UserDepositWithdraw;

import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext"; // Adjust path if needed
import "./userDepositWithdraw.css";

const UserDepositWithdraw = () => {
  const { user } = useUser();
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [transactionType, setTransactionType] = useState("deposit"); // 'deposit' or 'withdraw'

  // Fetch balance function (reusable)
  const fetchBalance = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const response = await fetch(
        "/output_monitor/retrieve/balance",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch wallet balance");
      }

      const data = await response.json();
      setBalance(Number(data));
    } catch (error) {
      console.error("Error fetching balance:", error);
      setErrorMessage(
        "Unable to load your current balance. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch current balance when component mounts or user changes
  useEffect(() => {
    fetchBalance();
    // eslint-disable-next-line
  }, [user]);

  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Only allow numbers and decimals
    if (value === "" || /^\d+(\.\d{0,2})?$/.test(value)) {
      setAmount(value);
      setErrorMessage("");
    }
  };

  const handleTransactionTypeChange = (type) => {
    setTransactionType(type);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input
    if (!amount || parseFloat(amount) <= 0) {
      setErrorMessage("Please enter a valid amount greater than zero.");
      return;
    }

    // For withdraw, check if sufficient balance
    if (transactionType === "withdraw" && parseFloat(amount) > balance) {
      setErrorMessage("Insufficient funds. Please enter a smaller amount.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const endpoint = `/user_activity/transactions/${transactionType}`;

      console.log(user);
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user,
          amount: parseFloat(amount),
        }),
      });

      if (!response.ok) {
        throw new Error(`Transaction failed with status: ${response.status}`);
      }

      // Re-fetch balance after successful transaction
      await fetchBalance();

      setAmount("");
      setSuccessMessage(
        `Successfully ${
          transactionType === "deposit" ? "deposited" : "withdrawn"
        } $${amount}`
      );
    } catch (error) {
      console.error(`Error during ${transactionType}:`, error);
      setErrorMessage(
        error.message || `Failed to ${transactionType}. Please try again.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="wallet-container">
      <h2>Wallet Management</h2>

      <div className="balance-display">
        <h3>Current Balance</h3>
        {isLoading && !balance ? (
          <div className="loading-spinner"></div>
        ) : (
          <p className="balance-amount">${Number(balance || 0).toFixed(2)}</p>
        )}
      </div>

      <div className="transaction-type-selector">
        <button
          className={`type-button ${
            transactionType === "deposit" ? "active" : ""
          }`}
          onClick={() => handleTransactionTypeChange("deposit")}
        >
          Deposit
        </button>
        <button
          className={`type-button ${
            transactionType === "withdraw" ? "active" : ""
          }`}
          onClick={() => handleTransactionTypeChange("withdraw")}
        >
          Withdraw
        </button>
      </div>

      <form onSubmit={handleSubmit} className="transaction-form">
        <div className="form-group">
          <label htmlFor="amount">Amount ($)</label>
          <input
            type="text"
            id="amount"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Enter amount"
            disabled={isLoading}
          />
        </div>

        {errorMessage && (
          <p className="error-message" aria-live="polite">
            {errorMessage}
          </p>
        )}
        {successMessage && (
          <p className="success-message" aria-live="polite">
            {successMessage}
          </p>
        )}

        <button
          type="submit"
          className="submit-button"
          disabled={isLoading || !amount}
        >
          {isLoading ? (
            <span className="loading-spinner-small"></span>
          ) : transactionType === "deposit" ? (
            "Deposit Funds"
          ) : (
            "Withdraw Funds"
          )}
        </button>
      </form>
    </div>
  );
};

export default UserDepositWithdraw;
