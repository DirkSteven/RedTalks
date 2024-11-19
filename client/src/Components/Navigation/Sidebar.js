import React from "react";
import { Link } from "react-router-dom";

function Sidebar({isCollapsed}) {
  return (
      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <ul>
          <li><Link to='/Login'>Login</Link></li>
          <li><Link to ='/Login/Signup'>Signup</Link></li>
          <li><a>item 3</a></li>
        </ul>
      </div>
  );
}

export default Sidebar;
