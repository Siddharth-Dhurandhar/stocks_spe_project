import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import StockPage from "./components/StockPage";
import Temp from "./components/Temp";
import "./App.css";
import Portfolio from "./components/Portfolio";
import UserAccount from "./components/UserAccount";
import AuthPage from "./components/AuthPage";
import AllStocks from "./components/AllStocks";
import { UserProvider } from "./context/UserContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const location = useLocation();

  // Define routes where the Header should not appear
  const noHeaderRoutes = ["/auth"];

  return (
    <div>
      {/* Render Header only if the current route is not in noHeaderRoutes */}
      {!noHeaderRoutes.includes(location.pathname) && <Header />}
      <Routes>
        {/* Auth page is accessible without login */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Redirect root to home when authenticated, otherwise to auth */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* All other routes are protected */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/portfolio"
          element={
            <ProtectedRoute>
              <Portfolio />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-account"
          element={
            <ProtectedRoute>
              <UserAccount />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stock/:id"
          element={
            <ProtectedRoute>
              <StockPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/temp"
          element={
            <ProtectedRoute>
              <Temp />
            </ProtectedRoute>
          }
        />
        <Route
          path="/all"
          element={
            <ProtectedRoute>
              <AllStocks />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

function AppWrapper() {
  return (
    <UserProvider>
      <Router>
        <App />
      </Router>
    </UserProvider>
  );
}

export default AppWrapper;
