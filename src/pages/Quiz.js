import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DialogueBox from '../components/DialogueBox';
import { saveChoice, isSavingAllowed } from '../utils/saveChoice';

// Sample quiz questions
const QUESTIONS = [
  {
    id: 1,
    question: "What's Masoom's favorite color?",
    options: ["Blue", "Pink", "Purple", "Green"],
    correctAnswer: "Purple" // Replace with actual answer
  },
  {
    id: 2,
    question: "What's Masoom's favorite food?",
    options: ["Pizza", "Pasta", "Sushi", "Ice Cream"],
    correctAnswer: "Pizza" // Replace with actual answer
  },
  {
    id: 3,
    question: "Which describes Masoom best?",
    options: ["Funny and witty", "Kind and caring", "Creative and artistic", "All of the above"],
    correctAnswer: "All of the above" // Usually the right answer for birthday folks :)
  }
];

const Quiz = () => {
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
    
    // Store selected answer
    setSelectedAnswers({
      ...selectedAnswers,
      [question.id]: answer
    });
    
    // Save to Firebase if allowed
    if (isSavingAllowed()) {
      await saveChoice('quiz', question.question, {
        selectedAnswer: answer,
        isCorrect
      }, true);
    }
    
    // Move to next question or show results
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };
  
  const handleFinish = () => {
    navigate('/home');
  };

  if (showResults) {
    return (
      <div className="glass-container">
        <h1 className="title">Quiz Results! 🎯</h1>
        
        <DialogueBox 
          animal="penguin" 
          message={`You scored ${score} out of ${QUESTIONS.length}! ${
            score === QUESTIONS.length 
              ? "Wow, you know Masoom so well!" 
              : "You're getting to know Masoom better!"
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
          Continue to the Final Surprise! 🎉
        </button>
      </div>
    );
  }

  const question = QUESTIONS[currentQuestion];
  
  return (
    <div className="glass-container">
      <h1 className="title">Birthday Quiz! 🎮</h1>
      
      <div style={{ textAlign: 'center', margin: '10px 0' }}>
        <span style={{ fontWeight: 'bold' }}>
          Question {currentQuestion + 1} of {QUESTIONS.length}
        </span>
      </div>
      
      <DialogueBox 
        animal="bunny" 
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

export default Quiz;
