import React, { useState, useEffect, useContext } from "react";
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
import Profile from "./Profile";
import UserPosts from "./UserPosts";
import UserComments from "./UserComments";
import UserLikes from "./UserLikes";
import AppContext from '../Contexts/AppContext'; 
import PostPage from "./PostPage";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/Login" />;
  }
  return children;
}

function Main() {
  const [loading, setLoading] = useState(true);
  const { setUser } = useContext(AppContext);  // Removed `user` from destructuring

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('/api/user/init', { 
        headers: { 
          Authorization: `Bearer ${token}` 
        } 
      }).then(response => {
        setUser(response.data.user);
      }).catch(error => {
        localStorage.removeItem('token');
      })
      .finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [setUser]);  // Added setUser as a dependency (optional)

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

          <Route path="Announcement" element={
            <ProtectedRoute>
              <Announcement />
            </ProtectedRoute>
          } />

          <Route path="Marketplace" element={
            <ProtectedRoute>
              <Marketplace />
            </ProtectedRoute>
          } />
          
          <Route path="CreatePost" element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          } />

        </Route>

        <Route path="/Profile/:userId" element={<Profile />}>
          <Route index element={
            <ProtectedRoute>
              <UserPosts/>
            </ProtectedRoute>
            }/>
            
            <Route path="Comments" element={
            <ProtectedRoute>
              <UserComments/>
            </ProtectedRoute>
            }/>

            <Route path="Liked" element={
            <ProtectedRoute>
              <UserLikes/>
            </ProtectedRoute>
            }/>
        </Route>

        <Route path="Post/:postId" element={
          <ProtectedRoute>
            <PostPage/>
          </ProtectedRoute>}>
        </Route>
        
        <Route path="/Login" element={<Entry />}>
          <Route index element={<Login />} />
          <Route path="Signup" element={<Signup />} />
          <Route path="ForgotPassword" element={<Forgot />} />
        </Route>

        <Route path="/verify-email/:verificationToken" element={<VerifyEmail />} />
        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default Main;
