import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DialogueBox from '../components/DialogueBox';
import { setSavingPermission } from '../utils/saveChoice';

const Wishing = () => {
  const navigate = useNavigate();
  const [choice, setChoice] = useState(null);
  
  const handleChoice = (allowed) => {
    setChoice(allowed);
    setSavingPermission(allowed);
    
    // Delay to allow user to see their choice
    setTimeout(() => {
      navigate('/memories');
    }, 1500);
  };

  return (
    <div className="glass-container">
      <h1 className="title">Birthday Wishes! 🎂</h1>
      
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <img 
          src="/assets/cake.png"
          alt="Birthday cake" 
          style={{ width: '200px', maxWidth: '100%' }}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/200?text=Cake';
          }}
        />
      </div>
      
      <DialogueBox 
        animal="bunny" 
        message="U, I hope your day is as special as you are! Quick question before we continue, is it okay if Masoom see your choices and answers on this little birthday journey?"
      >
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '15px' }}>
          <button 
            className="btn" 
            onClick={() => handleChoice(true)}
            disabled={choice !== null}
          >
            Yes, that's fine! 👍
          </button>
          <button 
            className="btn" 
            onClick={() => handleChoice(false)}
            disabled={choice !== null}
            style={{ background: 'linear-gradient(90deg, #a5b1c2, #778ca3)' }}
          >
            I'd rather not 👋
          </button>
        </div>
      </DialogueBox>
      
      {choice !== null && (
        <p style={{ textAlign: 'left', marginTop: '20px', fontStyle: 'italic' }}>
          {choice ? 
            "Thanks! We'll be able to see your choices. Moving to the next page..." :
            "No problem! Your choices will be kept private. Moving to the next page..."}
        </p>
      )}
    </div>
  );
};

export default Wishing;
