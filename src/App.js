import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import pages
import Surprise from './pages/Surprise';
import Quiz from './pages/Quiz';
import ThankYou from './pages/ThankYou';
import Wishing from './pages/Wishing';
import Memories from './pages/Memories';
import Feedback from './pages/Feedback';

function App() {
  return (
    <div className="birthday-app">
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
