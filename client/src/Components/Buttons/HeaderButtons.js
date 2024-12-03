import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaRegBell, FaRegEnvelope } from "react-icons/fa";
import AppContext from '../../Contexts/AppContext'; 

function HeaderButtons() {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();

  const [isBellDropdownOpen, setBellDropdownOpen] = useState(false);
  const [isEnvelopeDropdownOpen, setEnvelopeDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const [loading, setLoading] = useState(false); 

 const fetchNotifications = async () => {
    try {
      setLoading(true);
      // Replace 'userId' with actual logged-in user's ID
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

  // Toggle Bell dropdown visibility
  const toggleBellDropdown = () => {
    setBellDropdownOpen((prevState) => !prevState);

    if (!isBellDropdownOpen) {
      fetchNotifications();
    }
  };

  // Toggle Envelope dropdown visibility
  const toggleEnvelopeDropdown = () => {
    setEnvelopeDropdownOpen((prevState) => !prevState);
  };
  
  
  return (
    <div className="headbutt">
      {/* Create Post Button */}
      <FaPlus
        className="headIcon newpost"
        onClick={() => navigate('/CreatePost')}
      />

      {/* Notification Bell with Dropdown */}
      <div className="dropdown-container">
        <FaRegBell
          className="headIcon bell"
          onClick={toggleBellDropdown}
        />
        {isBellDropdownOpen && (
          <div className="dropdown-menu bell-dropdown">
            {loading ? (
              <p>Loading notifications...</p>
            ) : (
              <ul>
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <li key={notification._id}>
                      {notification.message}
                    </li>
                  ))
                ) : (
                  <li>No new notifications</li>
                )}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Envelope (Messages) with Dropdown */}
      <div className="dropdown-container">
        <FaRegEnvelope
          className="headIcon envelope"
          onClick={toggleEnvelopeDropdown}
        />
        {isEnvelopeDropdownOpen && (
          <div className="dropdown-menu envelope-dropdown">
            <ul>
              <li>Message from John</li>
              <li>New group message</li>
              <li>Message from Admin</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default HeaderButtons;
