import './css/layout.css';
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from "../Components/Navigation/Header";
import Sidebar from "../Components/Navigation/Sidebar";
import ProfileNav from '../Components/Navigation/ProfileNav';
import UserAvatar from "../Assets/UserAvatar.png";

function Profile(){

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
                <div className='ProfileDisplay'>
                    <div className='pdname'>
                        <img src={UserAvatar} className='user-pic' alt='pfp'></img>
                        <h3>User Name</h3>
                    </div>
                        <ProfileNav/>
                        <Outlet/>
                </div>
                
            </div>
            
            </div>
        </div>
    );
}

export default Profile;