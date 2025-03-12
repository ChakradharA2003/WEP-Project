import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import UserSignUp from './components/UserSignUp/signUp';
import SpSignUp from './components/SpSignUp/signUp';
import UsersSignIn from './components/UsersSignIn/usersSignIn'; 
import SpSignIn from './components/SpSignIn/spSignIn';
import UsersForgotPassword from './components/UsersForgotPassword/usersForgotPassword';
import SpForgotPassword from './components/SpForgotPassword/spForgotPassword';
import UsersHomePage from './components/UserHomePage/userHomePage';
import SpHomePage from './components/SpHomePage/spHomePage';
import SpResetPassword from './components/SpResetPassword/spResetPassword';
import UserResetPassword from './components/UserResetPassword/userResetPassword';
import UserCreateNewPassword from './components/UserCreateNewPassword/userCreateNewPassword';
import SpCreateNewPassword from './components/SpCreateNewPassword/spCreateNewPassword';
import './App.css';

const  App = () => 
  ( 
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/user-sign-up" element={<UserSignUp />} />
          <Route path="/sp-sign-up" element={<SpSignUp />} />
          <Route path="/user-sign-in" element={<UsersSignIn />} />
          <Route path="/sp-sign-in" element={<SpSignIn />} />
          <Route path="/user-sign-in/forgot-password" element={<UsersForgotPassword />} />
          <Route path="/sp-sign-in/forgot-password" element={<SpForgotPassword />} />
          <Route path="/user/reset-password" element={<UserResetPassword />} />
          <Route path="/sp/reset-password" element={<SpResetPassword />} />
          <Route path="/user/create-new-password" element={<UserCreateNewPassword />} />
          <Route path="/sp/create-new-password" element={<SpCreateNewPassword />} />
          <Route path="/user/home" element={<UsersHomePage />} />
          <Route path="/sp/home" element={<SpHomePage />} />
        </Routes>
      </Router>
    </AuthProvider>
  )


const LandingPage = () => 
   (
    <div className="landing-container">
      <div className="landing-content">
        <h1>Who Are You?</h1>
        <div className="options">
          <Link to="/user-sign-up" className="option-button">
            Customer
          </Link>
          <Link to="/sp-sign-up" className="option-button">
            Service Provider
          </Link>
        </div>
      </div>
    </div>
  );


export default App;