import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./SignupForm";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Animated Background */}
      <div className="floating-orbs">
        <div className="orb"></div>
        <div className="orb"></div>
        <div className="orb"></div>
        <div className="orb"></div>
      </div>
      
      {/* Main Content */}
      <div className="glass-panel" style={{
        maxWidth: "480px",
        width: "100%",
        margin: "0 1rem"
      }}>
        {/* Logo & Headline */}
        <div style={{
          textAlign: "center",
          marginBottom: "2rem"
        }}>
          <div style={{
            fontSize: "2rem",
            fontWeight: "bold",
            margin: "0 0 0.5rem",
            background: "linear-gradient(90deg, #22c55e, #3b82f6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            STOX
          </div>
          <h1 style={{
            fontSize: "1.75rem",
            letterSpacing: "-0.025em",
            margin: "0.5rem 0"
          }}>
            Trading Evolved
          </h1>
          <p style={{
            color: "var(--text-secondary)",
            margin: "0.5rem 0 1.5rem"
          }}>
            Your gateway to next-gen stock trading and portfolio management
          </p>
        </div>
        
        {/* Tabs */}
        <div style={{
          display: "flex",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          marginBottom: "1.5rem"
        }}>
          <button
            onClick={() => setActiveTab("login")}
            style={{
              flex: 1,
              background: "none",
              border: "none",
              padding: "0.75rem",
              color: activeTab === "login" ? "var(--accent-blue)" : "var(--text-muted)",
              fontWeight: activeTab === "login" ? "600" : "400",
              position: "relative",
              cursor: "pointer"
            }}
          >
            Connect
            {activeTab === "login" && (
              <span style={{
                position: "absolute",
                bottom: "-1px",
                left: "20%",
                right: "20%",
                height: "2px",
                background: "var(--accent-blue)",
                boxShadow: "0 0 8px var(--accent-blue)"
              }}></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("register")}
            style={{
              flex: 1,
              background: "none",
              border: "none",
              padding: "0.75rem",
              color: activeTab === "register" ? "var(--accent-blue)" : "var(--text-muted)",
              fontWeight: activeTab === "register" ? "600" : "400",
              position: "relative",
              cursor: "pointer"
            }}
          >
            Create Account
            {activeTab === "register" && (
              <span style={{
                position: "absolute",
                bottom: "-1px",
                left: "20%",
                right: "20%",
                height: "2px",
                background: "var(--accent-blue)",
                boxShadow: "0 0 8px var(--accent-blue)"
              }}></span>
            )}
          </button>
        </div>
        
        {/* Form Content */}
        {activeTab === "login" ? (
          <LoginForm onBack={() => setActiveTab("register")} />
        ) : (
          <RegisterForm onBack={() => setActiveTab("login")} />
        )}
      </div>
    </div>
  );
};

export default AuthPage;