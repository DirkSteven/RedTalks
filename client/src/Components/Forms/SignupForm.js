import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Submit from "../Buttons/Submit";
import PlainInput from "../Text Input/PlainInput";
import HiddenInput from "../Text Input/HiddenInput";
import AppContext from '../../Contexts/AppContext';

function SignupForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { user, setUser } = useContext(AppContext); 
    const navigate = useNavigate();

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
        navigate('/');
      }
    }, [navigate]);

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (loading) return;

      if (!name || !email || !password || !confirmPassword) {
        setError("Please fill out all fields.");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      setLoading(true);
      setError('');

      try {
        const response = await axios.post('/api/user/register', {
          name,
          email,
          password,
        });

        if (response.data && response.data.token) {
          const { token } = response.data;

          localStorage.setItem('token', token);
          setUser(user);

          navigate('/');
          setError('');
        } else {
          throw new Error('Signup failed: no token in response');
        }

      } catch (error) {
        console.log("Error during signup:", error);
        setError(error.response?.data?.message || 'An error occurred during signup');
      } finally {
        setLoading(false);
      }
    };

    const handleInputChange = (setter) => (e) => {
      setter(e.target.value);
      if (error) setError(''); // Clear the error if the user starts typing again
    };

    return (
        <div className="panelform">
          <h1>SIGNUP</h1>
          <form onSubmit={handleSubmit}>
            <PlainInput 
              label="Name" 
              value={name} 
              onChange={handleInputChange(setName)} 
            />
            <PlainInput 
              label="Email Address" 
              type="email"
              value={email} 
              onChange={handleInputChange(setEmail)} 
            />
            <HiddenInput 
              label="Password" 
              value={password} 
              onChange={handleInputChange(setPassword)} 
            />
            <HiddenInput 
              label="Confirm Password" 
              value={confirmPassword} 
              onChange={handleInputChange(setConfirmPassword)} 
            />

            {error && <div className="error">{error}</div>}

            <Submit label="SIGNUP" disabled={loading} />
          </form>

          <p className="text">
              Already have an account?
              <Link to="/Login" className="text redirect signup"> Log in here.</Link>
          </p>
        </div>
    );
}

export default SignupForm;
