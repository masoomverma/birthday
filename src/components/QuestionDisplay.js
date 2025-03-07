import React, { useState, useEffect } from 'react';
import { findQuestionById, findFollowUpQuestion } from '../data/QuesToAsk';
import { saveChoice } from '../utils/saveChoice';

// Safe string renderer - never returns React objects
const safeString = (value) => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) return value.map(safeString).join(', ');
  
  try {
    return JSON.stringify(value);
  } catch (e) {
    console.error('Error converting value to string:', e);
    return '[Object]';
  }
};

const QuestionDisplay = ({ questionId, onAnswer, previousAnswer = null, onFollowUpShown, onNavigate }) => {
  // State management
  const [question, setQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [followUpResponse, setFollowUpResponse] = useState('');
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [askingConsent, setAskingConsent] = useState(false);
  const [showChangeConfirmation, setShowChangeConfirmation] = useState(false);
  const [changeEnabled, setChangeEnabled] = useState(false);
  const [followUpQuestion, setFollowUpQuestion] = useState('');

  // Helper to check if this is the first question
  const isFirstQuestion = () => {
    return questionId === 1 || questionId === '1';
  };

  // Load question
  useEffect(() => {
    if (!questionId) return;
    
    const foundQuestion = findQuestionById(questionId);
    if (foundQuestion) {
      setQuestion(foundQuestion);
      
      // Handle previous answers if available
      if (previousAnswer) {
        setSelectedOption(previousAnswer.answer);
        setChangeEnabled(false);
        
        // Load follow-up responses if any
        if (previousAnswer.followUpResponse) {
          const followUp = findFollowUpQuestion(questionId, previousAnswer.answer);
          setFollowUpQuestion(followUp || '');
          setFollowUpResponse(previousAnswer.followUpResponse);
          setShowFollowUp(true);
        }
      } else {
        // Reset for new question
        setSelectedOption(null);
        setFollowUpResponse('');
        setShowFollowUp(false);
        setAskingConsent(false);
        setFollowUpQuestion('');
        setChangeEnabled(true);
      }
    }
  }, [questionId, previousAnswer]);

  // Notify parent when showing follow-up
  useEffect(() => {
    if (onFollowUpShown) {
      onFollowUpShown(showFollowUp || askingConsent);
    }
  }, [showFollowUp, askingConsent, onFollowUpShown]);

  // HANDLERS

  // Handle option selection
  const handleOptionSelect = async (option) => {
    if (!changeEnabled) return;
    
    setSelectedOption(option);
    
    if (!question) return;
    
    // Check if this option has a follow-up question
    const followUp = findFollowUpQuestion(question.id, option);
    
    if (followUp) {
      setFollowUpQuestion(followUp);
      setAskingConsent(true);
      if (onFollowUpShown) onFollowUpShown(true);
    } else {
      await saveChoice('ques', question.question, {
        selectedAnswer: option,
        questionId: question.id
      });
      
      if (onAnswer) onAnswer(option);
    }
  };

  // Handle consent to answer follow-up
  const handleFollowUpConsent = (consent) => {
    setAskingConsent(false);
    
    if (consent) {
      setShowFollowUp(true);
    } else {
      // Skip follow-up and save answer
      saveSkippedFollowUp();
    }
  };

  // Submit follow-up response
  const handleFollowUpSubmit = async () => {
    if (!followUpResponse.trim() || !changeEnabled) return;
    
    console.log(`Submitting follow-up response: "${followUpResponse}" for question ID: ${question.id}`);
    
    try {
      await saveChoice('ques', question.question, {
        selectedAnswer: selectedOption,
        questionId: question.id,
        followUpQuestion: followUpQuestion,
        followUpResponse: followUpResponse // Using consistent naming
      });
      
      if (onAnswer) onAnswer(selectedOption, followUpResponse);
    } catch (error) {
      console.error("Error saving follow-up response:", error);
    }
  };

  // Skip follow-up
  const saveSkippedFollowUp = async () => {
    await saveChoice('ques', question.question, {
      selectedAnswer: selectedOption,
      questionId: question.id,
      skipped: true,
      followUpQuestion: followUpQuestion
    });
    
    if (onAnswer) onAnswer(selectedOption, "I'd rather not 🚫");
  };

  // Handle change button click
  const handleChangeClick = () => {
    setShowChangeConfirmation(true);
  };

  // Confirm change of answer
  const confirmChange = () => {
    setShowChangeConfirmation(false);
    setSelectedOption(null);
    setFollowUpResponse('');
    setShowFollowUp(false);
    setChangeEnabled(true);
  };

  // Cancel change
  const cancelChange = () => {
    setShowChangeConfirmation(false);
  };
  
  // RENDER HELPERS
  
  // Determine current render state
  const getRenderState = () => {
    if (previousAnswer && selectedOption && !changeEnabled) {
      return 'previous';
    }
    
    if (!selectedOption) {
      return 'options';
    }
    
    if (askingConsent) return 'consent';
    if (showFollowUp) return 'followUp';
    
    return 'confirmation';
  };

  // Loading state
  if (!question) return <div>Loading question...</div>;
  
  const renderState = getRenderState();
  const isPreviouslyAnswered = previousAnswer && !changeEnabled;

  // RENDER
  return (
    <div className="question-container">
      {/* Change confirmation dialog */}
      {showChangeConfirmation && (
        <div className="confirmation-dialog">
          <p>Are you sure you want to change your answer?</p>
          <div className="button-row">
            <button className="btn" onClick={confirmChange}>Yes, change it</button>
            <button className="btn" onClick={cancelChange}>No, keep it</button>
          </div>
        </div>
      )}
      
      {/* Previous answer display */}
      {renderState === 'previous' && (
        <div className="previous-answer">
          <p>You selected: <strong>{safeString(selectedOption)}</strong></p>
          
          {previousAnswer.followUpResponse && (
            <div className="previous-response">
              <p className="follow-up-question">{safeString(followUpQuestion)}</p>
              <p className="follow-up-answer">"{safeString(previousAnswer.followUpResponse)}"</p>
            </div>
          )}
          
          <div className="button-row">
            <button 
              className="change-btn"
              onClick={handleChangeClick}
            >
              Change my answer
            </button>
          </div>
        </div>
      )}
      
      {/* Options selection - REMOVE NAVIGATION */}
      {renderState === 'options' && (
        <div className="options-section">
          <div className="options-container">
            {question.options.map((option) => (
              <div 
                key={safeString(option)}
                className="option-card"
                onClick={() => handleOptionSelect(option)}
              >
                <div className="option-content">
                  <span>{safeString(option)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Follow-up consent - REMOVE NAVIGATION */}
      {renderState === 'consent' && (
        <div className="consent-container">
          <p className="selected-option">
            You selected: <strong>{safeString(selectedOption)}</strong>
          </p>
          
          <p className="follow-up-question">{safeString(followUpQuestion)}</p>
          
          <div className="consent-text">Would you like to share more about this?</div>
          
          <div className="button-group">
            <button 
              onClick={() => handleFollowUpConsent(true)}
              className="btn"
              style={{ 
                background: 'linear-gradient(90deg, rgba(255,107,107,0.8), rgba(255,143,177,0.8))'
              }}
            >
              Yes, I'll share
            </button>
            
            <button
              onClick={() => handleFollowUpConsent(false)}
              className="btn"
              style={{ 
                background: 'linear-gradient(90deg, #778ca3, #a5b1c2)'
              }}
            >
              I'd rather not
            </button>
          </div>
          
          {/* Remove navigation controls that were here */}
        </div>
      )}
      
      {/* Follow-up input - REMOVE NAVIGATION */}
      {renderState === 'followUp' && (
        <div className="follow-up-container">
          <p className="selected-option">
            You selected: <strong>{safeString(selectedOption)}</strong>
          </p>
          
          <p className="follow-up-question">{safeString(followUpQuestion)}</p>
          
          <textarea
            value={followUpResponse}
            onChange={(e) => setFollowUpResponse(e.target.value)}
            placeholder="Write your answer here..."
            className="follow-up-textarea"
            disabled={!changeEnabled}
          />
          
          <div className="button-group">
            <button 
              onClick={handleFollowUpSubmit}
              className="btn"
              disabled={!followUpResponse.trim() || !changeEnabled}
              style={{ 
                opacity: (!followUpResponse.trim() || !changeEnabled) ? 0.7 : 1,
                background: 'linear-gradient(90deg, rgba(255,107,107,0.8), rgba(255,143,177,0.8))'
              }}
            >
              Send
            </button>
            
            <button
              onClick={saveSkippedFollowUp}
              className="btn"
              disabled={!changeEnabled}
              style={{ 
                opacity: !changeEnabled ? 0.7 : 1,
                background: 'linear-gradient(90deg, #778ca3, #a5b1c2)'
              }}
            >
              I'd rather not share
            </button>
          </div>
          
          {/* Remove navigation controls that were here */}
        </div>
      )}
      
      {/* Confirmation - Remove the saved message */}
      {renderState === 'confirmation' && (
        <div className="confirmation">
          {/* Remove the "Your answer has been saved!" message */}
        </div>
      )}
      
      {/* Add dedicated navigation section at the bottom - don't show during follow-up or consent */}
      {onNavigate && renderState !== 'consent' && renderState !== 'followUp' && (
        <div className="navigation-section">
          <div className="navigation-controls">
            {!isFirstQuestion() && (
              <button 
                className="nav-btn"
                onClick={() => onNavigate('prev')}
              >
                Previous
              </button>
            )}
            
            {/* Only show Next if previous answer exists or we're in confirmation state */}
            {(previousAnswer || renderState === 'confirmation') && (
              <button 
                className="nav-btn next-btn"
                onClick={() => onNavigate('next')}
              >
                Next
              </button>
            )}
          </div>
        </div>
      )}
      
      <style jsx>{`
        .question-container {
          width: 100%;
          margin: 15px 0;
          position: relative;
        }
        
        .options-container {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          margin: 10px auto;
          justify-content: center;
          max-width: 1000px;
        }
        
        .option-card {
          background: linear-gradient(90deg, rgba(255,107,107,0.8) 0%, rgba(255,143,177,0.8) 100%);
          color: white;
          padding: 8px 12px;
          border-radius: 25px;
          cursor: pointer;
          text-align: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: all 0.2s ease;
          width: 20rem;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 40px;
          margin: 0 auto;
        }
        
        .option-content {
          font-size: 1.1rem;
          font-weight: 500;
        }
        
        .follow-up-container {
          display: flex;
          flex-direction: column;
          gap: 10px;
          gap: 15px;
          margin-top: 12px;
          justify-content: center;
        }
        
        .confirmation-dialog {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          background: white;
          padding: 15px;
          border-radius: 10px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          z-index: 10;
          text-align: center;
        }
        
        .button-row {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin-top: 10px;
        }
        
        .previous-answer {
          background: linear-gradient(90deg, rgba(255,107,107,0.15) 0%, rgba(255,143,177,0.15) 100%);
          padding: 15px;
          border-radius: 12px;
          text-align: center;
          margin: 15px auto;
          border: 1px solid rgba(255,107,107,0.3);
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        
        .previous-response {
          margin: 15px 0;
          font-style: italic;
          background: rgba(255,255,255,0.5);
          padding: 10px;
          border-radius: 8px;
        }
        
        .follow-up-question {
          margin: 0 0 8px 0;
          font-weight: 500;
          color: #666;
        }
        
        .follow-up-answer {
          margin: 0;
          font-weight: 400;
          color: #333;
        }
        
        .change-btn {
          background: linear-gradient(90deg, rgba(255,107,107,0.8), rgba(255,143,177,0.8));
          border: none;
          color: white;
          padding: 12px 20px;
          border-radius: 20px;
          cursor: pointer;
          margin-top: 10px;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }
        
        .change-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 3px 6px rgba(0,0,0,0.1);
          background: linear-gradient(90deg, rgba(255,107,107,1), rgba(255,143,177,1));
        }
        
        .consent-container {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin: 15px 0;
          text-align: center;
        }
        
        .consent-text {
          font-size: 1.1rem;
          font-weight: 500;
          margin: 10px 0;
        }
        
        .confirmation {
          text-align: center;
          padding: 20px;
        }
        
        .navigation-controls {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-top: 15px;
          flex-wrap: wrap;
        }
        
        .nav-btn {
          background: linear-gradient(90deg, #778ca3, #a5b1c2);
          border: none;
          color: white;
          padding: 14px 20px;
          border-radius: 20px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s ease;
          min-width: 90px;
        }
        
        .next-btn {
          background: linear-gradient(90deg, rgba(255,107,107,1), rgba(255,143,177,1));
        }
        
        .nav-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 3px 6px rgba(0,0,0,0.1);
        }
        
        .options-section {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .navigation-section {
          margin-top: 20px;
          border-top: 1px solid #eee;
          padding-top: 15px;
        }
        
        .navigation-controls {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin: 0 auto;
        }
        
        /* For mobile screens */
        @media (max-width: 480px) {
          .options-container {
            grid-template-columns: 1fr;
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default QuestionDisplay;
