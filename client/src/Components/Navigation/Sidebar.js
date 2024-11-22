import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

function Sidebar({isCollapsed}) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/Login');
  };


  return (
      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <ul>
          <li></li>
          <li></li>
          <li><button onClick={logout}>Logout</button></li>
          <li><Link to='/CreatePost'>Create</Link></li>
        </ul>
      </div>
  );
}

export default Sidebar;
