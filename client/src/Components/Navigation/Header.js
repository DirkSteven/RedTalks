import React from "react";
import { useNavigate } from "react-router-dom";
import Searchbar from "./Searchbar";
import Toggle from "../Buttons/Toggle";

function Header({ toggle }) {

  const navigate = useNavigate();

  return (
    <div className="header">
      <div className="headitems">
        <Toggle onClick={toggle}/>
        <div className="logo" onClick={() => navigate('/')}>Logo</div>
        <Searchbar />
        <div className="headbutt">Headerbuttons</div>
      </div>
    </div>
  );
}

export default Header;
