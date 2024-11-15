import React, { useEffect, useState } from 'react';
import AppContext from './Contexts/AppContext';
import Main from './Pages/Main';
// import { init } from '../../server/src/models/User.js';

function App() {

  const [loading, setLoading] = useState(true);  // Loading state
  const [isInitiated, setIsInitiated] = useState(false);
  const [user, setUser] = useState(null);  // State to hold user data
  // const axios = require('axios');

  useEffect(() => {
    console.log('useEffect running');
    console.log(Home);
    init();
  }, []);

  const init = async () => {
    const token = localStorage.getItem('token');
   
    if (!token) {
      console.log('No token found');
      setIsInitiated(true);
      setLoading(false);
      return;
    }

    console.log("Sending token:", token);
    try {
      const { data } = await axios.get(`/api/user/init?token=${token}`);
      setUser (data.user);
    } catch (error) {
      console.error('Error during initialization:', error);
    } finally {
      setIsInitiated(true);
      setLoading(false); 
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    // return <div>No user data found</div>;
    return <Main/>;
  }


  return (
    <div>
      {isInitiated && (
        <AppContext.Provider value = {{user, setUser}}>
            <Main/>
        </AppContext.Provider>
      )}
    </div>
    // <h1>Welcome, {user.name}</h1>
  );
}

export default App;
