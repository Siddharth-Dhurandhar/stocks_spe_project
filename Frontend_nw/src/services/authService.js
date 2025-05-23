import axios from "axios";

const API_URL = "/auth_portal";

export const signup = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, userData);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || { message: "An error occurred during signup" }
    );
  }
};

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    console.log("Login Response:", response.data); // Debugging: Check the API response

    // Mock the username if the backend only returns "Login successful"
    if (response.data === "Login successful") {
      return { username: credentials.username }; // Mock the username
    }

    if (response.data) {
      localStorage.setItem("user", JSON.stringify(response.data)); // Save user data to localStorage
    }
    return response.data; // Ensure this contains the username
  } catch (error) {
    throw error.response?.data || { message: "An error occurred during login" };
  }
};

////////////////
// mera wala end
////////////////

export const logout = () => {
  localStorage.removeItem("user");
};
