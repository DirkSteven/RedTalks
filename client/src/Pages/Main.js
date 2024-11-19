import React, { useState, useEffect } from "react";
import {BrowserRouter as BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Layout from './Layout';
import Home from './Home';
import Announcement from './Announcement';
import Marketplace from './Marketplace';
import Entry from './Entry';
import Login from './Login';
import Signup from './Signup';

function Main() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      axios.get('/api/user/init', { headers: { Authorization: `Bearer ${token}` } })
        .then(response => {
          // Token is valid, user is authenticated
          setIsAuthenticated(true);
        })
        .catch(error => {
          // Invalid token or error, clear the token and mark as not authenticated
          setIsAuthenticated(false);
          localStorage.removeItem('token');  // Remove invalid token
        })
        .finally(() => {
          setLoading(false);  // Set loading to false after checking the token
        });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <p>Loading...</p>;  // You can show a loading spinner or message
  }

  return (
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<Layout/>}>
               <Route index element={isAuthenticated ? <Home /> : <Navigate to='/Login' />} />
               <Route path='Home' element={isAuthenticated ? <Home /> : <Navigate to='/Login' />} />
                <Route path='Announcement' element={<Announcement/>}/>
                <Route path='Marketplace' element={<Marketplace/>}/>
            </Route>
            <Route path='/Login' element={<Entry/>}>
                <Route index element={<Login/>}></Route>
                <Route path='Signup' element={<Signup/>}></Route>
            </Route>
            <Route path='*'element={<div>Page not found</div>}/>
        </Routes>
    </BrowserRouter>
  );
}

export default Main;