import React, { useState, useEffect, useContext } from "react";
import { FaArrowTrendUp, FaGraduationCap } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AppContext from '../../Contexts/AppContext'; 

function Sidebar({ isCollapsed }) {
  const { user } = useContext(AppContext);
  const [collegeTags, setCollegeTags] = useState([]); 
  const [popularTags, setPopularTags] = useState([]); // State to store popular tags
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch college tags from the backend
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
      
  }, [user]);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/Login');
  };

  // Helper function to capitalize each word in a string
  const capitalizeTag = (tag) => {
    return tag
      .split(' ') // Split by space
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter of each word
      .join(' '); // Join back the words with a space
  };
  
  if (!user) {
    return <div>Loading...</div>;
  }
  

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sideitems">
        <div className="profileview">
        <img alt="user pic" className="user-pic" />
        <span className="user-name">{user.name}</span>
        </div>
        <div className="divider"></div>

        <p><FaGraduationCap />COLLEGE</p>
        <ul>
          {collegeTags.length > 0 ? (
            // Loop through collegeTags and display only the tag names
            collegeTags.map((tag, index) => (
              <li key={index}>{capitalizeTag(tag.name)}</li> // Only show tag name, no post count
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
              <li key={index}>{capitalizeTag(tag.name)}</li> // Apply capitalization and display tag names
            ))
          ) : (
            <li>Loading popular tags...</li> // Show loading message while fetching
          )}
        </ul>
        <div className="divider"></div>

        <ul>
          <li></li>
          <li></li>
          <li><button onClick={logout}>Logout</button></li>
          <li><Link to='/CreatePost'>Create</Link></li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
