import React from "react";

function PlainInput({ label, value, onChange, type = "text" }) {
  return (
      <input
        type={type} 
        placeholder={label}
        value={value}          // Bind the input's value to the parent component's state
        onChange={onChange}    // Pass the onChange handler from the parent
      />
  );
}

export default PlainInput;
