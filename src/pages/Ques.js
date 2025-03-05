import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DialogueBox from '../components/DialogueBox';
import { saveChoice, isSavingAllowed } from '../utils/saveChoice';

const QUESTIONS = [
  {
    id: 1,
    question: "How was your day?",
    options: ["Boring", "Okay", "Good", "Amazing"]
  },
  {
    id: 2,
    question: "Did anything special happen today?",
    options: ["Of cource, Not", "Nothing in particular", "Yes😊", "Absolutely Yes!💯"],
    followUp: {
      "Yes😊": "What was it that made your day special?",
      "Absolutely Yes!💯": "Wow! I'd love to hear what made your day so special!"
    }
  },
  {
    id: 3,
    question: "Did anything make you smile today?",  
    options: ["Not really", "A little", "Yes, a lot!", "Totally!"],
    followUp: {
      "Yes, a lot!": "What made you smile today?",
      "Totally!": "That's great! What brought those smiles?"
    }
  },
  {
    id: 4,
    question: "What was the best part of your day?",  
    options: ["Nothing", "A small moment", "Something exciting", "The whole day!"],
    followUp: {
      "A small moment": "Would you like to share that small moment?",
      "Something exciting": "I'd love to hear about that exciting thing!"
    }
  },
  {
    id: 5,
    question: "What's one thing you're grateful for today?",  
    options: ["Nothing", "A person", "An event", "Everything!"],
    followUp: {
      "A person": "Would you like to share who this person is and how they made your day special?",
      "An event": "Would you like to tell me about this event?"
    }
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
  
  const handleAnswer = async (answer) => {
    const question = QUESTIONS[currentQuestion];
    
    setSelectedAnswers({
      ...selectedAnswers,
      [question.id]: answer
    });
    
    if (isSavingAllowed()) {
      await saveChoice('ques', question.question, {
        selectedAnswer: answer
      }, true);
    }

    if (question.followUp && question.followUp[answer]) {
      setAskingConsent(true);
      setPendingFollowUp({
        questionId: question.id,
        followUpQuestion: question.followUp[answer]
      });
      return;
    }
    
    moveToNextQuestion();
  };

  const handleConsentResponse = (agreed) => {
    setAskingConsent(false);
    
    if (agreed && pendingFollowUp) {
      setShowingFollowUp(true);
      setFollowUpText('');
    } else {
      moveToNextQuestion();
    }
  };

  const handleFollowUpSubmit = async () => {
    if (pendingFollowUp && followUpText.trim()) {
      setFollowUpAnswers({
        ...followUpAnswers,
        [pendingFollowUp.questionId]: followUpText
      });
      
      if (isSavingAllowed()) {
        await saveChoice('ques', pendingFollowUp.followUpQuestion, {
          response: followUpText
        }, true);
      }
    }
    
    setShowingFollowUp(false);
    moveToNextQuestion();
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
                  <em>{q.followUp[selectedAnswers[q.id]]}</em><br/>
                  <span style={{ fontStyle: 'italic' }}>"{followUpAnswers[q.id]}"</span>
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
            <button className="btn" onClick={() => handleConsentResponse(true)}>
              Yes, I'll share
            </button>
            <button className="btn" onClick={() => handleConsentResponse(false)}>
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
