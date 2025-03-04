import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DialogueBox from '../components/DialogueBox';

const ThankYou = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Add any initial animations or effects here
    const confetti = document.createElement('script');
    confetti.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js';
    confetti.onload = () => {
      window.confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    };
    document.body.appendChild(confetti);
    
    return () => {
      document.body.removeChild(confetti);
    };
  }, []);
  
  const handleContinue = () => {
    navigate('/wishing');
  };

  return (
    <div className="glass-container">
      <h1 className="title">Happy Birthday Masoom!</h1>
      
      <DialogueBox 
        animal="penguin" 
        message="Welcome to your special birthday surprise! We've put together something just for you."
      />
      
      <div className="floating">
        <img 
          src="/assets/gift-box.png" 
          alt="Birthday gift" 
          style={{ width: '150px', marginBottom: '20px' }}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/150?text=Gift';
          }}
        />
      </div>
      
      <p style={{ textAlign: 'center', fontSize: '1.2rem' }}>
        Thank you for being such an amazing person! This little web adventure is our gift to you.
      </p>
      
      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <button className="btn" onClick={handleContinue}>
          Let's Begin! ✨
        </button>
      </div>
    </div>
  );
};

export default ThankYou;
