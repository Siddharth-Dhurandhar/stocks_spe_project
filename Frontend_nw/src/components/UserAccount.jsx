import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";

const UserAccount = () => {
  const { user } = useUser();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        
        const response = await fetch(
          "output_monitor/retrieve/getUserDetails",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: user }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }

        const data = await response.json();
        setUserDetails(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user details:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    if (user) {
      fetchUserDetails();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="loading-container" style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "50vh"
      }}>
        <div className="loading-spinner" style={{
          width: "50px",
          height: "50px",
          border: "3px solid rgba(59, 130, 246, 0.2)",
          borderRadius: "50%",
          borderTop: "3px solid var(--accent-blue)",
          animation: "spin 1s linear infinite"
        }}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel" style={{ margin: "2rem", textAlign: "center" }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 1rem" }}>
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <h2>Error Loading Profile</h2>
        <p style={{ color: "var(--text-muted)" }}>{error}</p>
      </div>
    );
  }

  if (!userDetails) {
    return (
      <div className="glass-panel" style={{ margin: "2rem", textAlign: "center" }}>
        <h2>No User Details Available</h2>
        <p style={{ color: "var(--text-muted)" }}>Please try again later or contact support.</p>
      </div>
    );
  }

  return (
    <div style={{ margin: "1rem" }}>
      {/* Floating Orbs Background */}
      <div className="floating-orbs">
        <div className="orb"></div>
        <div className="orb"></div>
        <div className="orb"></div>
      </div>
      
      {/* Header */}
      <div className="glass-panel" style={{ marginBottom: "1.5rem" }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem"
        }}>
          <div>
            <h1 style={{ margin: "0 0 0.25rem 0", fontSize: "1.75rem" }}>Account Settings</h1>
            <p style={{ color: "var(--text-secondary)", margin: "0" }}>
              Manage your profile and preferences
            </p>
          </div>
        </div>
      </div>
      
      {/* User Profile Section */}
      <div className="grid md:grid-cols-3" style={{ gap: "1.5rem" }}>
        {/* Profile Overview */}
        <div className="glass-panel" style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: "2rem 1.5rem"
        }}>
          <div style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            background: "linear-gradient(45deg, var(--accent-blue), var(--accent-purple))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1.5rem",
            fontSize: "3rem",
            color: "white",
            fontWeight: "bold"
          }}>
            {userDetails.first_name?.charAt(0)?.toUpperCase() || userDetails.username?.charAt(0)?.toUpperCase() || "U"}
          </div>
          
          <h2 style={{ margin: "0 0 0.5rem 0" }}>
            {userDetails.first_name} {userDetails.last_name}
          </h2>
          <p style={{ 
            color: "var(--text-secondary)", 
            margin: "0 0 1.5rem 0",
            fontWeight: "500"
          }}>
            @{userDetails.username}
          </p>
          
          <div style={{
            background: "rgba(59, 130, 246, 0.1)",
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            marginBottom: "1rem",
            width: "100%"
          }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>User ID</div>
            <div style={{ fontWeight: "500" }}>{userDetails.user_id}</div>
          </div>
          
          <button className="btn-primary" style={{ width: "100%" }}>
            Edit Profile
          </button>
        </div>
        
        {/* Account Details */}
        <div className="glass-panel md:col-span-2">
          <h2 style={{ marginTop: "0", marginBottom: "1.5rem", fontSize: "1.25rem" }}>
            Account Information
          </h2>
          
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "1fr", 
            gap: "1rem" 
          }}>
            <div className="info-row">
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                padding: "1rem",
                background: "rgba(255,255,255,0.03)",
                borderRadius: "8px"
              }}>
                <div>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>Email Address</div>
                  <div style={{ fontWeight: "500", marginTop: "0.25rem" }}>{userDetails.email}</div>
                </div>
                <button style={{
                  background: "none",
                  border: "none",
                  color: "var(--accent-blue)",
                  cursor: "pointer",
                  fontSize: "0.875rem"
                }}>
                  Change
                </button>
              </div>
            </div>
            
            <div className="info-row">
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                padding: "1rem",
                background: "rgba(255,255,255,0.03)",
                borderRadius: "8px"
              }}>
                <div>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>Username</div>
                  <div style={{ fontWeight: "500", marginTop: "0.25rem" }}>{userDetails.username}</div>
                </div>
                <button style={{
                  background: "none",
                  border: "none",
                  color: "var(--accent-blue)",
                  cursor: "pointer",
                  fontSize: "0.875rem"
                }}>
                  Change
                </button>
              </div>
            </div>
            
            <div className="info-row">
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                padding: "1rem",
                background: "rgba(255,255,255,0.03)",
                borderRadius: "8px"
              }}>
                <div>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>Payment Method</div>
                  <div style={{ fontWeight: "500", marginTop: "0.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                      <line x1="1" y1="10" x2="23" y2="10"></line>
                    </svg>
                    {userDetails.payment_mode}
                  </div>
                </div>
                <button style={{
                  background: "none",
                  border: "none",
                  color: "var(--accent-blue)",
                  cursor: "pointer",
                  fontSize: "0.875rem"
                }}>
                  Update
                </button>
              </div>
            </div>
            
            <div className="info-row">
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                padding: "1rem",
                background: "rgba(255,255,255,0.03)",
                borderRadius: "8px"
              }}>
                <div>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>Password</div>
                  <div style={{ fontWeight: "500", marginTop: "0.25rem" }}>••••••••</div>
                </div>
                <button style={{
                  background: "none",
                  border: "none",
                  color: "var(--accent-blue)",
                  cursor: "pointer",
                  fontSize: "0.875rem"
                }}>
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default UserAccount;