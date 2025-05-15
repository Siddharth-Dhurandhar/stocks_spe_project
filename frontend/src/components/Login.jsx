import React, { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    const requestBody = {
      email,
      password,
    };

    try {
      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        alert("Login successful!");
        // Redirect to homepage or dashboard
        window.location.href = "/";
      } else {
        setErrorMessage("Invalid email or password.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="bg-gradient-to-b from-black via-gray-900 to-black min-h-screen text-gray-100 font-sans selection:bg-green-600 selection:text-gray-900">
      {/* Local Header */}
      <header className="bg-neutral-900 p-4 flex justify-start items-center shadow-lg">
        <div id="logo" className="text-3xl font-bold text-white">
          STOX
        </div>
      </header>

      {/* Login Form */}
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="bg-black bg-opacity-70 backdrop-blur-md rounded-3xl shadow-[0_0_30px_2px_rgba(34,197,94,0.6)] border border-green-700/40 p-8 w-full max-w-md">
          <h2 className="text-4xl font-extrabold text-center text-green-400 mb-6 drop-shadow-md">
            Login
          </h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-green-300 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full border border-green-700 bg-black bg-opacity-50 text-green-200 p-3 rounded-lg placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-green-300 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full border border-green-700 bg-black bg-opacity-50 text-green-200 p-3 rounded-lg placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              />
            </div>
            {errorMessage && (
              <p className="text-red-500 text-sm text-center">{errorMessage}</p>
            )}
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
            >
              Login
            </button>
          </form>
          <p className="text-center text-sm text-green-300 mt-6">
            Don't have an account?{" "}
            <a
              href="/register"
              className="text-green-400 hover:underline transition"
            >
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
