import React from "react";
import { useUser } from "../context/UserContext";

const Temp = () => {
  const { user } = useUser();
  console.log("Current User:", user); // Debugging: Check the global user state

  return (
    <div>{user ? <h1>Welcome, {user}!</h1> : <h1>No user logged in</h1>}</div>
  );
};

export default Temp;
