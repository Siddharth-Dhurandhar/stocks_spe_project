import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-neutral-900 p-4 flex justify-between items-center shadow-lg">
      {/* Logo */}
      <div id="logo" style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
        STOX
      </div>

      {/* Navigation */}
      <nav>
        <ul className="flex gap-6">
          <li>
            <Link
              to="/"
              className="text-white hover:text-green-400 transition-colors"
            >
              HomePage
            </Link>
          </li>
          <li>
            <Link
              to="/portfolio"
              className="text-white hover:text-green-400 transition-colors"
            >
              Portfolio
            </Link>
          </li>
          <li>
            <Link
              to="/user-account"
              className="text-white hover:text-green-400 transition-colors"
            >
              UserAccount
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
