import React from "react";
import { FaBars } from "react-icons/fa";

function Toggle({onClick}) {
  return (
    <FaBars onClick={onClick} className="toggle"/>
  );
}

export default Toggle;
