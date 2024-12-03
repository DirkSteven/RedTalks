import React from "react";
import { useNavigate } from "react-router-dom";
import Searchbar from "./Searchbar";
import Toggle from "../Buttons/Toggle";
import HeaderButtons from "../Buttons/HeaderButtons";
import RedTalksLogo from "../Assets/RedTalksLogo.png";

function Header({ toggle }) {

  const navigate = useNavigate();

  return (
    <div className="header">
      <div className="headitems">
        <Toggle onClick={toggle}/>
        <div className="logo" onClick={() => navigate('/')}><img src={RedTalksLogo}/></div>
        <Searchbar />
        <HeaderButtons />
      </div>
    </div>
  );
}

export default Header;
