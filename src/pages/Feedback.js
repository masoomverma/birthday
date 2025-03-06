import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DialogueBox from '../components/DialogueBox';
import { saveFeedback } from '../utils/firebaseUtils';
import { saveChoice } from '../utils/saveChoice';

const Feedback = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showStorageInfo, setShowStorageInfo] = useState(false);
  
  const handleSubmit = async () => {
    if (!message.trim()) return;
    
    setIsSaving(true);
    
    try {
      // Use both saveChoice and direct saveFeedback to ensure data is saved properly
      await saveFeedback(message, '');
      
      // Also save using the standard saveChoice method for consistency
      await saveChoice('feedback', 'User Feedback', {
        message: message,
      }, true);
      
      setShowStorageInfo(true);
      setTimeout(() => {
        navigate('/surprise');
      }, 3000); // Show storage info for 3 seconds before navigating
    } catch (error) {
      console.error("Error saving feedback:", error);
      navigate('/surprise');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleSkip = () => {
    navigate('/surprise');
  };

  return (
    <div className="glass-container">
      <h1 className="title">What are you thinking?</h1>
      
      <DialogueBox 
        animal="owl" 
        message="How was this little web journey? Do you think it was worth Masoom creating this for you?"
      />
      
      <div style={{ marginTop: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <label 
            htmlFor="feedback" 
            style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}
          >
            Would you like to share?
          </label>
          
          <textarea 
            id="feedback"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message here..."
            style={{
              width: '100%',
              padding: '15px',
              borderRadius: '10px',
              border: '1px solid #ddd',
              minHeight: '150px',
              fontSize: '1rem'
            }}
          />
        </div>
        
        {showStorageInfo && (
          <div style={{
            padding: '10px',
            marginTop: '10px',
            backgroundColor: '#e9f5ff',
            border: '1px solid #b3e0ff',
            borderRadius: '5px',
            fontSize: '0.9rem',
          }}>
            <p><strong>Your feedback has been saved to Firebase!</strong></p>
            <p>✅ Saved to: <code>choices/feedback/[timestamp]</code> collection</p>
            <p>✅ Also saved to: <code>feedback</code> collection</p>
            <p>Check it in Firebase console: <code>Authentication &gt; Firestore Database</code></p>
            <p>Redirecting to surprise page...</p>
          </div>
        )}
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '15px', 
          marginTop: '25px' 
        }}>
          <button 
            className="btn"
            onClick={handleSubmit}
            disabled={isSaving || !message.trim()}
            style={{ 
              opacity: (isSaving || !message.trim()) ? 0.7 : 1 
            }}
          >
            {isSaving ? 'Saving...' : 'Send'}
          </button>
          
          <button 
            className="btn"
            onClick={handleSkip}
            style={{ background: '#888' }}
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
