import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './login.css';
    
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showPassword, setShowPassword] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Detect mobile devices
  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);
  
  // Auto redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/ThankYou', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Apply hardware acceleration to animations
  useEffect(() => {
    // Add hardware acceleration to animated elements
    document.body.style.transform = 'translateZ(0)';
    
    const balloons = document.querySelectorAll('.balloon');
    const confettis = document.querySelectorAll('.confetti');
    
    // Add will-change and hardware acceleration
    [...balloons, ...confettis].forEach(element => {
      if (element) {
        element.style.willChange = 'transform';
        element.style.transform = 'translateZ(0)';
        // Add additional vendor prefixes for better mobile support
        element.style.webkitTransform = 'translateZ(0)';
        element.style.webkitBackfaceVisibility = 'hidden';
      }
    });
    
    // More aggressive optimization for mobile
    if (isMobile) {
      // Check for low-performance devices (approximation)
      const isLowPerformance = 
        navigator.hardwareConcurrency <= 4 || 
        /Android [4-7]/.test(navigator.userAgent);
      
      // Apply specific Chrome mobile fixes
      if (/Chrome/i.test(navigator.userAgent)) {
        document.body.classList.add('chrome-mobile');
        
        // For very low performance devices, completely disable animations
        if (isLowPerformance) {
          document.body.classList.add('reduce-animations');
          document.querySelectorAll('.balloon, .confetti').forEach(el => {
            el.style.display = 'none';
          });
        } else {
          // Only show bare minimum animations
          const confettiToHide = ['.confetti-2', '.confetti-3', '.confetti-5', '.confetti-6', '.confetti-7'];
          confettiToHide.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
              element.style.display = 'none';
            });
          });
          
          // Keep only 2 balloons
          document.querySelectorAll('.balloon-yellow, .balloon-pink').forEach(el => {
            el.style.display = 'none';
          });
          
          // Make remaining animations less resource-intensive
          const remainingConfetti = document.querySelectorAll('.confetti:not([style*="display: none"])');
          remainingConfetti.forEach(element => {
            element.style.animationDuration = '12s';
            element.style.animationTimingFunction = 'linear';
          });
          
          document.querySelectorAll('.balloon').forEach(balloon => {
            balloon.style.animationDuration = '10s';
            balloon.style.animationTimingFunction = 'ease-in-out';
          });
        }
      }
    }
  }, [isMobile]);

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
      {/* Birthday decorations background - conditionally render fewer elements on mobile */}
      <div className="birthday-decorations">
        <div className="balloon balloon-red"></div>
        <div className="balloon balloon-blue"></div>
        {!isMobile && <div className="balloon balloon-yellow"></div>}
        <div className="balloon balloon-purple"></div>
        {!isMobile && <div className="balloon balloon-pink"></div>}
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
              <div className="password-input-container">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button 
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(prev => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex="-1"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
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
  );
};

export default Login;
