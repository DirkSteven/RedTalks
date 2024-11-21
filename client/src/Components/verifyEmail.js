import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
  const { verificationToken } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!verificationToken) {
      setMessage('Invalid verification token.');
      setLoading(false);
      return;
    }
  
    const verifyEmail = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/user/verify-email/${verificationToken}`);
        setMessage(response.data.message);
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } catch (error) {
        setMessage(error.response?.data?.message || 'An error occurred during verification.');
      } finally {
        setLoading(false);
      }
    };
  
    verifyEmail();
  }, [verificationToken, navigate]);
  

  return (
    <div>
      {loading ? (
        <h2>Verifying your email...</h2>
      ) : (
        <div>
          <h2>{message}</h2>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
