import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DialogueBox from '../components/DialogueBox';
import { setSavingPermission } from '../utils/saveChoice';
import { saveConsent } from '../utils/firebaseUtils';

const WillYou = () => {
  const navigate = useNavigate();
  const [choice, setChoice] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleChoice = async (allowed) => {
    setChoice(allowed);
    setSavingPermission(allowed);
    setIsSaving(true);
    
    try {
      // Save consent to the new "consent" collection
      await saveConsent(allowed);
    } catch (error) {
      console.error("Error saving consent:", error);
    } finally {
      setIsSaving(false);
    }
    
    setTimeout(() => {
      navigate('/memories');
    }, 500);
  };

  return (
    <div className="glass-container">
      <h1 className="title">Will You?</h1>
      
      <DialogueBox 
        animal="bunny" 
        message="User, I hope your day is as special as you are! Quick question before we continue, is it okay if Masoom see your choices and answers on this little birthday journey?"
      >
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '15px' }}>
          <button 
            className="btn" 
            onClick={() => handleChoice(true)}
            disabled={choice !== null || isSaving}
          >
            Yes, that's fine! 👍
          </button>
          <button 
            className="btn" 
            onClick={() => handleChoice(false)}
            disabled={choice !== null || isSaving}
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

export default WillYou;
