import React, { useEffect } from 'react';

const PageDecorations = () => {
  useEffect(() => {
    // Let's create a confetti effect with JavaScript
    const confettiFunction = () => {
      if (window.confetti) {
        const end = Date.now() + 3000;
        const colors = ['#ff6b6b', '#ff9eb5', '#ffcd3c', '#6eb6ff'];
        
        (function frame() {
          window.confetti({
            particleCount: 2,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: colors
          });
          window.confetti({
            particleCount: 2,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: colors
          });
          
          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }
        }());
      }
    };
    
    // Only run confetti if the script is loaded
    if (window.confetti) {
      setTimeout(confettiFunction, 1000);
    }
    
    // As a fallback, we can create CSS-based confetti
    const createCssConfetti = () => {
      const confettiContainer = document.createElement('div');
      confettiContainer.className = 'confetti-container';
      confettiContainer.style.position = 'fixed';
      confettiContainer.style.top = '0';
      confettiContainer.style.left = '0';
      confettiContainer.style.width = '100%';
      confettiContainer.style.height = '100%';
      confettiContainer.style.pointerEvents = 'none';
      confettiContainer.style.zIndex = '-1';
      
      // Create 50 confetti elements
      const colors = ['#ff6b6b', '#ff9eb5', '#ffcd3c', '#6eb6ff', '#a5d6a7'];
      for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        const size = Math.random() * 10 + 5;
        
        confetti.style.position = 'absolute';
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.top = `${-20 - Math.random() * 80}%`;
        confetti.style.opacity = '0.7';
        confetti.style.borderRadius = '50%';
        confetti.style.animation = `fall ${Math.random() * 5 + 3}s linear infinite`;
        confetti.style.animationDelay = `${Math.random() * 5}s`;
        
        confettiContainer.appendChild(confetti);
      }
      
      // Add animation
      const style = document.createElement('style');
      style.textContent = `
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); }
          100% { transform: translateY(100vh) rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
      document.body.appendChild(confettiContainer);
      
      return confettiContainer;
    };
    
    // Create CSS confetti as a backup
    const confettiElm = createCssConfetti();
    
    return () => {
      if (confettiElm) {
        document.body.removeChild(confettiElm);
      }
    };
  }, []);

  return (
    <>
      {/* CSS-based balloons - no need for images */}
      <div className="balloon balloon1"></div>
      <div className="balloon balloon2"></div>
      <div className="balloon balloon3"></div>
      <div className="balloon balloon4"></div>
    </>
  );
};

export default PageDecorations;
