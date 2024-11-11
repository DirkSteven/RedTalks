import React, { useEffect, useState } from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import axios from 'axios';
import AppContext from './Contexts/AppContext';
import Home from './Pages/Home/Home';
// import { init } from '../../server/src/models/User.js';

function App() {
  useEffect(() => {
    console.log('useEffect running');
    console.log(Home);
    init();
  }, []);

  const [isInitiated, setIsInitiated] = useState(false);
  const [user, setUser] = useState(null);  // State to hold user data

  const init = async () => {
    // const token = localStorage.getItem('token');
    // const {data} = await axios.get(`http://localhost:5000/api/user/init?token=${token}`);
    // setUser(data.user);
    // setIsInitiated(true);


    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`http://localhost:5000/api/user/init?token=${token}`);
      setUser (data.user);
    } catch (error) {
      console.error('Error during initialization:', error);
    } finally {
      setIsInitiated(true); // Ensure this runs regardless of success or failure
    }
  };

  return (
    <div>
      {isInitiated && (
        <AppContext.Provider value = {{ user, setUser }}>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
          </Router>
        </AppContext.Provider>
      )} 
    </div>
  );
}

export default App;
