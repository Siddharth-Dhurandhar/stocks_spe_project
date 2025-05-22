// import React from "react";
// import { Link } from "react-router-dom";

// const Header = () => {
//   return (
//     <header className="bg-neutral-900 p-4 flex justify-between items-center shadow-lg">
//       {/* Logo */}
//       <div id="logo" className="text-2xl font-bold text-white">
//         STOX
//       </div>

//       {/* Navigation */}
//       <nav>
//         <ul className="flex gap-6">
//           <li>
//             <Link
//               to="/"
//               className="text-white hover:text-blue-400 transition-colors"
//             >
//               HomePage
//             </Link>
//           </li>
//           <li>
//             <Link
//               to="/portfolio"
//               className="text-white hover:text-blue-400 transition-colors"
//             >
//               Portfolio
//             </Link>
//           </li>
//           <li>
//             <Link
//               to="/user-account"
//               className="text-white hover:text-blue-400 transition-colors"
//             >
//               UserAccount
//             </Link>
//           </li>
//         </ul>
//       </nav>
//     </header>
//   );
// };

// export default Header;

import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-purple-700 to-indigo-900 p-4 flex justify-between items-center shadow-md">
      {/* Logo */}
      <div
        id="logo"
        className="text-3xl font-extrabold text-white tracking-tight"
      >
        STOX
      </div>

      {/* Navigation */}
      <nav>
        <ul className="flex gap-8 items-center">
          <li>
            <Link
              to="/"
              className="text-white text-lg font-medium hover:text-blue-400 transition-colors"
            >
              HomePage
            </Link>
          </li>
          <li>
            <Link
              to="/all"
              className="text-white text-lg font-medium hover:text-blue-400 transition-colors"
            >
              AllStocks
            </Link>
          </li>
          <li>
            <Link
              to="/portfolio"
              className="text-white text-lg font-medium hover:text-blue-400 transition-colors"
            >
              Portfolio
            </Link>
          </li>
          <li>
            <Link
              to="/user-account"
              className="text-white text-lg font-medium hover:text-blue-400 transition-colors"
            >
              UserAccount
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
