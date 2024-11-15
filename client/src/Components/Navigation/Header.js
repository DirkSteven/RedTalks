import React from "react";
import Searchbar from "./Searchbar";
import Toggle from "../Buttons/Toggle";

function Header({ toggleSidebar }) {
  return (
    <div className="header">
      <div className="headitems">
        <Toggle />
        <div className="logo">Logo</div>
        <div><Searchbar /></div>
        <div className="headbutt">Headerbuttons</div>
      </div>
    </div>
  );
}

export default Header;
