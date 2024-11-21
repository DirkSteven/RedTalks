import React, {useState} from "react";

function HiddenInput({ label, value, onChange }) {

  const [toggleHide, setToggleHide] = useState(false);

  const toggleVisibility = () => {
    setToggleHide(prevState => !prevState);
  };

  return (
    <div className="inputpass">
      <input
        type={toggleHide ? "text" : "password"} 
        placeholder={label}
        value={value}         // Bind the input's value to the parent component's state
        onChange={onChange}   // Pass the onChange handler from the parent
      />
      <button type="button" className='hidechar' onClick={toggleVisibility}>
        {toggleHide ? "Hide" : "Show"} {/* Button text changes based on visibility */}
      </button>
    </div>

  );
}

export default HiddenInput;
