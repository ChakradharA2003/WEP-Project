import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './signUp.css';

const UserSignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    password: '',
    otp: '',
  });
  const [errors, setErrors] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setServerError('');

    // Validate required fields
    const validationErrors = {};
    if (!formData.firstName) validationErrors.firstName = 'First Name is required';
    if (!formData.email) validationErrors.email = 'Email is required';
    if (!formData.mobile) validationErrors.mobile = 'Mobile is required';
    if (!formData.password) validationErrors.password = 'Password is required';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      // Register user
      const response = await fetch('http://localhost:4000/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        setServerError(data.message || 'Registration failed');
        return;
      }

      // Send OTP
      const otpResponse = await fetch('http://localhost:4000/users/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });

      if (!otpResponse.ok) {
        const data = await otpResponse.json();
        setServerError(data.message || 'Failed to send OTP');
        return;
      }

      setOtpSent(true);
    } catch (error) {
      console.error(error);
      setServerError('An error occurred during registration');
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setErrors({});
    setServerError('');

    try {
      // Verify OTP
      const response = await fetch('http://localhost:4000/users/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email, otp: formData.otp }),
      });

      if (!response.ok) {
        const data = await response.json();
        setServerError(data.message || 'OTP verification failed');
        return;
      }

      // const data = await response.json();
      // login(data.user, data.token);
      navigate('/user-sign-in');
    } catch (error) {
      console.error(error);
      setServerError('An error occurred during OTP verification');
    }
  };

  return (
    <div className="sign-up-container">
      <div className="sign-up-form">
        {!otpSent ? (
          <>
            <h2> Users Sign Up</h2>
            {serverError && <p className="error-message">{serverError}</p>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                {errors.firstName && <p className="warning-message">{errors.firstName}</p>}
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name (Optional)</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <p className="warning-message">{errors.email}</p>}
              </div>
              <div className="form-group">
                <label htmlFor="mobile">Mobile</label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
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
                />
                {errors.password && <p className="warning-message">{errors.password}</p>}
              </div>
              <button type="submit">Sign Up</button>
              <div className="nav-links">
                <a href="/user-sign-in" onClick={() => navigate('/user-sign-in')}>
                  Already have an account? Sign In
                </a>
              </div>
            </form>
          </>
        ) : (
          <form onSubmit={handleVerifyOTP} className="otp-form">
            <h2>User Created Successfully</h2>
            <p className="info-message">We sent an OTP to your registered email for account verification.</p>
            <div className="form-group">
              <label htmlFor="otp">Enter OTP</label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
              />
              {serverError && <p className="error-message">{serverError}</p>}
            </div>
            <button type="submit">Submit</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserSignUp;