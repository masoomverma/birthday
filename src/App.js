import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import pages
import Surprise from './pages/Surprise';
import Quiz from './pages/Quiz';
import ThankYou from './pages/ThankYou';
import Wishing from './pages/Wishing';
import Memories from './pages/Memories';
import Feedback from './pages/Feedback';
import PageDecorations from './components/PageDecorations';

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
    <div className="birthday-app">
      <PageDecorations />
      
      <Router>
        <Routes>
          <Route path="/" element={<ThankYou />} />
          <Route path="/wishing" element={<Wishing />} />
          <Route path="/memories" element={<Memories />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/surprise" element={<Surprise />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
