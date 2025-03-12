import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './spCreateNewPassword.css';

const SpCreateNewPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [serverError, setServerError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
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

    if (!newPassword || newPassword.length < 6) {
      setServerError('Password must be at least 6 characters long');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/sps/create-new-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
      });

      if (!response.ok) {
        const data = await response.json();
        setServerError(data.message || 'Failed to update password');
        return;
      }

      setShowPopup(true);
      setTimeout(() => {
        navigate('/sp-sign-in');
      }, 5000);
    } catch (error) {
      console.error(error);
      setServerError('An error occurred while updating password');
    }
  };

  return (
    <div className="sign-up-container">
      <div className="sign-up-form">
        <h2>Create new Password</h2>
        {serverError && <p className="error-message">{serverError}</p>}
        {showPopup && (
          <div className="popup-message">
            <p>Password updated successfully. Redirecting to sign-in...</p>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="newPassword">Enter new Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default SpCreateNewPassword;