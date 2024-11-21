import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Submit from "../Buttons/Submit";
import PlainInput from "../Text Input/PlainInput";
import HiddenInput from "../Text Input/HiddenInput";

function SignupForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
        navigate('/'); // Redirect to home if already logged in
      }
    }, [navigate]);

    const handleSubmit = async (e) => {
      e.preventDefault();

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

        console.log("Signup successful:", response.data);

        if (response.data && response.data.token) {
          const { token, user } = response.data;

          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));

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

    return (
        <div className="panelform">
            <h1>SIGNUP</h1>
            <form onSubmit={handleSubmit}>
                <PlainInput 
                    label="Name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                />
                <PlainInput 
                    label="Email Address" 
                    type="email"
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                />
                <HiddenInput 
                    label="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                />
                <HiddenInput 
                    label="Confirm Password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
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
