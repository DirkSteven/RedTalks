import React from "react";
import Searchbar from "./Searchbar";
import Toggle from "../Buttons/Toggle";

function Header({ toggle }) {
  return (
    <div className="header">
      <div className="headitems">
        <Toggle onClick={toggle}/>
        <div className="logo">Logo</div>
        <Searchbar />
        <div className="headbutt">Headerbuttons</div>
      </div>
    </div>
  );
}

export default Header;
