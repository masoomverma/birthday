import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DialogueBox from '../components/DialogueBox';
import { saveChoice } from '../utils/saveChoice';

const Feedback = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  // Restore message from localStorage on mount
  useEffect(() => {
    const savedMessage = localStorage.getItem('feedback_message');
    if (savedMessage) {
      setMessage(savedMessage);
    }
    
    // Handle beforeunload to ensure proper cleanup
    const handleBeforeUnload = () => {
      if (message.trim()) {
        localStorage.setItem('feedback_message', message);
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Don't remove the saved message on regular component unmount
      // so it's available after reload/refresh
    };
  }, [message]);
  
  // Save message to localStorage whenever it changes
  useEffect(() => {
    if (message.trim()) {
      localStorage.setItem('feedback_message', message);
    }
  }, [message]);
  
  const handleSubmit = async () => {
    if (!message.trim()) return;
    
    setIsSaving(true);
    
    try {
      // Only save feedback once using the saveChoice method
      await saveChoice('feedback', 'User Feedback', {
        message: message,
      }, true);
      
      // Clear local storage after successful submission
      localStorage.removeItem('feedback_message');
      
      // Navigate directly to surprise page - decreased delay from 1000ms to 400ms
      setTimeout(() => {
        navigate('/surprise');
      }, 400);
    } catch (error) {
      console.error("Error saving feedback:", error);
      navigate('/surprise');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleSkip = async () => {
    setIsSaving(true);
    
    try {
      // Save a default message when user skips feedback
      await saveChoice('feedback', 'User Feedback', {
        message: "No feedback provided",
      }, true);
      
      // Clear local storage
      localStorage.removeItem('feedback_message');
      
      // Navigate after a brief delay - keeping this at 300ms since it's already short
      setTimeout(() => {
        navigate('/surprise');
      }, 300);
    } catch (error) {
      console.error("Error saving skip feedback:", error);
      navigate('/surprise');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="question-page"> {/* Added wrapper with question-page class */}
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
              {isSaving ? '...' : 'Send'}
            </button>
            
            <button 
              className="btn"
              onClick={handleSkip}
              disabled={isSaving}
              style={{ background: '#888' }}
            >
              {isSaving ? '...' : 'Skip'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
