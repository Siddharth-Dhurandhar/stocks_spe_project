import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const Header = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate("/auth");
  };

  return (
    <header
      className="glass-panel"
      style={{
        margin: "1rem",
        borderRadius: "12px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.75rem 1.5rem",
      }}
    >
      <div
        className="logo"
        style={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          letterSpacing: "-0.05em",
        }}
      >
        <Link
          to="/home"
          style={{
            color: "var(--text-primary)",
            textDecoration: "none",
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span
            style={{
              background: "linear-gradient(90deg, #22c55e, #3b82f6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            STOX
          </span>
          <span
            style={{
              width: "8px",
              height: "8px",
              background: "var(--accent-green)",
              borderRadius: "50%",
              marginLeft: "5px",
              boxShadow: "0 0 8px var(--accent-green)",
            }}
          ></span>
        </Link>
      </div>

      <nav>
        <ul
          style={{
            display: "flex",
            gap: "2rem",
            alignItems: "center",
            listStyleType: "none",
            margin: 0,
            padding: 0,
          }}
        >
          <li>
            <Link
              to="/home"
              className="nav-link"
              style={{
                color: "var(--text-secondary)",
                textDecoration: "none",
                padding: "0.5rem 0",
                fontWeight: "500",
                position: "relative",
                transition: "all 0.3s ease",
              }}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/portfolio"
              className="nav-link"
              style={{
                color: "var(--text-secondary)",
                textDecoration: "none",
                padding: "0.5rem 0",
                fontWeight: "500",
                position: "relative",
                transition: "all 0.3s ease",
              }}
            >
              Portfolio
            </Link>
          </li>
          <li>
            <Link
              to="/all"
              className="nav-link"
              style={{
                color: "var(--text-secondary)",
                textDecoration: "none",
                padding: "0.5rem 0",
                fontWeight: "500",
                position: "relative",
                transition: "all 0.3s ease",
              }}
            >
              Markets
            </Link>
          </li>
          <li>
            <Link
              to="/wallet"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "#2563eb",
                background: "rgba(37,99,235,0.08)",
                border: "none",
                padding: "0.5rem 0.75rem",
                borderRadius: "8px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.3s ease",
                textDecoration: "none",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 3h-8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z" />
              </svg>
              Wallet
            </Link>
          </li>
          <li>
            <Link
              to="/user-account"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "var(--text-secondary)",
                textDecoration: "none",
                padding: "0.5rem 0.75rem",
                fontWeight: "500",
                background: "rgba(255,255,255,0.05)",
                borderRadius: "8px",
                transition: "all 0.3s ease",
              }}
            >
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
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Account
            </Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              style={{
                background: "rgba(239, 68, 68, 0.2)",
                border: "1px solid rgba(239, 68, 68, 0.4)",
                color: "#ef4444",
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
                transition: "all 0.3s ease",
              }}
            >
              Disconnect
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
