import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import './css/layout.css';
import Header from '../Components/Navigation/Header';
import Sidebar from '../Components/Navigation/Sidebar';
import HomeNav from '../Components/Navigation/HomeNav';

function Layout() {

  const [sidebar, setSidebar] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const [campusTag, setCampusTag] = useState(null);
  const [departmentTag, setDepartmentTag] = useState(null);
  const [nsfw, setNsfw] = useState(null);
  
  const toggle = () => {
    setSidebar(prevState => !prevState);
  };

  return (
    <div className="container">

      <Header toggle={toggle}/>
      
      <div className='contents'>

        <Sidebar  isCollapsed={sidebar}
          setSelectedTag={setSelectedTag}
          setCampusTag={setCampusTag}
          setDepartmentTag={setDepartmentTag}
          setNsfw={setNsfw} />

        <div className={`wall ${sidebar ? 'collapsed' : ''}`}>
          <HomeNav />
          <div className="page">
            <Outlet context={{ selectedTag, campusTag, departmentTag, nsfw }}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;