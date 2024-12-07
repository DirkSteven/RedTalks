import React, { useState, useEffect, useContext } from "react";
import { FaArrowTrendUp, FaGraduationCap } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import AppContext from '../../Contexts/AppContext'; 
import UserAvatar from '../../Assets/UserAvatar.png';

function Sidebar({ isCollapsed, setSelectedTag, setCampusTag, setDepartmentTag, setNsfw }) {
  const { user, setUser } = useContext(AppContext);
  const [collegeTags, setCollegeTags] = useState([]); 
  const [popularTags, setPopularTags] = useState([]); // State to store popular tags
  const navigate = useNavigate();

  useEffect(() => {
    if (user !== null) {
      // Fetch college tags from the backend only if the user is not null
      axios.get('/api/posts/college-tags')
        .then(response => {
          setCollegeTags(response.data.collegeTags); // Set the college tags in state
        })
        .catch(error => {
          console.error("Error fetching college tags:", error);
        });

      // Fetch popular tags from the backend
      axios.get('/api/posts/popular-tags')
        .then(response => {
          setPopularTags(response.data.popularTags); // Set popular tags in state
        })
        .catch(error => {
          console.error("Error fetching popular tags:", error);
        });
    }
  }, [user]);

  const viewProfile = () => {
    navigate(`/Profile/${user._id}`);
  }

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/Login');
  };

  const handleTagClick = (tag, type) => {
    if (type === 'descriptive') {
        setSelectedTag(tag);
        setCampusTag(null);
        setDepartmentTag(null); 
        setNsfw(null); 
    } else if (type === 'campus') {
        setCampusTag(tag);
        setSelectedTag(null);
        setDepartmentTag(null);
        setNsfw(null);
    } else if (type === 'department') {
        setDepartmentTag(tag);
        setSelectedTag(null);
        setCampusTag(null);
        setNsfw(null); 
    } else if (type === 'nsfw') {
        setNsfw(tag);
        setSelectedTag(null);
        setCampusTag(null);
        setDepartmentTag(null);
    }
};


  // Helper function to capitalize each word in a string
  const capitalizeTag = (tag) => {
    return tag
      .split(' ') // Split by space
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter of each word
      .join(' '); // Join back the words with a space
  };
  
  if (user === null) {
    return <div className="sidebar">Loading user...</div>; // Show a different loading state for user initialization
  }  
  

  if (!user){
    return <div className="sidebar">Loading...</div>;
  }

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sideitems">
        <div className="profileview" onClick={viewProfile}>
          <img alt="pfp" className="user-pic" src={UserAvatar}/>
          <div className="displayName">
            <span>{user.name}</span>
            <p>view profile</p>
          </div>
        </div>
        <div className="divider"></div>

        <p><FaGraduationCap />COLLEGE</p>
        <ul>
          {collegeTags.length > 0 ? (
            // Loop through collegeTags and display only the tag names
            collegeTags.map((tag, index) => (
              <li key={index} onClick={() => handleTagClick(tag.name, 'department')}>{capitalizeTag(tag.name)}</li> // Only show tag name, no post count
            ))
          ) : (
            <li>Loading college tags...</li> // Show loading message while fetching
          )}
        </ul>
        <div className="divider"></div>

        <p><FaArrowTrendUp />POPULAR THREADS</p>
        <ul>
          {popularTags.length > 0 ? (
            // Limit the displayed tags to the first 10
            popularTags.slice(0, 10).map((tag, index) => (
              <li key={index} onClick={() => handleTagClick(tag.name, tag.type)}>{capitalizeTag(tag.name)}</li> // Apply capitalization and display tag names
            ))
          ) : (
            <li>Loading popular tags...</li> // Show loading message while fetching
          )}
        </ul>
        <div className="divider"></div>

        <ul>
          <button onClick={logout}>Logout</button>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
