import React, { useState,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../context/AuthContext";
import './spSignIn.css';

const SpSignIn = () => {
  const [formData, setFormData] = useState({
    mobile: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setServerError('');

    const validationErrors = {};
    if (!formData.mobile) validationErrors.mobile = 'Mobile is required';
    if (!formData.password) validationErrors.password = 'Password is required';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/sps/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        setServerError(data.message || 'Sign in failed');
        return;
      }

      const data = await response.json();
      login(data.user, data.token);
      navigate('/sp/home'); // Redirect to dashboard or any other protected route
    } catch (error) {
      console.error(error);
      setServerError('An error occurred during sign in');
    }
  };

  return (
    <div className="sign-up-container">
      <div className="sign-up-form">
        <h2>SP Sign In</h2>
        {serverError && <p className="error-message">{serverError}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="mobile">Enter registered mobile number</label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              required
            />
            {errors.mobile && <p className="warning-message">{errors.mobile}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && <p className="warning-message">{errors.password}</p>}
          </div>

          <button type="submit">Sign In</button>

          <div className="nav-links">
            <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
              Create an Account
            </a>
            <a href="/sp-sign-in/forgot-password" onClick={(e) => { e.preventDefault(); navigate('/sp-sign-in/forgot-password'); }}>
              Forgot Password
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SpSignIn;