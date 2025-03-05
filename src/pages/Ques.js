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
    options: ["Of cource, Not", "Nothing in particular", "Yes😊", "Absolutely Yes!💯"]
  },
  {
    id: 3,
    question: "Did anything make you smile today?",  
    options: ["Not really", "A little", "Yes, a lot!", "Totally!"]
  },
  {
    id: 4,
    question: "What was the best part of your day?",  
    options: ["Nothing", "A small moment", "Something exciting", "The whole day!"]
  },
  {
    id: 5,
    question: "What's one thing you're grateful for today?",  
    options: ["Nothing", "A person", "An event", "Everything!"]
  }
];

const Ques = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  
  const handleAnswer = async (answer) => {
    const question = QUESTIONS[currentQuestion];
    const isCorrect = answer === question.correctAnswer;
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    setSelectedAnswers({
      ...selectedAnswers,
      [question.id]: answer
    });
    
    if (isSavingAllowed()) {
      await saveChoice('quiz', question.question, {
        selectedAnswer: answer,
        isCorrect
      }, true);
    }
    
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };
  
  const handleFinish = () => {
    navigate('/feedback'); 
  };

  if (showResults) {
    return (
      <div className="glass-container">
        <h1 className="title"> So your days was...</h1>
        
        <DialogueBox 
          animal="owl" 
          message={`You scored ${score} out of ${QUESTIONS.length}! ${
            score === QUESTIONS.length 
              ? "That's awesome! I'm glad you had a great day. Stay positive for an even better tomorrow!"
              : "Ooo, birthdays can have ups and downs, but let's stay positive and make great memories for the year ahead!"
          }`}
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
                Your answer: <span style={{ 
                  color: selectedAnswers[q.id] === q.correctAnswer ? 'green' : 'red', 
                  fontWeight: 'bold'
                }}>
                  {selectedAnswers[q.id]}
                </span>
              </p>
              {selectedAnswers[q.id] !== q.correctAnswer && (
                <p>Correct answer: <span style={{ color: 'green' }}>{q.correctAnswer}</span></p>
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
