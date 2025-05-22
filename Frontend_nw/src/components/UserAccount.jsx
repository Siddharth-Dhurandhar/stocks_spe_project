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
          "http://localhost:8085/output_monitor/retrieve/getUserDetails",
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
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p>Loading user details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "red" }}>
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!userDetails) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p>No user details available.</p>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: "20px", 
      maxWidth: "600px", 
      margin: "0 auto",
      backgroundColor: "#fff",
      borderRadius: "8px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
    }}>
      <h1>User Account</h1>
      
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "150px 1fr",
        gap: "10px",
        margin: "20px 0"
      }}>
        <div style={{ fontWeight: "bold" }}>Username:</div>
        <div>{userDetails.username}</div>
        
        <div style={{ fontWeight: "bold" }}>First Name:</div>
        <div>{userDetails.first_name}</div>
        
        <div style={{ fontWeight: "bold" }}>Last Name:</div>
        <div>{userDetails.last_name}</div>
        
        <div style={{ fontWeight: "bold" }}>Email:</div>
        <div>{userDetails.email}</div>
        
        <div style={{ fontWeight: "bold" }}>Payment Mode:</div>
        <div>{userDetails.payment_mode}</div>
        
        <div style={{ fontWeight: "bold" }}>User ID:</div>
        <div>{userDetails.user_id}</div>
      </div>
    </div>
  );
};

export default UserAccount;