import React from "react";

function HiddenInput ( { label } ){
    return <input type='password' placeholder = { label }></input>;
}

export default HiddenInput;