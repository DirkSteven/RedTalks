import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Submit from "../Buttons/Submit";
import PlainInput from "../Text Input/PlainInput";
import HiddenInput from "../Text Input/HiddenInput";

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle email input change
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (error) setError('');
  };

  // Handle password input change
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (error) setError('');
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setLoading(true);


    if (!email || !password) {
      setError("Please enter both email and password.");
      console.log("blank form");
      return;
    }

    setLoading(true);  // Set loading state while submitting the form
    
    console.log('Email:', email); // Debug: log email
    console.log('Password:', password); // Debug: log password

    
    try {
      // Make the POST request to the backend with the email and password
      const response = await axios.post('/api/user/login', {
        email,
        password
      });

      // Handle successful response
      const { token, user } = response.data;

      localStorage.setItem('token', token);

      console.log("Login successful, redirecting...");
      setLoading(false); 
      navigate('/');
      
    } catch (error) {
      // Handle errors from the API (e.g., incorrect credentials)
      setError(error.response?.data?.message || 'An error occurred while logging in');
      setLoading(false);  // Reset loading state if there's an error
    }
};


  return (
    <div className="panelform">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <PlainInput 
          label="Email Address" 
          type="email" 
          value={email} 
          onChange={handleEmailChange} 
        />
        <HiddenInput 
          label="Password" 
          value={password} 
          onChange={handlePasswordChange} 
        />
        <Link to='/Login/ForgotPassword' className="text redirect forgot">Forgot Password?</Link>

        <Submit label="LOGIN"/>
      </form>
      <p className="text">
        Don't have an account?
        <Link to='/Login/Signup' className="text redirect signup"> Sign up here.</Link>
      </p>

      {error && <div className="error">{error}</div>} 
    </div>
  );
}

export default LoginForm;
