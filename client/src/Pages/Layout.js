import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import './css/layout.css';
import Header from '../Components/Navigation/Header';
import Sidebar from '../Components/Navigation/Sidebar';
import HomeNav from '../Components/Navigation/HomeNav';

function Layout() {

  const [sidebar, setSidebar] = useState(false);
  
  const toggle = () => {
    setSidebar(prevState => !prevState);
  };

  return (
    <div className="container">

      <Header toggle={toggle}/>
      
      <div className='contents'>

      <Sidebar isCollapsed={sidebar}/>

      <div className={`wall ${sidebar ? 'collapsed' : ''}`}>
      <HomeNav />
        <div className="page">
                  <Outlet />
        </div>
      </div>
     
      </div>
    </div>
  );
}

export default Layout;