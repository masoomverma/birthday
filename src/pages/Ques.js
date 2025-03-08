import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { useNavigate } from 'react-router-dom';
import { questions } from '../data/QuesToAsk';
import DialogueBox from '../components/DialogueBox';
import QuestionDisplay from '../components/QuestionDisplay';
import SummaryView from '../components/SummaryView';

const Ques = () => {
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [completedQuestions, setCompletedQuestions] = useState([]);
  const [showSummary, setShowSummary] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [showingFollowUp, setShowingFollowUp] = useState(false);
  
  // Set initial question
  useEffect(() => {
    setCurrentQuestion(questions[0]);
  }, []);
  
  // Handle when a question is answered
  const handleQuestionAnswered = (answer, followUpResponse = null) => {
    // Add the current question to completed list
    setCompletedQuestions(prev => {
      // Check if we're updating an existing answer
      const existingIndex = prev.findIndex(q => q.questionId === currentQuestion.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          questionId: currentQuestion.id,
          question: currentQuestion.question,
          answer,
          followUpResponse
        };
        return updated;
      } else {
        // Add new answer
        return [...prev, {
          questionId: currentQuestion.id,
          question: currentQuestion.question,
          answer,
          followUpResponse
        }];
      }
    });
    
    // Move to the next question or show summary
    if (questionIndex < questions.length - 1) {
      setQuestionIndex(prev => prev + 1);
      setCurrentQuestion(questions[questionIndex + 1]);
    } else {
      // All questions completed - show summary instead of immediately navigating
      setShowSummary(true);
    }
  };
  
  // Navigate to a specific question from the summary
  const handleNavigateToQuestion = (index) => {
    if (index >= 0 && index < questions.length) {
      setQuestionIndex(index);
      setCurrentQuestion(questions[index]);
      setShowSummary(false);
    }
  };
  
  // Return to previous question
  const handleBack = () => {
    if (questionIndex > 0) {
      setQuestionIndex(prev => prev - 1);
      setCurrentQuestion(questions[questionIndex - 1]);
    }
  };
  
  // Go to next question or show summary if at the end
  const handleNext = () => {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex(prev => prev + 1);
      setCurrentQuestion(questions[questionIndex + 1]);
    } else if (questionIndex === questions.length - 1) {
      // If at the last question, show summary
      setShowSummary(true);
    }
  };
  
  // Handle navigation button clicks
  const handleNavigation = (direction) => {
    if (direction === 'prev') {
      handleBack();
    } else if (direction === 'next') {
      handleNext();
    }
  };

  // Find previously answered question for current index
  const getPreviousAnswer = () => {
    if (!currentQuestion) return null;
    return completedQuestions.find(q => q.questionId === currentQuestion.id);
  };
  
  // Handle follow-up visibility change
  const handleFollowUpShown = (isVisible) => {
    setShowingFollowUp(isVisible);
  };
  
  // Styles for the component with improved responsive design
  const styles = {
    title: {
      textAlign: 'center',
      marginBottom: '12px',
      color: '#333'
    },
    progressBar: {
      width: '100%',
      height: '8px',
      backgroundColor: '#eee',
      borderRadius: '5px',
      marginTop: '15px',
      marginBottom: '10px'
    },
    progressBarFill: {
      width: `${(questionIndex / questions.length) * 100}%`,
      height: '100%',
      backgroundColor: '#ff6b6b',
      borderRadius: '5px',
      transition: 'width 0.5s'
    },
    questionDisplayWrapper: {
      padding: 0,
      margin: '10px auto',
      width: '100%',
      maxWidth: window.innerWidth <= 768 ? '100%' : '750px',
      display: 'flex',
      justifyContent: 'center'
    }
  };
  
  if (!currentQuestion && !showSummary) return <div className="glass-container"><p>Loading questions...</p></div>;

  return (
    <div className="glass-container">
      {!showSummary ? (
        <>
          <h1 className="title" style={styles.title}>Question {questionIndex + 1}/{questions.length}</h1>
          
          <DialogueBox 
            animal={questionIndex % 2 === 0 ? "cat" : "fox"} 
            message={currentQuestion.question}
          />
          
          {/* Add more compact styling to the question display section */}
          <div className="question-display-wrapper" style={styles.questionDisplayWrapper}>
            <QuestionDisplay 
              questionId={currentQuestion.id}
              onAnswer={handleQuestionAnswered}
              previousAnswer={getPreviousAnswer()}
              onFollowUpShown={handleFollowUpShown}
              onNavigate={handleNavigation}
            />
          </div>
          
          {/* Progress bar */}
          <div className="progress-bar" style={styles.progressBar}>
            <div style={styles.progressBarFill}></div>
          </div>
        </>
      ) : (
        <SummaryView 
          completedQuestions={completedQuestions} 
          onNavigateToQuestion={handleNavigateToQuestion}
        />
      )}
    </div>
  );
};

export default Ques;
