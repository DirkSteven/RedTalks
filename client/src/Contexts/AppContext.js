import {createContext} from 'react';

const AppContext = createContext({
    user: null,
    setUser: () => {}   
});

export default AppContext;

// AppContext.js
// import React, { createContext, useState, useEffect } from 'react';
// import jwt_decode from 'jwt-decode';

// const AppContext = createContext({
//   user: null,
//   setUser: () => {}
// });

// export const AppProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem('authToken');
//     if (token) {
//       try {
//         const decoded = jwt_decode(token); // Decode the token to get user data
//         if (decoded.exp > Date.now() / 1000) {  // Check if token is expired
//           setUser(decoded); // Set user state if token is valid
//         } else {
//           localStorage.removeItem('authToken'); // Remove expired token
//         }
//       } catch (error) {
//         console.error('Invalid token:', error);
//         localStorage.removeItem('authToken'); // Remove invalid token
//       }
//     }
//   }, []);

//   return (
//     <AppContext.Provider value={{ user, setUser }}>
//       {children}
//     </AppContext.Provider>
//   );
// };

// export default AppContext;
