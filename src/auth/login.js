import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './login.css';
    
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Auto redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/ThankYou', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Handle authentication differently based on whether username is provided
      let success;
      if (username.trim()) {
        success = await login(username, password);
      } else {
        success = await login(password);
      }
      
      if (success) {
        // Always redirect to ThankYou page after successful login
        navigate('/ThankYou', { replace: true });
      } else {
        setError('Incorrect credentials. Please try again.');
      }
    } catch (err) {
      console.error("Login error:", err);
      setError('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Birthday decorations background */}
      <div className="birthday-decorations">
        <div className="balloon balloon-red"></div>
        <div className="balloon balloon-blue"></div>
        <div className="balloon balloon-yellow"></div>
        <div className="balloon balloon-purple"></div>
        <div className="balloon balloon-pink"></div>
        <div className="confetti confetti-1"></div>
        <div className="confetti confetti-2"></div>
        <div className="confetti confetti-3"></div>
        <div className="confetti confetti-4"></div>
        <div className="confetti confetti-5"></div>
        <div className="confetti confetti-6"></div>
        <div className="confetti confetti-7"></div>
        <div className="confetti confetti-8"></div>
      </div>
      
      <div className="square-container">
        <h1 className="login-title">Birthday Journey</h1>
        
        <div className="login-card">
          <div className="gift-icon-container">
            <img 
              src="/assets/gift.png"
              alt="Birthday Gift"
              className="gift-icon"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=Gift'; }}
            />
          </div>
          
          <p className="login-message">
            This special birthday journey is just for you!<br />
            Please enter your credentials to continue.
          </p>
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <div className="input-field">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                  autoFocus
                />
              </div>
              
              <div className="input-field">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>
            
            {error && <p className="error-message">{error}</p>}
            
            <button 
              type="submit" 
              className="login-btn"
              disabled={loading || !username.trim() || !password.trim()}
            >
              {loading ? 'Checking...' : 'Open Gift 🎁'}
            </button>
          </form>
          
          <p className="login-hint">
            Check your messages for login details!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
