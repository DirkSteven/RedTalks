import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import PlainInput from '../Components/Text Input/PlainInput';
import HiddenInput  from '../Components/Text Input/HiddenInput';
import './css/landing.css';

function Forgot() {
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [message, setMessage] = useState('');
    
    const navigate = useNavigate();
  
    // Handle email submission for verification code
    const handleEmailSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/user/request-verification-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage(data.message); 
            } else {
                setMessage(data.message);  // Show error message
            }
        } catch (error) {
            setMessage('Error requesting verification code.');
        }
    };

    // Handle password reset with the verification code
    const handleResetSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmNewPassword) {
            return setMessage('Passwords do not match');
        }

        try {
            const response = await fetch('/api/user/reset-password-with-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email, verificationCode, newPassword }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage('Password reset successful');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setMessage(data.message);  
            }
        } catch (error) {
            setMessage('Error resetting password.');
        }
    };

    return (
        <div className="panelform">
            <form onSubmit={handleEmailSubmit}>
                <PlainInput label="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
                <div className="verify">
                <PlainInput label="Verification Code" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} />
                <button id="GetCode" type="submit">Get Code</button>
                </div>
            </form>

            <form onSubmit={handleResetSubmit}>
                <HiddenInput label="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                <HiddenInput label="Confirm New Password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
            </form>
            <div class="forgotsubmit">
            <button type="submit" className='submit reset'>Reset Password</button>
            <Link to="/Login" className='submit cancel'>Cancel</Link>
            </div>
            {message && <p>{message}</p>}
        </div>
    );
}

export default Forgot;
