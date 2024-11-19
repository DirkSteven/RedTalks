import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

function Sidebar({isCollapsed}) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('userToken');
    navigate('/Login');
  };


  return (
      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <ul>
          <li><Link to='/Login'>Login</Link></li>
          <li><Link to ='/Login/Signup'>Signup</Link></li>
          <li><button onClick={logout}>Logout</button></li>
        </ul>
      </div>
  );
}

export default Sidebar;
