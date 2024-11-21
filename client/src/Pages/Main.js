import React, { useState, useEffect } from "react";
import { BrowserRouter as BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Layout from './Layout';
import Home from './Home';
import Announcement from './Announcement';
import Marketplace from './Marketplace';
import Entry from './Entry';
import Login from './Login';
import Signup from './Signup';
import CreatePost from "./CreatePost";
import Forgot from "./ForgotPassword";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/Login" />;
  }
  return children;
}

function Main() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('/api/user/init', { 
        headers: { 
          Authorization: `Bearer ${token}` 
        } 
      })
      .then(response => {
        setIsAuthenticated(true);
      })
      .catch(error => {
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        localStorage.removeItem('user'); 
      })
      .finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Protect only authenticated routes */}
          <Route index element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="Home" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="Announcement" element={<Announcement />} />
          <Route path="Marketplace" element={<Marketplace />} />
          <Route path="CreatePost" element={<CreatePost />} />
        </Route>

        <Route path="/Login" element={<Entry />}>
          <Route index element={<Login />} />
          <Route path="Signup" element={<Signup />} />
          <Route path="ForgotPassword" element={<Forgot/>}></Route>
        </Route>

        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default Main;
