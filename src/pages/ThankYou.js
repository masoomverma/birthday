import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DialogueBox from '../components/DialogueBox';

const ThankYou = () => {
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);
  
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
    setIsNavigating(true);
    setTimeout(() => {
      navigate('/willyou');
    }, 300);
  };
  
  return (
    <div className="question-page"> {/* Added wrapper div with question-page class */}
      <div className="glass-container" style={{ margin: '0 auto' }}> {/* Force centering with inline style */}
        <h1 className="title">Thank You For Coming!</h1>
        
        <DialogueBox 
          animal="dog" 
          message={
          <p>
            Before the day ends, let's go on a little journey! And let's start your New Year with this little journey too! ✨<br/>
            <strong>And</strong> Masoom has something to say.
          </p>
          }
        />
        
        {/* Content centered for better appearance */}
        <div style={{ 
          marginTop: '30px', 
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <p style={{ 
            fontSize: '1.2rem', 
            lineHeight: 1.6,
            margin: '15px 0 25px',
            textAlign: 'center'
          }}>
            Thank you for being such an <strong>amazing person!</strong> and also thank you for being my <strong>best friend</strong>. I am truly glad to have you as a <strong>friend</strong>. Keep smiling, as your name means '<strong>one who smiles</strong>'!
          </p>
          
          <button 
            className="btn" 
            onClick={handleContinue}
            disabled={isNavigating}
            style={{ 
              minWidth: '150px',
              opacity: isNavigating ? 0.7 : 1
            }}
          >
            {isNavigating ? 'Loading...' : "Let's Begin! ✨"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
