import React from "react";
import { FaArrowTrendUp, FaGraduationCap } from "react-icons/fa6";
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
        <div className="sideitems">
          <div className="profileview">
            <img alt="user pic"></img>
            
          </div>
          <div className="divider"></div>
          <p><FaGraduationCap/>COLLEGE</p>
          <ul>
            <li>Computer Science</li>
            <li>Architecture</li>
            <li>Nursing</li>
            <li>Engineering</li>
          </ul>
          <div className="divider"></div>
          <p><FaArrowTrendUp/>POPULAR THREADS</p>
          <ul>
            <li>Discussion</li>
            <li>Rants</li>
            <li>Announcements</li>
            <li>Memes/Fun</li>
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
