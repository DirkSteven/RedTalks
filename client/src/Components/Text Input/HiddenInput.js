import React from "react";

function HiddenInput({ label, value, onChange }) {
  return (
    <div>
      <input
        type="password"
        placeholder={label}
        value={value}         // Bind the input's value to the parent component's state
        onChange={onChange}   // Pass the onChange handler from the parent
      />
    </div>
  );
}

export default HiddenInput;
