import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px",
        backgroundColor: "#333",
        color: "white",
      }}
    >
      <div id="logo" style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
        MyApp
      </div>
      <nav>
        <ul
          style={{
            display: "flex",
            listStyle: "none",
            gap: "20px",
            margin: 0,
            padding: 0,
          }}
        >
          <li>
            <Link to="/" style={{ color: "white", textDecoration: "none" }}>
              HomePage
            </Link>
          </li>
          <li>
            <Link
              to="/portfolio"
              style={{ color: "white", textDecoration: "none" }}
            >
              Portfolio
            </Link>
          </li>
          <li>
            <Link
              to="/user-account"
              style={{ color: "white", textDecoration: "none" }}
            >
              UserAccount
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};
export default Header;
