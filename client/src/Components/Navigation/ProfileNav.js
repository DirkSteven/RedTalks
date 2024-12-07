import { Link, Outlet, useParams, useLocation } from "react-router-dom";

function ProfileNav() {
    const { userId } = useParams();  // Get userId from the URL
    const location = useLocation();  // Get current location (pathname)

    // Function to check if the current page matches the link
    const isActive = (path) => location.pathname === path;

    return (
        <>
            <div className="nav profilenav">
                <ul>
                    <li className={isActive(`/Profile/${userId}`) ? "active" : ""}>
                        {/* Correctly using backticks to interpolate userId */}
                        <Link to={`/Profile/${userId}`}>Posts</Link>
                    </li>
                    <li className={isActive(`/Profile/${userId}/Comments`) ? "active" : ""}>
                        {/* Correctly using backticks to interpolate userId */}
                        <Link to={`/Profile/${userId}/Comments`}>Comments</Link>
                    </li>
                    <li className={isActive(`/Profile/${userId}/Liked`) ? "active" : ""}>
                        {/* Correctly using backticks to interpolate userId */}
                        <Link to={`/Profile/${userId}/Liked`}>Liked Posts</Link>
                    </li>
                </ul>
            </div>
        </>
    );
}

export default ProfileNav;
