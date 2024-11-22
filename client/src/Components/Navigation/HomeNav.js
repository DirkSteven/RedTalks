import { Link, useLocation } from "react-router-dom";
import { FaHouse, FaBullhorn, FaStore } from "react-icons/fa6";

function HomeNav() {
    const location = useLocation();  // Get current location (pathname)

    // Function to check if the current page matches the link
    const isActive = (path) => location.pathname === path;

    return (
        <>
            <div className="nav">
                <ul>
                    <li className={isActive("/") ? "active" : ""}>
                        <Link to="/"><FaHouse className="homenavicon"/>Home</Link>
                    </li>
                    <li className={isActive("/Announcement") ? "active" : ""}>
                        <Link to="/Announcement"><FaBullhorn className="homenavicon"/>Announcement</Link>
                    </li>
                    <li className={isActive("/Marketplace") ? "active" : ""}>
                        <Link to="/Marketplace"><FaStore className="homenavicon"/>Marketplace</Link>
                    </li>
                </ul>
            </div>
        </>
    );
}

export default HomeNav;
