import React, { useEffect, useState } from 'react';
import DialogueBox from '../components/DialogueBox';

const Surprise = () => {
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [activeEffect, setActiveEffect] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    // Check for mobile device
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);
  
  useEffect(() => {
    // Create a big celebration when the page loads
    setTimeout(() => {
      if (window.confetti) {
        const duration = 8 * 1000;
        const animationEnd = Date.now() + duration;
        // Reduce particles for mobile to prevent flickering
        const defaults = { 
          startVelocity: 30, 
          spread: 360, 
          ticks: isMobile ? 40 : 60, 
          zIndex: 0,
          useWorker: true // Use Web Worker when available
        };
        
        function randomInRange(min, max) {
          return Math.random() * (max - min) + min;
        }
        
        const interval = setInterval(function() {
          const timeLeft = animationEnd - Date.now();
          
          if (timeLeft <= 0) {
            return clearInterval(interval);
          }
          
          // Reduce particle count on mobile
          const particleCount = (isMobile ? 30 : 50) * (timeLeft / duration);
          
          // Apply hardware acceleration
          document.body.style.transform = 'translateZ(0)';
          
          // Wait for next frame to avoid overwhelming the browser
          requestAnimationFrame(() => {
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
          });
        }, isMobile ? 350 : 250); // Increase interval for mobile
      }
      
      // Show the final message after some confetti
      setTimeout(() => {
        setShowFinalMessage(true);
      }, 2500);
    }, 1000);
  }, [isMobile]);
  
  const triggerEffect = (effect) => {
    setActiveEffect(effect);
    
    if (effect === 'hearts') {
      
      const createHeartsAtPoint = (x, y) => {
        if (window.confetti) {
          const defaults = { 
            startVelocity: 15, 
            spread: 100, 
            ticks: isMobile ? 35 : 50, 
            zIndex: 0,
            useWorker: true
          };
          // Fewer particles on mobile
          const count = isMobile ? 25 : 50; 
          
          requestAnimationFrame(() => {
            for (let i = 0; i < count; ++i) {
              window.confetti(Object.assign({}, defaults, {
                particleCount: 1,
                origin: {
                  x: x / window.innerWidth,
                  y: y / window.innerHeight
                },
                colors: ['#ff6b6b', '#ff9eb5'],
                shapes: ['heart']
              }));
            }
          });
        }
      };
      
      const button = document.querySelector('.effect-buttons button:first-child');
      const rect = button.getBoundingClientRect();
      const buttonCenterX = rect.left + rect.width / 2;
      const buttonCenterY = rect.top + rect.height / 2;
      createHeartsAtPoint(buttonCenterX, buttonCenterY);
      
      const heartClickHandler = (e) => {
        createHeartsAtPoint(e.clientX, e.clientY);
      };
      
      document.addEventListener('click', heartClickHandler);
      
      setTimeout(() => {
        document.removeEventListener('click', heartClickHandler);
      }, 5000);
    } else if (effect === 'fireworks') {
      
      if (window.confetti) {
        // Increase duration to 10 seconds (6 seconds for mobile)
        const end = Date.now() + (isMobile ? 6 : 10) * 1000;
        
        const colors = ['#ff6b6b', '#ff9eb5', '#ffcd3c', '#6eb6ff', '#a5d6a7'];
        
        // Track last frame time to prevent too frequent updates on low-end devices
        let lastFrameTime = Date.now();
        
        // Detect device performance (rough estimate)
        const isLowPerformanceDevice = 
          navigator.hardwareConcurrency <= 4 || 
          /Android [4-7]/.test(navigator.userAgent);
        
        // Further decrease frame delay for even faster fireworks
        const frameDelay = isMobile ? (isLowPerformanceDevice ? 150 : 100) : 60;
        
        // Adjust particle count based on device capability
        const baseParticleCount = isMobile ? (isLowPerformanceDevice ? 2 : 3) : 5;
        
        // Further increased base velocity for faster movement
        const baseVelocity = isMobile ? (isLowPerformanceDevice ? 40 : 50) : 60;
        
        (function frame() {
          // Apply hardware acceleration
          document.body.style.transform = 'translateZ(0)';
          
          const now = Date.now();
          // Skip frames if running too fast on slower devices
          if (now - lastFrameTime < frameDelay) {
            if (now < end) {
              requestAnimationFrame(frame);
            }
            return;
          }
          
          lastFrameTime = now;
          
          // Use requestAnimationFrame for optimal timing
          requestAnimationFrame(() => {
            // Left side fireworks - increased velocity and adjusted spread
            window.confetti({
              particleCount: baseParticleCount,
              angle: 60,
              spread: 75, // Increased spread
              origin: { x: 0, y: 0.7 },
              colors: colors,
              startVelocity: baseVelocity + Math.random() * 15, // More velocity variation
              useWorker: true
            });
            
            // Right side fireworks - increased velocity and adjusted spread
            window.confetti({
              particleCount: baseParticleCount,
              angle: 120,
              spread: 75, // Increased spread
              origin: { x: 1, y: 0.7 },
              colors: colors,
              startVelocity: baseVelocity + Math.random() * 15, // More velocity variation
              useWorker: true
            });
            
            // Add center fireworks (only on higher-end devices)
            if (!isLowPerformanceDevice) {
              window.confetti({
                particleCount: baseParticleCount - 1,
                angle: 90,
                spread: 90, // Wider spread
                origin: { x: 0.5, y: 0.7 },
                colors: colors,
                startVelocity: baseVelocity + 10,
                useWorker: true
              });
            }
            
            // Increased frequency of higher fireworks for variety
            if (!isMobile && Math.random() > 0.5) { // Increased frequency (was 0.6)
              window.confetti({
                particleCount: baseParticleCount - 1,
                angle: 90,
                spread: 150, // Even wider spread
                origin: { x: Math.random(), y: 0.5 },
                colors: colors,
                startVelocity: baseVelocity + 20, // Higher velocity
                useWorker: true
              });
            }
          });
          
          if (now < end) {
            setTimeout(frame, frameDelay);
          }
        }());
      }
    } else if (effect === 'balloons') {
      
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.top = '0';
      container.style.left = '0';
      container.style.width = '100%';
      container.style.height = '100%';
      container.style.pointerEvents = 'none';
      container.style.zIndex = '10';
      container.style.transform = 'translateZ(0)';
      container.style.willChange = 'transform';
      
      // Fewer balloons on mobile
      const balloonCount = isMobile ? 10 : 20;
      
      for (let i = 0; i < balloonCount; i++) {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        balloon.style.position = 'absolute';
        balloon.style.width = `${Math.random() * 30 + 30}px`;
        balloon.style.height = `${Math.random() * 40 + 40}px`;
        balloon.style.borderRadius = '50% 50% 50% 50% / 40% 40% 60% 60%';
        balloon.style.bottom = '-50px';
        balloon.style.left = `${Math.random() * 100}%`;
        balloon.style.transform = 'translateZ(0)';
        balloon.style.willChange = 'transform';
        
        const colors = [
          'linear-gradient(135deg, #ff9eb5, #ff6b6b)',
          'linear-gradient(135deg, #90caf9, #5c6bc0)',
          'linear-gradient(135deg, #ffcc80, #ff9800)',
          'linear-gradient(135deg, #a5d6a7, #4caf50)',
          'linear-gradient(135deg, #ce93d8, #9c27b0)'
        ];
        balloon.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        const string = document.createElement('div');
        string.style.position = 'absolute';
        string.style.bottom = '-20px';
        string.style.left = '50%';
        string.style.transform = 'translateX(-50%)';
        string.style.width = '1px';
        string.style.height = '20px';
        string.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
        balloon.appendChild(string);
        
        const duration = Math.random() * 5 + 5;
        const delay = Math.random() * 2;
        
        // Use proper CSS animation with hardware acceleration
        balloon.style.animation = `floatUp ${duration}s ease-in ${delay}s forwards`;
        
        container.appendChild(balloon);
      }
      
      const style = document.createElement('style');
      style.textContent = `
        @keyframes floatUp {
          0% { transform: translateY(0) rotate(0deg) translateZ(0); bottom: -50px; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) rotate(${Math.random() > 0.5 ? '+' : '-'}${Math.random() * 360}deg) translateZ(0); bottom: 100%; opacity: 0; }
        }
      `;
      
      document.head.appendChild(style);
      document.body.appendChild(container);
      
      setTimeout(() => {
        document.body.removeChild(container);
        document.head.removeChild(style);
      }, 15000);
    }
    
    setTimeout(() => {
      setActiveEffect(null);
    }, 5000);
  };

  return (
    <div className="glass-container">
      <h1 className="title">The little journey ends here</h1>
      
      {showFinalMessage ? (
        <>
          <DialogueBox 
            animal="lion" 
            message="Congratulations on completing the birthday journey! Here's the final message from Masoom."
          />
          
          <div className="special-message" style={{
            background: 'rgba(255, 255, 255, 0.7)',
            borderRadius: '15px',
            padding: '25px',
            textAlign: 'center',
            margin: '30px 0',
            boxShadow: '0 10px 30px rgba(255, 107, 107, 0.2)',
            animation: 'bounceIn 1s',
            transform: 'translateZ(0)',
            willChange: 'transform, opacity'
          }}>
            <h2 style={{ color: '#ff6b6b' }}>Dear User,</h2>
            <p style={{ fontSize: '1.2rem', lineHeight: '1.6', padding: '10px 20px' }}>
              "On this special day, I want you to know how much joy and happiness you bring to my journey.
              Keep smiling always, and may God bless you with everything you deserve.
              May this new year of your life be filled with laughter, love, and all the beautiful things you wish for!"
            </p>
            <p style={{ fontSize: '1.3rem', fontWeight: 'bold', marginTop: '20px' }}>
              Once again wish you the Happiest Birthday Yrrrr! 🎂
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
                opacity: activeEffect && activeEffect !== 'hearts' ? 0.7 : 1
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
          <p>Preparing some effect you might like...</p>
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
