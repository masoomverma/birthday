import React from 'react';
import { useNavigate } from 'react-router-dom';

const SummaryView = ({ completedQuestions, onNavigateToQuestion }) => {
  const navigate = useNavigate();

  return (
    <div className="summary-container">
      <h2 className="summary-title">Your Journey Summary</h2>
      
      <div className="summary-list">
        {completedQuestions.map((question, index) => (
          <div key={index} className="summary-item">
            <div className="question-header">
              <h3>Question {index + 1}</h3>
              <button 
                className="edit-btn" 
                onClick={() => onNavigateToQuestion(index)}
              >
                Edit
              </button>
            </div>
            
            <p className="question-text">{question.question}</p>
            <p className="answer-text">
              Your answer: <strong>{question.answer}</strong>
            </p>
            
            {question.followUpResponse && (
              <div className="follow-up-box">
                <p className="follow-up-text">
                  <span className="follow-up-label">You shared:</span> 
                  <span className="follow-up-response">"{question.followUpResponse}"</span>
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="navigation-section">
        <button 
          className="nav-btn"
          onClick={() => onNavigateToQuestion(completedQuestions.length - 1)}
        >
          Previous
        </button>
        
        <button 
          className="nav-btn thoughts-btn"
          onClick={() => navigate('/feedback')}
        >
          To Thoughts 💭
        </button>
      </div>
      
      <style jsx>{`
        .summary-container {
          width: 100%;
          margin: 15px auto;
        }
        
        .summary-title {
          text-align: center;
          margin-bottom: 20px;
          color: #ff6b6b;
        }
        
        .summary-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .summary-item {
          background: linear-gradient(90deg, rgba(255,107,107,0.1), rgba(255,143,177,0.1));
          padding: 15px;
          border-radius: 12px;
          border: 1px solid rgba(255,107,107,0.3);
        }
        
        .question-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        
        .question-header h3 {
          margin: 0;
          color: #444;
        }
        
        .edit-btn {
          background: linear-gradient(90deg, #778ca3, #a5b1c2);
          border: none;
          color: white;
          padding: 5px 15px;
          border-radius: 20px;
          cursor: pointer;
          font-size: 0.8rem;
        }
        
        .question-text {
          font-weight: 500;
          margin: 0 0 10px 0;
        }
        
        .answer-text {
          margin: 0 0 10px 0;
        }
        
        .follow-up-box {
          background: rgba(255,255,255,0.5);
          padding: 10px;
          border-radius: 8px;
          font-style: italic;
        }
        
        .follow-up-label {
          font-weight: 500;
          display: block;
          margin-bottom: 5px;
        }
        
        .follow-up-response {
          display: block;
          padding-left: 10px;
        }
        
        .navigation-section {
          margin-top: 25px;
          border-top: 1px solid #eee;
          padding-top: 15px;
          display: flex;
          justify-content: center;
          gap: 15px;
        }
        
        .nav-btn {
          background: linear-gradient(90deg, #778ca3, #a5b1c2);
          border: none;
          color: white;
          padding: 12px 20px;
          border-radius: 20px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s ease;
          min-width: 100px;
        }
        
        .thoughts-btn {
          background: linear-gradient(90deg, rgba(255,107,107,1), rgba(255,143,177,1));
        }
        
        .nav-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 3px 6px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
};

export default SummaryView;
