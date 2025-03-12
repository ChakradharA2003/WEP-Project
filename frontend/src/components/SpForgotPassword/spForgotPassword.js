import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './spForgotPassword.css';

const SpForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccessMessage('');

    if (!email) {
      setServerError('Email is required');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/sps/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        setServerError(data.message || 'Failed to send OTP');
        return;
      }

      setSuccessMessage('OTP sent successfully');
      navigate('/sp/reset-password', { state: { email } });
    } catch (error) {
      console.error(error);
      setServerError('An error occurred while sending OTP');
    }
  };

  return (
    <div className="sign-up-container">
      <div className="sign-up-form">
        <h2>Reset Password</h2>
        {serverError && <p className="error-message">{serverError}</p>}
        {successMessage && <p className="info-message">{successMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Enter registered email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default SpForgotPassword;