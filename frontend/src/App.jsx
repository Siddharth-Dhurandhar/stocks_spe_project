// // src/App.jsx
// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Header from "./components/Header";
// import HomePage from "./components/HomePage";
// import StockPage from "./components/StockPage";
// import Temp from "./components/Temp";
// import "./App.css";
// import Portfolio from "./components/Portfolio";
// import UserAccount from "./components/UserAccount";
// import Login from "./components/Login";

// function App() {
//   return (
//     <Router>
//       <div>
//         <Header />
//         <Routes>
//           <Route path="/" element={<HomePage />} />
//           <Route path="/portfolio" element={<Portfolio />} />
//           <Route path="/user-account" element={<UserAccount />} />
//           <Route path="/stock/:id" element={<StockPage />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/temp" element={<Temp />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import StockPage from "./components/StockPage";
import Temp from "./components/Temp";
import "./App.css";
import Portfolio from "./components/Portfolio";
import UserAccount from "./components/UserAccount";
import Login from "./components/Login";

function App() {
  const location = useLocation(); // Get the current route

  // Define routes where the Header should not appear
  const noHeaderRoutes = ["/login"];

  return (
    <div>
      {/* Render Header only if the current route is not in noHeaderRoutes */}
      {!noHeaderRoutes.includes(location.pathname) && <Header />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/user-account" element={<UserAccount />} />
        <Route path="/stock/:id" element={<StockPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/temp" element={<Temp />} />
      </Routes>
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
