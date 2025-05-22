import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const Header = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the user data from context
    setUser(null);

    // Redirect to auth page
    navigate("/auth");
  };

  const headerStyle = {
    backgroundColor: "#2c3e50",
    padding: "1rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
  };

  const logoStyle = {
    fontSize: "1.5rem",
    fontWeight: "bold"
  };

  const logoLinkStyle = {
    color: "#ecf0f1",
    textDecoration: "none"
  };

  const navStyle = {
    display: "flex"
  };

  const navListStyle = {
    display: "flex",
    listStyleType: "none",
    margin: 0,
    padding: 0,
    gap: "1.5rem"
  };

  const navLinkStyle = {
    color: "#ecf0f1",
    textDecoration: "none",
    fontWeight: "500",
    padding: "0.5rem 0",
    position: "relative"
  };

  const logoutButtonStyle = {
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold"
  };

  return (
    <header style={headerStyle}>
      <div style={logoStyle}>
        <Link to="/home" style={logoLinkStyle}>StockTracker</Link>
      </div>
      <nav style={navStyle}>
        <ul style={navListStyle}>
          <li>
            <Link to="/home" style={navLinkStyle}>Home</Link>
          </li>
          <li>
            <Link to="/portfolio" style={navLinkStyle}>Portfolio</Link>
          </li>
          <li>
            <Link to="/all" style={navLinkStyle}>All Stocks</Link>
          </li>
          <li>
            <Link to="/user-account" style={navLinkStyle}>My Account</Link>
          </li>
          <li>
            <button style={logoutButtonStyle} onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;