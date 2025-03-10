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

// Component styles
const styles = {
  questionContainer: {
    width: '100%',
    margin: '10px 0',
    position: 'relative'
  },
  optionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    margin: '15px auto',
    width: '100%',
    maxWidth: '600px'
  },
  optionCard: {
    background: 'linear-gradient(90deg, rgba(255,107,107,0.8) 0%, rgba(255,143,177,0.8) 100%)',
    color: 'white',
    padding: '12px 15px',
    borderRadius: '20px',
    cursor: 'pointer',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'all 0.2s ease',
    width: '85%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '40px',
    border: '1px solid rgba(255, 255, 255, 0.3)'
  },
  optionContent: {
    fontSize: '1rem',
    fontWeight: 600,
    padding: '2px 4px',
    wordBreak: 'break-word'
  },
  // ...additional styles defined below...
  confirmationDialog: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    background: 'white',
    padding: '15px',
    borderRadius: '10px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    zIndex: 10,
    textAlign: 'center'
  },
  buttonRow: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    marginTop: '10px'
  },
  previousAnswer: {
    background: 'linear-gradient(90deg, rgba(255,107,107,0.15) 0%, rgba(255,143,177,0.15) 100%)',
    padding: '15px',
    borderRadius: '12px',
    textAlign: 'center',
    margin: '15px auto',
    border: '1px solid rgba(255,107,107,0.3)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
  },
  previousResponse: {
    margin: '15px 0',
    fontStyle: 'italic',
    background: 'rgba(255,255,255,0.5)',
    padding: '10px',
    borderRadius: '8px'
  },
  followUpQuestion: {
    margin: '0 0 8px 0',
    fontWeight: 500,
    color: '#666'
  },
  followUpAnswer: {
    margin: 0,
    fontWeight: 400,
    color: '#333'
  },
  changeBtn: {
    background: 'linear-gradient(90deg, rgba(255,107,107,0.8), rgba(255,143,177,0.8))',
    border: 'none',
    color: 'white',
    padding: '12px 20px',
    borderRadius: '20px',
    cursor: 'pointer',
    marginTop: '10px',
    fontSize: '0.9rem',
    transition: 'all 0.2s ease'
  },
  consentContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    margin: '15px 0',
    textAlign: 'center'
  },
  consentText: {
    fontSize: '1.1rem',
    fontWeight: 500,
    margin: '10px 0'
  },
  confirmation: {
    textAlign: 'center',
    padding: '20px'
  },
  navigationSection: {
    marginTop: '20px',
    borderTop: '1px solid #eee',
    paddingTop: '15px'
  },
  navigationControls: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    margin: '0 auto'
  },
  navBtn: {
    background: 'linear-gradient(90deg, #778ca3, #a5b1c2)',
    border: 'none',
    color: 'white',
    padding: '14px 20px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'all 0.2s ease',
    minWidth: '90px'
  },
  nextBtn: {
    background: 'linear-gradient(90deg, rgba(255,107,107,1), rgba(255,143,177,1))'
  },
  optionsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  followUpContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginTop: '12px',
    justifyContent: 'center'
  },
  followUpTextarea: {
    width: '100%',
    padding: '10px',
    borderRadius: '10px',
    border: '1px solid #ddd',
    minHeight: '100px'
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginTop: '10px'
  }
};

// Media query helper for responsive styling with strict mobile/web layouts
const getResponsiveStyle = (baseStyle) => {
  const isMobile = window.innerWidth <= 768;
  let responsiveStyle = {...baseStyle};
  
  if (isMobile) {
    // Case 1: Mobile View - Single column layout
    responsiveStyle.optionsContainer = {
      ...responsiveStyle.optionsContainer,
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%'
    };
    responsiveStyle.optionCard = {
      ...responsiveStyle.optionCard,
      width: '90%',
      maxWidth: '320px',
      margin: '6px auto'
    };
  } else {
    // Case 2: Web View - Two column layout
    responsiveStyle.optionsContainer = {
      ...responsiveStyle.optionsContainer,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: '15px'
    };
    responsiveStyle.optionCard = {
      ...responsiveStyle.optionCard,
      width: '45%',
      maxWidth: '300px',
      margin: '0',
      minHeight: '45px'
    };
  }
  
  return responsiveStyle;
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
  const [responsiveStyles, setResponsiveStyles] = useState(getResponsiveStyle(styles));

  // Update responsive styles on window resize and initial load
  useEffect(() => {
    const handleResize = () => {
      setResponsiveStyles(getResponsiveStyle(styles));
    };
    
    handleResize(); // Call immediately to set initial styles
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
  // ...existing code for handlers...
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

  // RENDER
  return (
    <div style={responsiveStyles.questionContainer}>
      {/* Change confirmation dialog */}
      {showChangeConfirmation && (
        <div style={responsiveStyles.confirmationDialog}>
          <p>Are you sure you want to change your answer?</p>
          <div style={responsiveStyles.buttonRow}>
            <button className="btn" onClick={confirmChange}>Yes, change it</button>
            <button className="btn" onClick={cancelChange}>No, keep it</button>
          </div>
        </div>
      )}
      
      {/* Previous answer display */}
      {renderState === 'previous' && (
        <div style={responsiveStyles.previousAnswer}>
          <p>You selected: <strong>{safeString(selectedOption)}</strong></p>
          
          {previousAnswer.followUpResponse && (
            <div style={responsiveStyles.previousResponse}>
              <p style={responsiveStyles.followUpQuestion}>{safeString(followUpQuestion)}</p>
              <p style={responsiveStyles.followUpAnswer}>"{safeString(previousAnswer.followUpResponse)}"</p>
            </div>
          )}
          
          <div style={responsiveStyles.buttonRow}>
            <button 
              style={responsiveStyles.changeBtn}
              onClick={handleChangeClick}
            >
              Change my answer
            </button>
          </div>
        </div>
      )}
      
      {/* Options selection */}
      {renderState === 'options' && (
        <div style={responsiveStyles.optionsSection}>
          <div style={responsiveStyles.optionsContainer}>
            {question.options.map((option) => (
              <div 
                key={safeString(option)}
                style={{...responsiveStyles.optionCard}}
                onClick={() => handleOptionSelect(option)}
              >
                <div style={responsiveStyles.optionContent}>
                  <span>{safeString(option)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Follow-up consent */}
      {renderState === 'consent' && (
        <div style={responsiveStyles.consentContainer}>
          <p className="selected-option">
            You selected: <strong>{safeString(selectedOption)}</strong>
          </p>
          
          <p style={responsiveStyles.followUpQuestion}>{safeString(followUpQuestion)}</p>
          
          <div style={responsiveStyles.consentText}>Would you like to share more about this?</div>
          
          <div style={responsiveStyles.buttonGroup}>
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
        </div>
      )}
      
      {/* Follow-up input */}
      {renderState === 'followUp' && (
        <div style={responsiveStyles.followUpContainer}>
          <p className="selected-option">
            You selected: <strong>{safeString(selectedOption)}</strong>
          </p>
          
          <p style={responsiveStyles.followUpQuestion}>{safeString(followUpQuestion)}</p>
          
          <textarea
            value={followUpResponse}
            onChange={(e) => setFollowUpResponse(e.target.value)}
            placeholder="Write your answer here..."
            style={responsiveStyles.followUpTextarea}
            disabled={!changeEnabled}
          />
          
          <div style={responsiveStyles.buttonGroup}>
            <button 
              onClick={handleFollowUpSubmit}
              className="btn"
              disabled={!followUpResponse.trim() || !changeEnabled}
              style={{ 
                opacity: (!followUpResponse.trim() || !changeEnabled) ? 0.7 : 1,
                background: 'linear-gradient(90deg, rgba(255,107,107,0.8), rgba(255,143,177,0.8))'
              }}
            >
              Save
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
        </div>
      )}
      
      {/* Confirmation */}
      {renderState === 'confirmation' && (
        <div style={responsiveStyles.confirmation}>
          {/* Empty confirmation section */}
        </div>
      )}
      
      {/* Navigation section */}
      {onNavigate && renderState !== 'consent' && renderState !== 'followUp' && (
        <div style={responsiveStyles.navigationSection}>
          <div style={responsiveStyles.navigationControls}>
            {!isFirstQuestion() && (
              <button 
                style={responsiveStyles.navBtn}
                onClick={() => onNavigate('prev')}
              >
                Previous
              </button>
            )}
            
            {/* Only show Next if previous answer exists or we're in confirmation state */}
            {(previousAnswer || renderState === 'confirmation') && (
              <button 
                style={{...responsiveStyles.navBtn, ...responsiveStyles.nextBtn}}
                onClick={() => onNavigate('next')}
              >
                Next
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionDisplay;
