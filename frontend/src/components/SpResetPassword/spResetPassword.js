import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './spResetPassword.css';

const SpResetPassword = () => {
  const [otp, setOtp] = useState('');
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/sp-sign-in/forgot-password');
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!otp) {
      setServerError('OTP is required');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/sps/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      if (!response.ok) {
        const data = await response.json();
        setServerError(data.message || 'OTP verification failed');
        return;
      }

      navigate('/sp/create-new-password', { state: { email } });
    } catch (error) {
      console.error(error);
      setServerError('An error occurred during OTP verification');
    }
  };

  return (
    <div className="sign-up-container">
      <div className="sign-up-form">
        <h2>Enter OTP</h2>
        {serverError && <p className="error-message">{serverError}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="otp">Enter OTP</label>
            <input
              type="text"
              id="otp"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default SpResetPassword;