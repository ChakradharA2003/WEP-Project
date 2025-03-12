import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./UsersSignIn.css";

const UsersSignIn = () => {
  const [formData, setFormData] = useState({
    mobile: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setServerError("");

    const validationErrors = {};
    if (!formData.mobile) validationErrors.mobile = "Mobile is required";
    if (!formData.password) validationErrors.password = "Password is required";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!navigator.geolocation) {
      setServerError("Geolocation is not supported by your browser.");
      return;
    }

    // ✅ Fetch user location before sending login request
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log("📍 Location captured:", latitude, longitude); // ✅ Debugging log

        try {
          const response = await fetch("http://localhost:4000/users/signin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...formData,
              latitude,
              longitude, // ✅ Send location to backend
            }),
          });

          if (!response.ok) {
            const data = await response.json();
            setServerError(data.message || "Sign in failed");
            return;
          }

          const data = await response.json();
          login(data.user, data.token); // ✅ Store user in context, token in cookies
          navigate("/user/home");
        } catch (error) {
          console.error("❌ Error during sign in:", error);
          setServerError("An error occurred during sign in");
        }
      },
      (error) => {
        console.error("❌ Error fetching location:", error);
        setServerError("Location access denied. Please enable location services.");
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <div className="sign-up-container">
      <div className="sign-up-form">
        <h2>Users Sign In</h2>
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
            <a href="/" onClick={(e) => { e.preventDefault(); navigate("/"); }}>
              Create an Account
            </a>
            <a href="/user-sign-in/forgot-password" onClick={(e) => { e.preventDefault(); navigate("/user-sign-in/forgot-password"); }}>
              Forgot Password
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UsersSignIn;
