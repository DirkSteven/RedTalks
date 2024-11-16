import React, { useState } from 'react';
import './css/layout.css';
import Header from '../Components/Navigation/Header';
import Sidebar from '../Components/Navigation/Sidebar';
import HomeNav from '../Components/Navigation/HomeNav';

function Layout() {

  return (
    <div className="container">

      <Header/>
      
      <div className='contents'>

      <Sidebar/>

      <HomeNav />
      
      </div>
    </div>
  );
}

export default Layout;
