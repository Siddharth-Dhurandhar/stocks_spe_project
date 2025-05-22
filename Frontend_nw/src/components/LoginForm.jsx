// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { login } from "../services/authService";

// const LoginForm = ({ onBack }) => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     username: "",
//     password: "",
//   });
//   const [error, setError] = useState("");

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       await login(formData);
//       navigate("/");
//     } catch (error) {
//       setError(error.message || "Invalid username or password");
//     }
//   };

//   return (
//     <div className="form-container">
//       <h2>Login</h2>
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label>Username</label>
//           <input
//             type="text"
//             name="username"
//             value={formData.username}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label>Password</label>
//           <input
//             type="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         {error && <div className="error-message">{error}</div>}
//         <div className="form-buttons">
//           <button type="button" onClick={onBack}>
//             Back
//           </button>
//           <button type="submit">Login</button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default LoginForm;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { useUser } from "../context/UserContext";

const LoginForm = ({ onBack }) => {
  const navigate = useNavigate();
  const { setUser } = useUser(); // Access the global user state
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userData = await login(formData); // Ensure login returns the correct user data
      console.log("User Data:", userData); // Debugging: Check the response
      setUser(userData.username); // Save the username globally
      navigate("/");
    } catch (error) {
      setError(error.message || "Invalid username or password");
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <div className="form-buttons">
          <button type="button" onClick={onBack}>
            Back
          </button>
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
