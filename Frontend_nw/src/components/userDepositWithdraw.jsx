import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";

const UserDepositWithdraw = () => {
  const { user } = useUser();
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [transactionType, setTransactionType] = useState("deposit");

  // Fetch balance function (reusable)
  const fetchBalance = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const response = await fetch("/output_monitor/retrieve/balance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user,
        }),
      });

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
    if (value === "" || /^\d+(\.\d{0,2})?$/.test(value)) {
      setAmount(value);
      setErrorMessage("");
      setSuccessMessage("");
    }
  };

  const handleTransactionTypeChange = (type) => {
    setTransactionType(type);
    setErrorMessage("");
    setSuccessMessage("");
    setAmount("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0) {
      setErrorMessage("Please enter a valid amount greater than zero.");
      return;
    }

    if (transactionType === "withdraw" && parseFloat(amount) > balance) {
      setErrorMessage("Insufficient funds. Please enter a smaller amount.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const endpoint = `/user_activity/transactions/${transactionType}`;

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
    <div style={{ margin: "1rem", overflow: "hidden" }}>
      {/* Floating Orbs Background */}
      <div className="floating-orbs">
        <div className="orb"></div>
        <div className="orb"></div>
        <div className="orb"></div>
      </div>

      {/* Balance Section */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div className="glass-panel">
          <div
            style={{
              color: "var(--text-muted)",
              fontSize: "0.875rem",
              marginBottom: "0.5rem",
            }}
          >
            Available Balance
          </div>
          {isLoading && !balance ? (
            <div
              style={{
                width: "40px",
                height: "40px",
                border: "3px solid rgba(59, 130, 246, 0.2)",
                borderRadius: "50%",
                borderTop: "3px solid var(--accent-blue)",
                animation: "spin 1s linear infinite",
                margin: "1rem 0",
              }}
            ></div>
          ) : (
            <div
              style={{
                fontSize: "1.75rem",
                fontWeight: "700",
                background: "linear-gradient(90deg, #22c55e, #3b82f6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              ${Number(balance || 0).toFixed(2)}
            </div>
          )}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              marginTop: "0.5rem",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "var(--accent-green)",
              }}
            ></div>
            <span
              style={{
                fontSize: "0.875rem",
                color: "var(--text-secondary)",
              }}
            >
              Ready for trading
            </span>
          </div>
        </div>
      </div>

      {/* Transaction Form */}
      <div className="glass-panel">
        <h2
          style={{
            marginTop: "0",
            marginBottom: "1.5rem",
            fontSize: "1.25rem",
            color: "var(--text-primary)",
          }}
        >
          Make Transaction
        </h2>

        {/* Transaction Type Selector */}
        <div
          style={{
            display: "flex",
            marginBottom: "1.5rem",
            background: "rgba(255,255,255,0.05)",
            borderRadius: "8px",
            padding: "0.25rem",
          }}
        >
          <button
            onClick={() => handleTransactionTypeChange("deposit")}
            style={{
              flex: 1,
              padding: "0.75rem",
              borderRadius: "6px",
              border: "none",
              background:
                transactionType === "deposit"
                  ? "var(--accent-green)"
                  : "transparent",
              color:
                transactionType === "deposit"
                  ? "white"
                  : "var(--text-secondary)",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            Deposit
          </button>
          <button
            onClick={() => handleTransactionTypeChange("withdraw")}
            style={{
              flex: 1,
              padding: "0.75rem",
              borderRadius: "6px",
              border: "none",
              background:
                transactionType === "withdraw" ? "#ef4444" : "transparent",
              color:
                transactionType === "withdraw"
                  ? "white"
                  : "var(--text-secondary)",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            Withdraw
          </button>
        </div>

        {/* Amount Input */}
        <div className="input-group" style={{ marginBottom: "1.5rem" }}>
          <input
            type="text"
            id="amount"
            className="input"
            placeholder=" "
            value={amount}
            onChange={handleAmountChange}
            disabled={isLoading}
            style={{
              fontSize: "1.125rem",
              padding: "1rem",
            }}
          />
          <label htmlFor="amount" className="input-label">
            Amount ($)
          </label>
        </div>

        {/* Quick Amount Buttons */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "0.5rem",
            marginBottom: "1.5rem",
          }}
        >
          {["100", "500", "1000", "5000"].map((quickAmount) => (
            <button
              key={quickAmount}
              onClick={() => setAmount(quickAmount)}
              style={{
                padding: "0.5rem",
                borderRadius: "6px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                background: "rgba(255, 255, 255, 0.05)",
                color: "var(--text-secondary)",
                fontSize: "0.875rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              ${quickAmount}
            </button>
          ))}
        </div>

        {/* Error/Success Messages */}
        {errorMessage && (
          <div
            style={{
              padding: "0.75rem",
              borderRadius: "8px",
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "#ef4444",
              marginBottom: "1.5rem",
              fontSize: "0.875rem",
            }}
          >
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div
            style={{
              padding: "0.75rem",
              borderRadius: "8px",
              background: "rgba(34, 197, 94, 0.15)",
              border: "1px solid rgba(34, 197, 94, 0.3)",
              color: "var(--accent-green)",
              marginBottom: "1.5rem",
              fontSize: "0.875rem",
            }}
          >
            {successMessage}
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isLoading || !amount}
          style={{
            width: "100%",
            padding: "0.875rem",
            borderRadius: "8px",
            border: "none",
            background:
              transactionType === "deposit"
                ? "var(--accent-green)"
                : "#ef4444",
            color: "white",
            fontWeight: "600",
            fontSize: "1rem",
            cursor: isLoading || !amount ? "not-allowed" : "pointer",
            opacity: isLoading || !amount ? 0.5 : 1,
            boxShadow:
              transactionType === "deposit"
                ? "0 0 15px rgba(34, 197, 94, 0.4)"
                : "0 0 15px rgba(239, 68, 68, 0.4)",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
          }}
        >
          {isLoading ? (
            <>
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  border: "2px solid rgba(255, 255, 255, 0.3)",
                  borderRadius: "50%",
                  borderTop: "2px solid white",
                  animation: "spin 1s linear infinite",
                }}
              ></div>
              Processing...
            </>
          ) : (
            <>
              {transactionType === "deposit" ? "Deposit Funds" : "Withdraw Funds"}
            </>
          )}
        </button>
      </div>

      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default UserDepositWithdraw;