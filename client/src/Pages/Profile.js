import './css/layout.css';
import React, { useState, useEffect, useContext } from 'react';
import { useParams, Outlet } from 'react-router-dom'; // Import useParams to get the userId from URL
import Header from "../Components/Navigation/Header";
import Sidebar from "../Components/Navigation/Sidebar";
import ProfileNav from '../Components/Navigation/ProfileNav';
import UserAvatar from "../Assets/UserAvatar.png";
import axios from 'axios';
import AppContext from '../Contexts/AppContext';

function Profile() {
  const { user } = useContext(AppContext);
  const { userId } = useParams(); 
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebar, setSidebar] = useState(false);

  const toggle = () => {
    setSidebar(prevState => !prevState);
  };

  useEffect(() => {
    setLoading(true);

    // Make sure to fetch the profile for the userId from the URL (whether it's the logged-in user or someone else)
    axios.get(`/api/user/${userId}`)
      .then(response => {
        setProfileUser(response.data); // Set the profile data for the userId
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching user profile:', error);
        setLoading(false);
      });
  }, [userId]);  // Dependency on userId, so the effect runs when the userId changes

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container">
      <Header toggle={toggle} />
      <div className='contents'>
        <Sidebar isCollapsed={sidebar} />
        <div className={`wall ${sidebar ? 'collapsed' : ''}`}>
          <div className='ProfileDisplay'>
            <div className='pdname'>
              <img src={profileUser?.imageUrl || UserAvatar} className='user-pic' alt='Profile Picture' />
              <h3>{profileUser?.name || 'Unknown User'}</h3>
            </div>
            <ProfileNav />
            {/* This is where nested routes will render, like UserPosts, UserComments, etc. */}
            <Outlet />  {/* Render the nested routes here */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
