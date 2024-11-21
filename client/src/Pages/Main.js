import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Layout from './Layout';
import Home from './Home';
import Announcement from './Announcement';
import Marketplace from './Marketplace';
import Entry from './Entry';
import Login from './Login';
import Signup from './Signup';
import CreatePost from "./CreatePost";
import VerifyEmail from '../Components/verifyEmail';
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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('/api/user/init', { 
        headers: { 
          Authorization: `Bearer ${token}` 
        } 
      })
      .catch(error => {
        localStorage.removeItem('token');
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

        <Route path="/verify-email/:verificationToken" element={<VerifyEmail />} />

        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default Main;
