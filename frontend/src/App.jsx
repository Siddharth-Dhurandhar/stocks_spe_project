// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import StockPage from "./components/StockPage";
import Temp from "./components/Temp";
import "./App.css";

function App() {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/portfolio" element={<div>Portfolio Page</div>} />
          <Route path="/user-account" element={<div>User Account Page</div>} />
          <Route path="/stock/:id" element={<StockPage />} />
          <Route path="/temp" element={<Temp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
