import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { useUser } from "../context/UserContext";

const LoginForm = ({ onBack }) => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const userData = await login(formData);
      setUser(userData.user_id || userData.id || userData);
      navigate("/");
    } catch (error) {
      setError(error.message || "Invalid username or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            id="username"
            name="username"
            className="input"
            placeholder=" "
            value={formData.username}
            onChange={handleChange}
            required
          />
          <label htmlFor="username" className="input-label">Username</label>
        </div>
        
        <div className="input-group">
          <input
            type="password"
            id="password"
            name="password"
            className="input"
            placeholder=" "
            value={formData.password}
            onChange={handleChange}
            required
          />
          <label htmlFor="password" className="input-label">Password</label>
        </div>
        
        {error && (
          <div style={{
            padding: "0.75rem",
            borderRadius: "8px",
            background: "rgba(239, 68, 68, 0.2)",
            color: "#ef4444",
            marginBottom: "1.5rem",
            fontSize: "0.875rem"
          }}>
            {error}
          </div>
        )}
        
        <button 
          type="submit" 
          className="btn-primary"
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative"
          }}
          disabled={isLoading}
        >
          {isLoading ? (
            <span 
              style={{
                width: "1.5rem", 
                height: "1.5rem",
                border: "2px solid rgba(255,255,255,0.3)",
                borderTop: "2px solid white",
                borderRadius: "50%",
                animation: "spin 1s linear infinite"
              }}
            ></span>
          ) : "Connect Wallet"}
        </button>
        
        <div style={{
          textAlign: "center",
          margin: "1.5rem 0 0.5rem",
          color: "var(--text-secondary)",
          fontSize: "0.875rem"
        }}>
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onBack}
            style={{
              background: "none",
              border: "none",
              color: "var(--accent-blue)",
              cursor: "pointer",
              padding: 0,
              font: "inherit",
              fontWeight: "600"
            }}
          >
            Register now
          </button>
        </div>
      </form>
      
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoginForm;