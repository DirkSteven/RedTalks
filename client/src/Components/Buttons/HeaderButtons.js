import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaRegBell, FaRegEnvelope } from "react-icons/fa";
import AppContext from '../../Contexts/AppContext';

function HeaderButtons() {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();

  const [openDropdown, setOpenDropdown] = useState(null); // Track the open dropdown
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/notifications/${user._id}`);
      const data = await response.json();
      
      if (response.ok) {
        setNotifications(data.notifications);
      } else {
        console.error("Failed to fetch notifications:", data.message);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle dropdown and ensure only one dropdown is open
  const toggleDropdown = (dropdown) => {
    setOpenDropdown(prev => prev === dropdown ? null : dropdown);
    if (dropdown === "bell" && openDropdown !== "bell") {
      fetchNotifications();
    }
  };

  return (
    <div className="headbutt">
      {/* Create Post Button */}
      <FaPlus
        className="headIcon newpost"
        onClick={() => navigate('/CreatePost')}
      />

      {/* Notification Bell with Dropdown */}
      <FaRegBell
        className={`headIcon bell ${openDropdown === "bell" ? 'open' : ''}`}
        onClick={() => toggleDropdown("bell")}
      />
      {openDropdown === "bell" && (
        <div className={`dropdown-menu bell-dropdown ${openDropdown === "bell" ? 'open' : ''}`}>
          {loading ? (
            <p>Loading notifications...</p>
          ) : (
            <ul>
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <li key={notification._id}>{notification.message}</li>
                ))
              ) : (
                <li>No new notifications</li>
              )}
            </ul>
          )}
        </div>
      )}

      {/* Envelope with Dropdown */}
      <FaRegEnvelope
        className={`headIcon envelope ${openDropdown === "envelope" ? 'open' : ''}`}
        onClick={() => toggleDropdown("envelope")}
      />
      {openDropdown === "envelope" && (
        <div className={`dropdown-menu envelope-dropdown ${openDropdown === "envelope" ? 'open' : ''}`}>
          <ul>
            <li>Messages under maintenance.</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default HeaderButtons;