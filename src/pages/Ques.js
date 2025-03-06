import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DialogueBox from '../components/DialogueBox';
import { saveChoice, isSavingAllowed } from '../utils/saveChoice';

const QUESTIONS = [
  {
    id: 1,
    question: "How was your day?",
    options: ["Boring", "Okay", "Good", "Amazing"],
    multiSelect: false
  },
  {
    id: 2,
    question: "Did anything special happen today?",
    options: ["Of cource, Not", "Nothing in particular", "Yes😊", "Absolutely Yes!💯"],
    followUp: {
      "Yes😊": "What was it that made your day special?",
      "Absolutely Yes!💯": "Wow! I'd love to hear what made your day so special!"
    },
    multiSelect: false
  },
  {
    id: 3,
    question: "Did anything make you smile today?",  
    options: ["Not really", "A little", "Yes, a lot!", "Totally!"],
    followUp: {
      "Yes, a lot!": "What made you smile today?",
      "Totally!": "That's great! What brought those smiles?"
    },
    multiSelect: false
  },
  {
    id: 4,
    question: "What was the best part of your day?",  
    options: ["Nothing", "A small moment", "Something exciting", "The whole day!"],
    followUp: {
      "A small moment": "Would you like to share that small moment?",
      "Something exciting": "I'd love to hear about that exciting thing!"
    },
    multiSelect: false
  },
  {
    id: 5,
    question: "What's one thing you're grateful for today?",  
    options: ["Nothing", "A person", "An event", "Everything!"],
    followUp: {
      "A person": "Would you like to share who this person is and how they made your day special?",
      "An event": "Would you like to tell me about this event?",
      "multiple": "Would you like to share more about what you're grateful for?"
    },
    multiSelect: true
  }
];

const Ques = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [followUpAnswers, setFollowUpAnswers] = useState({});
  const [showingFollowUp, setShowingFollowUp] = useState(false);
  const [followUpText, setFollowUpText] = useState('');
  const [askingConsent, setAskingConsent] = useState(false);
  const [pendingFollowUp, setPendingFollowUp] = useState(null);
  const [multiSelectOptions, setMultiSelectOptions] = useState([]);
  
  const handleAnswer = async (answer) => {
    const question = QUESTIONS[currentQuestion];
    
    // Handle multi-select for question 5
    if (question.multiSelect) {
      // Toggle selection
      let updatedSelections;
      if (multiSelectOptions.includes(answer)) {
        updatedSelections = multiSelectOptions.filter(opt => opt !== answer);
      } else {
        // If selecting "Nothing" or "Everything", clear other selections
        if (answer === "Nothing" || answer === "Everything!") {
          updatedSelections = [answer];
        } else {
          // Remove "Nothing" and "Everything!" if present
          const filteredSelections = multiSelectOptions.filter(
            opt => opt !== "Nothing" && opt !== "Everything!"
          );
          updatedSelections = [...filteredSelections, answer];
        }
      }
      
      setMultiSelectOptions(updatedSelections);
      return;
    }
    
    setSelectedAnswers({
      ...selectedAnswers,
      [question.id]: answer
    });
    
    // First check if this question has follow-ups and if the answer has a follow-up question
    if (question.followUp && question.followUp[answer]) {
      // Set up follow-up immediately to avoid delays
      setPendingFollowUp({
        questionId: question.id,
        followUpQuestion: question.followUp[answer]
      });
      setAskingConsent(true);
      
      // Save choice in background without waiting
      if (isSavingAllowed()) {
        saveChoice('ques', question.question, {
          selectedAnswer: answer
        }, true);
      }
      
      return;
    }
    
    // If no follow-up, immediately move to next question
    moveToNextQuestion();
    
    // Save choice in background
    if (isSavingAllowed()) {
      saveChoice('ques', question.question, {
        selectedAnswer: answer
      }, true);
    }
  };

  const handleConsentResponse = (agreed) => {
    // Always set askingConsent to false first to ensure UI updates
    setAskingConsent(false);
    
    if (agreed && pendingFollowUp) {
      // Small timeout to ensure askingConsent UI is cleared first
      setTimeout(() => {
        setShowingFollowUp(true);
        
        // For question 5 with multiple selected options, show the first follow-up (person)
        if (pendingFollowUp.followUpType === 'multiple') {
          setPendingFollowUp({
            ...pendingFollowUp,
            currentPrompt: 'person',
            followUpQuestion: pendingFollowUp.personPrompt
          });
        }
        
        setFollowUpText('');
      }, 50);
    } else {
      moveToNextQuestion();
    }
  };

  const handleFollowUpSubmit = async () => {
    const isMultipleFollowUp = pendingFollowUp && pendingFollowUp.followUpType === 'multiple';
    const isFirstPromptOfMultiple = isMultipleFollowUp && pendingFollowUp.currentPrompt === 'person';
    
    if (pendingFollowUp && followUpText.trim()) {
      // Save the current follow-up answer
      if (isMultipleFollowUp && isFirstPromptOfMultiple) {
        // For the first prompt of multiple follow-ups, save it to a temporary property
        setFollowUpAnswers({
          ...followUpAnswers,
          [`${pendingFollowUp.questionId}-person`]: followUpText
        });
      } else {
        // For single follow-up or the second of multiple follow-ups
        setFollowUpAnswers({
          ...followUpAnswers,
          [pendingFollowUp.questionId]: isMultipleFollowUp 
            ? `Person: ${followUpAnswers[`${pendingFollowUp.questionId}-person`]}\nEvent: ${followUpText}`
            : followUpText
        });
      }
      
      // Save in background with proper parameters for Firebase storing
      if (isSavingAllowed()) {
        // Use specific follow-up question and response for better Firebase storage
        saveChoice('ques', pendingFollowUp.followUpQuestion, {
          response: followUpText,
          followUpQuestion: pendingFollowUp.followUpQuestion,
          questionId: pendingFollowUp.questionId
        }, true);
      }
    }
    
    // If this is the first prompt of multiple, show the second prompt
    if (isMultipleFollowUp && isFirstPromptOfMultiple) {
      setPendingFollowUp({
        ...pendingFollowUp,
        currentPrompt: 'event',
        followUpQuestion: pendingFollowUp.eventPrompt
      });
      setFollowUpText('');
    } else {
      // Otherwise, move to next question
      setShowingFollowUp(false);
      moveToNextQuestion();
    }
  };

  const handleMultiSelectSubmit = () => {
    const question = QUESTIONS[currentQuestion];
    
    if (multiSelectOptions.length === 0) {
      // If nothing selected, default to "Nothing"
      setSelectedAnswers({
        ...selectedAnswers,
        [question.id]: "Nothing"
      });
      
      moveToNextQuestion();
      return;
    }
    
    // Save selections
    setSelectedAnswers({
      ...selectedAnswers,
      [question.id]: multiSelectOptions.join(", ")
    });
    
    // Save choice in background with specific format for multi-select
    if (isSavingAllowed()) {
      saveChoice('ques', question.question, {
        selectedAnswer: multiSelectOptions.join(", "),
        isMultiSelect: true
      }, true);
    }
    
    // Handle follow-ups based on selected options
    const hasPersonOption = multiSelectOptions.includes("A person");
    const hasEventOption = multiSelectOptions.includes("An event");
    
    if (hasPersonOption && hasEventOption) {
      // Set up follow-up for multiple selections
      setPendingFollowUp({
        questionId: question.id,
        followUpType: 'multiple',
        personPrompt: question.followUp["A person"],
        eventPrompt: question.followUp["An event"]
      });
      setAskingConsent(true);
    } else if (hasPersonOption) {
      // Only person selected
      setPendingFollowUp({
        questionId: question.id,
        followUpType: 'person',
        followUpQuestion: question.followUp["A person"]
      });
      setAskingConsent(true);
    } else if (hasEventOption) {
      // Only event selected
      setPendingFollowUp({
        questionId: question.id,
        followUpType: 'event',
        followUpQuestion: question.followUp["An event"]
      });
      setAskingConsent(true);
    } else {
      moveToNextQuestion();
    }
  };

  const moveToNextQuestion = () => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
    setPendingFollowUp(null);
  };
  
  const handleFinish = () => {
    navigate('/feedback'); 
  };

  if (showResults) {
    return (
      <div className="glass-container">
        <h1 className="title">About your day...</h1>
        
        <DialogueBox 
          animal="owl" 
          message={`Thank you for sharing about your day! I hope tomorrow brings even more joy and wonderful moments to celebrate!`}
        />
        
        <div style={{ 
          padding: '20px', 
          borderRadius: '15px', 
          background: 'rgba(255,255,255,0.3)',
          marginBottom: '20px'
        }}>
          {QUESTIONS.map((q) => (
            <div key={q.id} style={{ marginBottom: '15px' }}>
              <p><strong>{q.question}</strong></p>
              <p>
                Your answer: <span style={{ fontWeight: 'bold' }}>
                  {selectedAnswers[q.id]}
                </span>
              </p>
              {followUpAnswers[q.id] && (
                <p>
                  <span style={{ fontStyle: 'italic' }}>"{followUpAnswers[q.id]}"</span>
                </p>
              )}
              {/* If we have person-specific follow-up for question 5 but not the combined one */}
              {!followUpAnswers[q.id] && followUpAnswers[`${q.id}-person`] && (
                <p>
                  <em>{q.followUp["A person"]}</em><br/>
                  <span style={{ fontStyle: 'italic' }}>"{followUpAnswers[`${q.id}-person`]}"</span>
                </p>
              )}
            </div>
          ))}
        </div>
        
        <button className="btn" onClick={handleFinish}>
          Continue to thoughts 💭
        </button>
      </div>
    );
  }

  if (askingConsent) {
    return (
      <div className="glass-container">
        <h1 className="title">May I ask a follow-up?</h1>
        
        <DialogueBox 
          animal="rabbit" 
          message={pendingFollowUp ? pendingFollowUp.followUpQuestion : "Would you like to share more?"}
        >
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '20px', 
            marginTop: '15px' 
          }}>
            <button 
              className="btn" 
              onClick={() => handleConsentResponse(true)}
              style={{ margin: '5px' }}
            >
              Yes, I'll share
            </button>
            <button 
              className="btn" 
              onClick={() => handleConsentResponse(false)}
              style={{ margin: '5px' }}
            >
              I'd rather not
            </button>
          </div>
        </DialogueBox>
      </div>
    );
  }

  if (showingFollowUp) {
    return (
      <div className="glass-container">
        <h1 className="title">Tell me more...</h1>
        
        <DialogueBox 
          animal="fox" 
          message={pendingFollowUp ? pendingFollowUp.followUpQuestion : ""}
        >
          <div style={{ marginTop: '15px' }}>
            <textarea
              value={followUpText}
              onChange={(e) => setFollowUpText(e.target.value)}
              placeholder="Write your answer here..."
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                minHeight: '100px',
                marginBottom: '15px'
              }}
            />
            <button className="btn" onClick={handleFollowUpSubmit}>
              Submit
            </button>
          </div>
        </DialogueBox>
      </div>
    );
  }

  const question = QUESTIONS[currentQuestion];
  
  // Special multi-select UI for question 5
  if (question.multiSelect) {
    return (
      <div className="glass-container">
        <h1 className="title">How was the day?</h1>
        
        <div style={{ textAlign: 'center', margin: '10px 0' }}>
          <span style={{ fontWeight: 'bold' }}>
            Question {currentQuestion + 1} of {QUESTIONS.length}
          </span>
        </div>
        
        <DialogueBox 
          animal="fox" 
          message={`${question.question} (Select all that apply)`}
        >
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '10px', 
            marginTop: '15px' 
          }}>
            {question.options.map((option) => (
              <button
                key={option}
                className="btn"
                onClick={() => handleAnswer(option)}
                style={{ 
                  margin: '5px',
                  background: multiSelectOptions.includes(option) ? '#ff6b6b' : ''
                }}
              >
                {option} {multiSelectOptions.includes(option) ? '✓' : ''}
              </button>
            ))}
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button 
              className="btn" 
              onClick={handleMultiSelectSubmit}
              disabled={multiSelectOptions.length === 0}
              style={{ 
                padding: '10px 30px',
                opacity: multiSelectOptions.length === 0 ? 0.7 : 1 
              }}
            >
              Continue
            </button>
          </div>
        </DialogueBox>
      </div>
    );
  }
  
  return (
    <div className="glass-container">
      <h1 className="title">How was the day?</h1>
      
      <div style={{ textAlign: 'center', margin: '10px 0' }}>
        <span style={{ fontWeight: 'bold' }}>
          Question {currentQuestion + 1} of {QUESTIONS.length}
        </span>
      </div>
      
      <DialogueBox 
        animal="fox" 
        message={question.question}
      >
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '10px', 
          marginTop: '15px' 
        }}>
          {question.options.map((option) => (
            <button
              key={option}
              className="btn"
              onClick={() => handleAnswer(option)}
              style={{ margin: '5px' }}
            >
              {option}
            </button>
          ))}
        </div>
      </DialogueBox>
    </div>
  );
};

export default Ques;
