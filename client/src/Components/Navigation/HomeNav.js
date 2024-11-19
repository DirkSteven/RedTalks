import { Link, useLocation } from "react-router-dom";

function HomeNav() {
    const location = useLocation();  // Get current location (pathname)

    // Function to check if the current page matches the link
    const isActive = (path) => location.pathname === path;

    return (
        <>
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
        </>
    );
}

export default HomeNav;
