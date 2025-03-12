import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './signUp.css';

const SpSignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
    service: 'water',
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

    const validationErrors = {};
    if (!formData.name) validationErrors.name = 'Name is required';
    if (!formData.email) validationErrors.email = 'Email is required';
    if (!formData.mobile) validationErrors.mobile = 'Mobile is required';
    if (!formData.service) validationErrors.service = 'Service is required';
    if (!formData.password) validationErrors.password = 'Password is required';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/sps/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        setServerError(data.message || 'Registration failed');
        return;
      }

      const otpResponse = await fetch('http://localhost:4000/sps/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      const response = await fetch('http://localhost:4000/sps/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp: formData.otp }),
      });

      if (!response.ok) {
        const data = await response.json();
        setServerError(data.message || 'OTP verification failed');
        return;
      }

      // const data = await response.json();
      // login(data.user, data.token);
      navigate('/sp-sign-in');
    } catch (error) {
      setServerError('An error occurred during OTP verification');
    }
  };

  return (
    <div className="sign-up-container">
      <div className="sign-up-form">
        {!otpSent ? (
          <>
            <h2>SP Sign Up</h2>
            {serverError && <p className="error-message">{serverError}</p>}
            <form onSubmit={handleSubmit}>
              {/* Name Input */}
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                {errors.name && <p className="warning-message">{errors.name}</p>}
              </div>

              {/* Email Input */}
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && <p className="warning-message">{errors.email}</p>}
              </div>

              {/* Mobile Input */}
              <div className="form-group">
                <label htmlFor="mobile">Mobile</label>
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

              {/* Service Select */}
              <div className="form-group">
                <label htmlFor="service">Service</label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="water">Water</option>
                  <option value="electrician">Electrician</option>
                  <option value="plumber">Plumber</option>
                </select>
                {errors.service && <p className="warning-message">{errors.service}</p>}
              </div>

              {/* Address Textarea (placed last) */}
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  required
                />
                {errors.address && <p className="warning-message">{errors.address}</p>}
              </div>

              {/* Password Input */}
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

              <button type="submit">Sign Up</button>
              <div className="nav-links">
                <a href="/sp-sign-in" onClick={(e) => { e.preventDefault(); navigate('/sp-sign-in'); }}>
                  Already have an account? Sign In
                </a>
              </div>
            </form>
          </>
        ) : (
          <form onSubmit={handleVerifyOTP} className="otp-form">
            <h2>User Created Successfully</h2>
            <p className="info-message">We sent an OTP to your registered email.</p>
            <div className="form-group">
              <label htmlFor="otp">Enter OTP</label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                required
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

export default SpSignUp;