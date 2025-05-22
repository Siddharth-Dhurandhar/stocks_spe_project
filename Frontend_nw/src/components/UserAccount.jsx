///////////////////////////
// ORIGINAL CODE
///////////////////////////

// import React, { useState, useEffect } from "react";

// const UserAccount = () => {
//   const [userInfo, setUserInfo] = useState(null);

//   // // uncomment isko pura when fetching from backend
//   // const [isLoading, setIsLoading] = useState(true);
//   // useEffect(() => {
//   //   const fetchUserData = async () => {
//   //     try {
//   //       const response = await fetch("http://localhost:8080/api/user"); // Replace with your backend API endpoint
//   //       if (!response.ok) {
//   //         throw new Error("Failed to fetch user data");
//   //       }
//   //       const data = await response.json();
//   //       setUserInfo(data);
//   //     } catch (error) {
//   //       console.error("Error fetching user data:", error);
//   //     } finally {
//   //       setIsLoading(false);
//   //     }
//   //   };

//   //   fetchUserData();
//   // }, []);

//   useEffect(() => {
//     // Mock user data (replace this with an API call to fetch user data)
//     const mockUserData = {
//       name: "John Doe",
//       email: "johndoe@example.com",
//       joinedDate: "2023-01-15",
//       totalInvested: 15000,
//       totalProfit: 2500,
//     };

//     setTimeout(() => {
//       setUserInfo(mockUserData);
//     }, 1000); // Simulate loading delay
//   }, []);

//   // // uncomment this too when loading from backend
//   // if (isLoading) {
//   //   return (
//   //     <div className="bg-gradient-to-b from-black via-gray-900 to-black min-h-screen flex items-center justify-center">
//   //       <div className="text-center">
//   //         <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-green-500 border-b-green-500 mx-auto mb-6 shadow-lg"></div>
//   //         <p className="text-lg font-semibold text-gray-400 tracking-wide">
//   //           Loading user information...
//   //         </p>
//   //       </div>
//   //     </div>
//   //   );
//   // }

//   if (!userInfo) {
//     return (
//       <div className="bg-gradient-to-b from-black via-gray-900 to-black min-h-screen flex items-center justify-center">
//         <p className="text-lg font-semibold text-red-500 tracking-wide">
//           Failed to load user information. Please try again later.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gradient-to-b from-black via-gray-900 to-black min-h-screen text-gray-100 font-sans selection:bg-green-600 selection:text-gray-900">
//       <header className="bg-gradient-to-r from-gray-900 to-black p-10 shadow-2xl border-b border-green-700/40">
//         <div className="max-w-7xl mx-auto">
//           <h1 className="text-5xl font-extrabold text-center tracking-wide text-green-400 drop-shadow-md">
//             User Account
//           </h1>
//         </div>
//       </header>

//       <main className="max-w-4xl mx-auto px-6 py-16">
//         <div className="bg-black bg-opacity-70 backdrop-blur-md rounded-3xl shadow-[0_0_30px_2px_rgba(34,197,94,0.6)] border border-green-700/40 p-8">
//           <h2 className="text-3xl font-semibold mb-6 text-green-400 drop-shadow-md tracking-wide">
//             Account Details
//           </h2>
//           <div className="space-y-6">
//             <div className="flex justify-between items-center">
//               <span className="text-lg font-semibold text-green-300">
//                 Name:
//               </span>
//               <span className="text-lg text-green-200">{userInfo.name}</span>
//             </div>
//             <div className="flex justify-between items-center">
//               <span className="text-lg font-semibold text-green-300">
//                 Email:
//               </span>
//               <span className="text-lg text-green-200">{userInfo.email}</span>
//             </div>
//             <div className="flex justify-between items-center">
//               <span className="text-lg font-semibold text-green-300">
//                 Joined Date:
//               </span>
//               <span className="text-lg text-green-200">
//                 {new Date(userInfo.joinedDate).toLocaleDateString()}
//               </span>
//             </div>
//             <div className="flex justify-between items-center">
//               <span className="text-lg font-semibold text-green-300">
//                 Total Invested:
//               </span>
//               <span className="text-lg text-green-200">
//                 ${userInfo.totalInvested.toLocaleString()}
//               </span>
//             </div>
//             <div className="flex justify-between items-center">
//               <span className="text-lg font-semibold text-green-300">
//                 Total Profit:
//               </span>
//               <span
//                 className={`text-lg font-semibold ${
//                   userInfo.totalProfit >= 0 ? "text-green-400" : "text-red-400"
//                 }`}
//               >
//                 ${userInfo.totalProfit.toLocaleString()}
//               </span>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default UserAccount;

///////////////////////////
// ORIGINAL CODE END
///////////////////////////

import React, { useState, useEffect } from "react";

const UserAccount = () => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const mockUserData = {
      name: "John Doe",
      email: "johndoe@example.com",
      joinedDate: "2023-01-15",
      totalInvested: 15000,
      totalProfit: 2500,
    };

    setTimeout(() => {
      setUserInfo(mockUserData);
    }, 1000);
  }, []);

  if (!userInfo) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "red",
          fontWeight: "bold",
          fontSize: "1.2rem",
        }}
      >
        Failed to load user information. Please try again later.
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
        color: "#222",
        padding: "1rem",
      }}
    >
      <header
        style={{
          borderBottom: "2px solid black",
          paddingBottom: "1rem",
          marginBottom: "2rem",
          textAlign: "center",
        }}
      >
        <h1>User Account</h1>
      </header>

      <main
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          border: "1px solid black",
          borderRadius: "8px",
          padding: "1.5rem",
        }}
      >
        <h2
          style={{
            marginBottom: "1rem",
            borderBottom: "1px solid black",
            paddingBottom: "0.5rem",
          }}
        >
          Account Details
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {[
            { label: "Name:", value: userInfo.name },
            { label: "Email:", value: userInfo.email },
            {
              label: "Joined Date:",
              value: new Date(userInfo.joinedDate).toLocaleDateString(),
            },
            {
              label: "Total Invested:",
              value: `$${userInfo.totalInvested.toLocaleString()}`,
            },
            {
              label: "Total Profit:",
              value: `$${userInfo.totalProfit.toLocaleString()}`,
              isProfit: true,
            },
          ].map(({ label, value, isProfit }) => (
            <div
              key={label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderBottom: "1px solid #ccc",
                paddingBottom: "0.3rem",
              }}
            >
              <span style={{ fontWeight: "bold" }}>{label}</span>
              <span
                style={{
                  color: isProfit
                    ? userInfo.totalProfit >= 0
                      ? "green"
                      : "red"
                    : "#555",
                  fontWeight: isProfit ? "bold" : "normal",
                }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default UserAccount;
