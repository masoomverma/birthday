import React, { useEffect, useState } from 'react';
import DialogueBox from '../components/DialogueBox';

const Surprise = () => {
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [activeEffect, setActiveEffect] = useState(null);
  
  useEffect(() => {
    // Create a big celebration when the page loads
    setTimeout(() => {
      if (window.confetti) {
        const duration = 8 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
        
        function randomInRange(min, max) {
          return Math.random() * (max - min) + min;
        }
        
        const interval = setInterval(function() {
          const timeLeft = animationEnd - Date.now();
          
          if (timeLeft <= 0) {
            return clearInterval(interval);
          }
          
          const particleCount = 50 * (timeLeft / duration);
          
          // since particles fall down, start a bit higher than random
          window.confetti(Object.assign({}, defaults, { 
            particleCount, 
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            colors: ['#ff6b6b', '#ff9eb5', '#ffcd3c'],
          }));
          window.confetti(Object.assign({}, defaults, { 
            particleCount, 
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            colors: ['#6eb6ff', '#a5d6a7', '#ffcd3c'],
          }));
        }, 250);
      }
      
      // Show the final message after some confetti
      setTimeout(() => {
        setShowFinalMessage(true);
      }, 2500);
    }, 1000);
  }, []);
  
  const triggerEffect = (effect) => {
    setActiveEffect(effect);
    
    if (effect === 'hearts') {
      // Heart effect
      if (window.confetti) {
        const defaults = { startVelocity: 15, spread: 100, ticks: 50, zIndex: 0 };
        const count = 40;
        
        for (let i = 0; i < count; ++i) {
          window.confetti(Object.assign({}, defaults, {
            particleCount: 1,
            origin: {
              x: Math.random(),
              y: Math.random() - 0.2
            },
            colors: ['#ff6b6b', '#ff9eb5'],
            shapes: ['heart']
          }));
        }
      }
    } else if (effect === 'fireworks') {
      // Fireworks effect
      if (window.confetti) {
        const end = Date.now() + 5 * 1000;
        
        const colors = ['#ff6b6b', '#ff9eb5', '#ffcd3c', '#6eb6ff', '#a5d6a7'];
        
        (function frame() {
          window.confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.7 },
            colors: colors
          });
          window.confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.7 },
            colors: colors
          });
          
          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }
        }());
      }
    } else if (effect === 'balloons') {
      // Add more CSS balloons animation
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.top = '0';
      container.style.left = '0';
      container.style.width = '100%';
      container.style.height = '100%';
      container.style.pointerEvents = 'none';
      container.style.zIndex = '10';
      
      for (let i = 0; i < 20; i++) {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        balloon.style.position = 'absolute';
        balloon.style.width = `${Math.random() * 30 + 30}px`;
        balloon.style.height = `${Math.random() * 40 + 40}px`;
        balloon.style.borderRadius = '50% 50% 50% 50% / 40% 40% 60% 60%';
        balloon.style.bottom = '-50px';
        balloon.style.left = `${Math.random() * 100}%`;
        
        // Random balloon color
        const colors = [
          'linear-gradient(135deg, #ff9eb5, #ff6b6b)',
          'linear-gradient(135deg, #90caf9, #5c6bc0)',
          'linear-gradient(135deg, #ffcc80, #ff9800)',
          'linear-gradient(135deg, #a5d6a7, #4caf50)',
          'linear-gradient(135deg, #ce93d8, #9c27b0)'
        ];
        balloon.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        // Add string
        const string = document.createElement('div');
        string.style.position = 'absolute';
        string.style.bottom = '-20px';
        string.style.left = '50%';
        string.style.transform = 'translateX(-50%)';
        string.style.width = '1px';
        string.style.height = '20px';
        string.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
        balloon.appendChild(string);
        
        // Animation
        const duration = Math.random() * 5 + 10;
        const delay = Math.random() * 5;
        balloon.style.animation = `floatUp ${duration}s ease-in ${delay}s forwards`;
        
        container.appendChild(balloon);
      }
      
      // Add animation keyframes
      const style = document.createElement('style');
      style.textContent = `
        @keyframes floatUp {
          0% { transform: translateY(0) rotate(0deg); bottom: -50px; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) rotate(${Math.random() > 0.5 ? '+' : '-'}${Math.random() * 360}deg); bottom: 100%; opacity: 0; }
        }
      `;
      
      document.head.appendChild(style);
      document.body.appendChild(container);
      
      setTimeout(() => {
        document.body.removeChild(container);
        document.head.removeChild(style);
      }, 15000);
    }
    
    // Reset active effect after some time
    setTimeout(() => {
      setActiveEffect(null);
    }, 5000);
  };

  return (
    <div className="glass-container">
      <h1 className="title">Your Special Surprise! 🎉</h1>
      
      {showFinalMessage ? (
        <>
          <DialogueBox 
            animal="lion" 
            message="Congratulations on completing the birthday journey! Here's your final surprise - some special birthday wishes and effects just for you!"
          />
          
          <div className="special-message" style={{
            background: 'rgba(255, 255, 255, 0.7)',
            borderRadius: '15px',
            padding: '25px',
            textAlign: 'center',
            margin: '30px 0',
            boxShadow: '0 10px 30px rgba(255, 107, 107, 0.2)',
            animation: 'bounceIn 1s'
          }}>
            <h2 style={{ color: '#ff6b6b' }}>Dear Masoom,</h2>
            <p style={{ fontSize: '1.2rem', lineHeight: '1.6', padding: '10px 20px' }}>
              "On this special day, I want you to know how much joy and happiness you bring to my journey.
              Keep smiling always, and may God bless you with everything you deserve.
              May this new year of your life be filled with laughter, love, and all the beautiful things you wish for!"
            </p>
            <p style={{ fontSize: '1.3rem', fontWeight: 'bold', marginTop: '20px' }}>
              Once again Happy Birthday! 🎂
            </p>
          </div>
          
          <div className="effect-buttons" style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '15px',
            marginTop: '30px'
          }}>
            <button 
              className="btn" 
              onClick={() => triggerEffect('hearts')}
              disabled={activeEffect === 'hearts'}
              style={{ 
                background: activeEffect === 'hearts' ? '#ff6b6b' : '',
                opacity: activeEffect && activeEffect !== 'hearts' ? 0.7 : 2
              }}
            >
              Show Hearts ❤️
            </button>
            <button 
              className="btn" 
              onClick={() => triggerEffect('fireworks')}
              disabled={activeEffect === 'fireworks'}
              style={{ 
                background: activeEffect === 'fireworks' ? '#ff6b6b' : '',
                opacity: activeEffect && activeEffect !== 'fireworks' ? 0.7 : 1
              }}
            >
              Launch Fireworks 🎆
            </button>
            <button 
              className="btn" 
              onClick={() => triggerEffect('balloons')}
              disabled={activeEffect === 'balloons'}
              style={{ 
                background: activeEffect === 'balloons' ? '#ff6b6b' : '',
                opacity: activeEffect && activeEffect !== 'balloons' ? 0.7 : 1
              }}
            >
              Release Balloons 🎈
            </button>
          </div>
        </>
      ) : (
        <div className="loading-container" style={{ textAlign: 'center', padding: '40px' }}>
          <div className="loading-spinner"></div>
          <p>Preparing your birthday surprise...</p>
        </div>
      )}
      
      <div className="footer-message" style={{
        textAlign: 'center',
        marginTop: '40px',
        fontSize: '1.1rem',
        opacity: 0.8
      }}>
        <p>Made with ❤️ especially for U</p>
      </div>
    </div>
  );
};

export default Surprise;
