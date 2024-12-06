import { Link, Outlet, useLocation } from "react-router-dom";

function ProfileNav() {
    const location = useLocation();  // Get current location (pathname)

    // Function to check if the current page matches the link
    const isActive = (path) => location.pathname === path;

    return (
        <>
            <div className="nav profilenav">
                <ul>
                    <li className={isActive("/Profile") ? "active" : ""}>
                        <Link to="/Profile">Posts</Link>
                    </li>
                    <li className={isActive("/Announcement") ? "active" : ""}>
                        <Link to="/Profile/Comments">Comments</Link>
                    </li>
                    <li className={isActive("/Marketplace") ? "active" : ""}>
                        <Link to="/Profile/Liked">Liked Posts</Link>
                    </li>
                </ul>
            </div>
        </>
    );
}

export default ProfileNav;
