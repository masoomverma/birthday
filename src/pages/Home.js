import React, { useEffect, useState } from 'react';
import DialogueBox from '../components/DialogueBox';

const Home = () => {
  const [showMessage, setShowMessage] = useState(false);
  
  useEffect(() => {
    // Launch confetti effect
    const confetti = document.createElement('script');
    confetti.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js';
    confetti.onload = () => {
      const duration = 15 * 1000;
      const animationEnd = Date.now() + duration;
      
      const randomInRange = (min, max) => Math.random() * (max - min) + min;
      
      const confettiInterval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        
        if (timeLeft <= 0) {
          return clearInterval(confettiInterval);
        }
        
        const particleCount = 50 * (timeLeft / duration);
        
        // since particles fall down, start a bit higher than random
        window.confetti({
          particleCount,
          startVelocity: 30,
          spread: 360,
          origin: {
            x: randomInRange(0.1, 0.9),
            y: Math.random() - 0.2
          }
        });
      }, 250);
    };
    document.body.appendChild(confetti);
    
    // Show message after delay
    setTimeout(() => {
      setShowMessage(true);
    }, 2000);
    
    return () => {
      document.body.removeChild(confetti);
    };
  }, []);
  
  return (
    <div className="glass-container">
      <h1 className="title">Happy Birthday Masoom! 🎂✨</h1>
      
      <div style={{ 
        textAlign: 'center', 
        margin: '20px 0',
        animation: 'fadeIn 2s',
      }}>
        <img 
          src="/assets/birthday-celebration.png" 
          alt="Happy Birthday"
          style={{ width: '250px', maxWidth: '100%' }}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/250?text=Happy+Birthday';
          }}
        />
      </div>
      
      {showMessage && (
        <DialogueBox 
          animal="bear" 
          message="We hope you enjoyed this little birthday adventure! Everyone put a lot of love into creating this for you. You're so special to all of us!"
        >
          <p style={{ textAlign: 'center', fontStyle: 'italic' }}>
            Wishing you the most magical birthday filled with joy, laughter, and wonderful surprises! 💕
          </p>
        </DialogueBox>
      )}
      
      <div style={{ 
        marginTop: '30px',
        padding: '20px',
        background: 'rgba(255,255,255,0.3)',
        borderRadius: '15px',
        textAlign: 'center',
        animation: showMessage ? 'bounceIn 1s' : 'none',
      }}>
        <h2 style={{ marginBottom: '20px' }}>From All of Us:</h2>
        <p style={{ fontSize: '1.2rem', lineHeight: '1.5' }}>
          May this new year of your life bring you endless happiness, amazing opportunities, and all the success you deserve!
        </p>
        <p style={{ marginTop: '20px', fontWeight: 'bold' }}>
          We love you! ❤️
        </p>
      </div>
    </div>
  );
};

export default Home;
