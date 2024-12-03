import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaRegBell, FaRegEnvelope } from "react-icons/fa";

function HeaderButtons() {
  const navigate = useNavigate();

  // State to manage dropdown visibility
  const [isBellDropdownOpen, setBellDropdownOpen] = useState(false);
  const [isEnvelopeDropdownOpen, setEnvelopeDropdownOpen] = useState(false);

  // Toggle Bell dropdown visibility
  const toggleBellDropdown = () => {
    setBellDropdownOpen((prevState) => !prevState);
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
            <ul>
              <li>New comment on your post</li>
              <li>Someone liked your post</li>
              <li>New follower</li>
            </ul>
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
