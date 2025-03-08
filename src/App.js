import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './auth/AuthContext';
import Login from './auth/login'; 

// Import pages
import Surprise from './pages/Surprise';
import Ques from './pages/Ques';
import ThankYou from './pages/ThankYou';
import WillYou from './pages/WillYou';
import Memories from './pages/Memories';
import Feedback from './pages/Feedback';
import PageDecorations from './components/PageDecorations';

// Improved ViewportContainer with device-adaptive behavior
const ViewportContainer = ({ children }) => {
  const [scale, setScale] = useState('');
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1024);
  
  useEffect(() => {
    const checkViewportSize = () => {
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const contentHeight = document.querySelector('.glass-container')?.scrollHeight || 0;
      
      // Desktop devices (laptops, etc.) shouldn't scale down as aggressively
      if (viewportWidth > 1024) {
        setIsDesktop(true);
        // Only scale if significantly overflowing
        if (contentHeight > viewportHeight * 1.2) {
          setScale('scale-content-sm');
        } else {
          setScale('');
        }
      } 
      // Mobile devices need more aggressive scaling
      else {
        setIsDesktop(false);
        if (contentHeight > viewportHeight * 1.3) {
          setScale('scale-content-xs');
        } else if (contentHeight > viewportHeight * 1.1) {
          setScale('scale-content-sm');
        } else {
          setScale('');
        }
      }
    };
    
    checkViewportSize();
    window.addEventListener('resize', checkViewportSize);
    
    return () => window.removeEventListener('resize', checkViewportSize);
  }, []);
  
  return (
    <div className={`viewport-container ${isDesktop ? 'desktop-view' : 'mobile-view'}`}>
      <div className={`scale-content ${scale}`}>
        {children}
      </div>
    </div>
  );
};

// A protected route component with path tracking
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }
  
  return (
    <ViewportContainer>
      {children}
    </ViewportContainer>
  );
};

function App() {
  useEffect(() => {
    // Load confetti script once when the app starts
    const confettiScript = document.createElement('script');
    confettiScript.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js';
    confettiScript.async = true;
    document.body.appendChild(confettiScript);
    
    return () => {
      // Cleanup
      if (document.body.contains(confettiScript)) {
        document.body.removeChild(confettiScript);
      }
    };
  }, []);

  return (
    <AuthProvider>
      <div className="birthday-app">
        <PageDecorations />
        
        <Router>
          <Routes>
            {/* Make login the default route */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes */}
            <Route path="/ThankYou" element={
              <ProtectedRoute>
                <ThankYou />
              </ProtectedRoute>
            } />
            <Route path="/willyou" element={
              <ProtectedRoute>
                <WillYou />
              </ProtectedRoute>
            } />
            <Route path="/memories" element={
              <ProtectedRoute>
                <Memories />
              </ProtectedRoute>
            } />
            <Route path="/feedback" element={
              <ProtectedRoute>
                <Feedback />
              </ProtectedRoute>
            } />
            <Route path="/ques" element={
              <ProtectedRoute>
                <Ques />
              </ProtectedRoute>
            } />
            <Route path="/surprise" element={
              <ProtectedRoute>
                <Surprise />
              </ProtectedRoute>
            } />
            
            {/* Catch all undefined routes and redirect to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
