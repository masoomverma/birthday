import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './auth/AuthContext';
import Login from './auth/login'; 
import PullToRefresh from './components/PullToRefresh';

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
  const [isChromeMobile, setIsChromeMobile] = useState(false);
  
  useEffect(() => {
    // Better Chrome mobile detection
    const isChrome = /Chrome/i.test(navigator.userAgent) && /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isChrome) {
      document.body.classList.add('chrome-mobile');
      setIsChromeMobile(true);
      
      // Use a less restrictive approach for fixed positioning to allow refreshes
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
      document.body.style.overflow = 'hidden';
    }

    // Handle page refresh/unload
    const handleBeforeUnload = () => {
      // Reset body styles before page refresh
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.style.overflow = '';
    };

    // Handle browser navigation
    const handlePopState = () => {
      // Reset scroll position on navigation
      window.scrollTo(0, 0);
    };

    // Check viewport size
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
      } else {
        // Mobile devices need more aggressive scaling
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

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('resize', checkViewportSize);

    // Cleanup function
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('resize', checkViewportSize);
    };
  }, []);

  return (
    <div className={`viewport-container ${isDesktop ? 'desktop-view' : 'mobile-view'} ${isChromeMobile ? 'chrome-mobile' : ''}`}>
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

    // Add a global flag to help detect refresh gestures
    window.__enablePullToRefresh = true;

    // Cleanup
    return () => {
      if (document.body.contains(confettiScript)) {
        document.body.removeChild(confettiScript);
      }
    };
  }, []);

  return (
    <AuthProvider>
      <div className="birthday-app">
        <PageDecorations />
        <PullToRefresh /> {/* This is where we use PullToRefresh */}
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
