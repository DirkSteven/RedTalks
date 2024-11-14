import React, { useEffect, useState } from 'react';
import {BrowserRouter as Router, Route, BrowserRouter} from 'react-router-dom';
import AppContext from './Contexts/AppContext';
import Home from './Pages/Home';
import Landing from './Pages/Landing';
// import { init } from '../../server/src/models/User.js';

function App() {

  const [loading, setLoading] = useState(true);  // Loading state
  const [isInitiated, setIsInitiated] = useState(false);
  const [user, setUser] = useState(null);  // State to hold user data
  const axios = require('axios');

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.log('No token found');
      setLoading(false);
      return;
    }

    console.log("Sending token:", token);

    try {
      // Make a GET request to your Express backend to get the user data
      const response = await axios.get(`http://localhost:5000/api/user/init?token=${token}`);
      console.log("Response from server: ", response.data);

      if (response.data && response.data.user) {
        setUser(response.data.user);  // Set the user data from the response
        setIsInitiated(true);
      } else {
        console.log('No user data found in response');
        setUser(null);  // Handle case when user data is not returned
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>No user data found</div>;
  }


  return (
    <div>
      {isInitiated && (
        <AppContext.Provider value = {{user, setUser}}>
          <BrowserRouter>
            <Router>
                <Route path="/Home">
                  <Home />
                </Route>
                <Route path="Landing">
                  <Landing/>
                </Route>
            </Router>
          </BrowserRouter>
        </AppContext.Provider>
      )}
    </div>
    // <h1>Welcome, {user.name}</h1>
  );
}

export default App;
