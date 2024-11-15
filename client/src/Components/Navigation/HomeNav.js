import { Link, Outlet } from "react-router-dom";

function HomeNav(){
    return(
        <div className='wall'>
            <div className='nav'>
                <ul>
                    <li>
                        <Link to='/'>Home</Link>
                    </li>
                    <li>
                        <Link to='/Announcement'>Announcement</Link>
                    </li>
                    <li>
                        <Link to='/Marketplace'>Marketplace</Link>
                    </li>
                </ul>
            </div>
            <div className='page'>
                <Outlet/>
            </div>
        </div>
    );
}

export default HomeNav;