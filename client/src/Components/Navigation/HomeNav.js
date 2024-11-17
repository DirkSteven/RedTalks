import { Link, Outlet, useLocation } from "react-router-dom";

function HomeNav() {
    const location = useLocation();  // Get current location (pathname)

    // Function to check if the current page matches the link
    const isActive = (path) => location.pathname === path;

    return (
        <div className="wall">
            <div className="nav">
                <ul>
                    <li className={isActive("/") ? "active" : ""}>
                        <Link to="/">Home</Link>
                    </li>
                    <li className={isActive("/Announcement") ? "active" : ""}>
                        <Link to="/Announcement">Announcement</Link>
                    </li>
                    <li className={isActive("/Marketplace") ? "active" : ""}>
                        <Link to="/Marketplace">Marketplace</Link>
                    </li>
                </ul>
            </div>
            <div className="page">
                <Outlet />
            </div>
        </div>
    );
}

export default HomeNav;
