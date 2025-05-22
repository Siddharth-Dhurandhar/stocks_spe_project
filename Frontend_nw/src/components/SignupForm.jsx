import React, { useState } from 'react';
import { signup } from '../services/authService';

const SignupForm = ({ onBack }) => {
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
    payment_mode: 'credit_card'
  });
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }
    
    try {
      await signup(formData);
      onBack(); // Go back to login after successful signup
    } catch (error) {
      setError(error.message || 'An error occurred during signup');
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
            type="text"
            id="first_name"
            name="first_name"
            className="input"
            placeholder=" "
            value={formData.first_name}
            onChange={handleChange}
            required
          />
          <label htmlFor="first_name" className="input-label">First Name</label>
        </div>
        
        <div className="input-group">
          <input
            type="text"
            id="last_name"
            name="last_name"
            className="input"
            placeholder=" "
            value={formData.last_name}
            onChange={handleChange}
            required
          />
          <label htmlFor="last_name" className="input-label">Last Name</label>
        </div>
        
        <div className="input-group">
          <input
            type="email"
            id="email"
            name="email"
            className="input"
            placeholder=" "
            value={formData.email}
            onChange={handleChange}
            required
          />
          <label htmlFor="email" className="input-label">Email</label>
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
        
        <div className="input-group">
          <input
            type="password"
            id="confirm_password"
            name="confirm_password"
            className="input"
            placeholder=" "
            value={formData.confirm_password}
            onChange={handleChange}
            required
          />
          <label htmlFor="confirm_password" className="input-label">Confirm Password</label>
        </div>
        
        <div className="input-group">
          <select
            id="payment_mode"
            name="payment_mode"
            className="input"
            value={formData.payment_mode}
            onChange={handleChange}
            required
          >
            <option value="credit_card">Credit Card</option>
            <option value="debit_card">Debit Card</option>
            <option value="bank_transfer">Bank Transfer</option>
          </select>
          <label htmlFor="payment_mode" className="input-label">Payment Mode</label>
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
          ) : "Register Account"}
        </button>
        
        <div style={{
          textAlign: "center",
          margin: "1.5rem 0 0.5rem",
          color: "var(--text-secondary)",
          fontSize: "0.875rem"
        }}>
          Already have an account?{" "}
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
            Log in
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

export default SignupForm;