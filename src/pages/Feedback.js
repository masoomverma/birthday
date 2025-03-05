import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DialogueBox from '../components/DialogueBox';
import { saveChoice, isSavingAllowed } from '../utils/saveChoice';

const Feedback = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    if (isSavingAllowed()) {
      await saveChoice('feedback', 'birthday message', {
        message,
        rating
      }, true);
    }
    
    setIsSaving(false);
    setSubmitted(true);
    
    setTimeout(() => {
      navigate('/surprise');
    }, 2000);
  };
  
  const renderStars = () => {
    return Array(5).fill(0).map((_, i) => (
      <span 
        key={i} 
        onClick={() => setRating(i + 1)}
        style={{
          cursor: 'pointer',
          fontSize: '2rem',
          color: i < rating ? '#ffc107' : '#e4e5e9'
        }}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="glass-container">
      <h1 className="title">What are you thinking?</h1>
      
      <DialogueBox 
        animal="dog" 
        message="Would you like to share your thoughts? How much did you enjoy this little web journey? Did Masoom's surprise bring a smile to your face?"
      />
      
      {!submitted ? (
        <form onSubmit={handleSubmit} style={{ margin: '20px 0' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Message to Masoom:
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '10px',
                border: '1px solid #ddd',
                resize: 'vertical'
              }}
              placeholder="Write your message here..."
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              How awesome was the surprise?
            </label>
            <div>{renderStars()}</div>
          </div>
          
          <button 
            type="submit" 
            className="btn" 
            disabled={isSaving}
            style={{ width: '100%' }}
          >
            {isSaving ? 'Sending message...' : 'Send Your Message 💫'}
          </button>
        </form>
      ) : (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <h2>Thank you for your message! ❤️</h2>
          <p>Moving to the end...</p>
        </div>
      )}
    </div>
  );
};

export default Feedback;
