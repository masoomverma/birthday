import { saveQuestionAnswer, saveFeedback } from './firebaseUtils';
import { findQuestionByText, findQuestionById } from '../data/QuesToAsk';

/**
 * Saves user choices to Firestore
 * @param {string} type - The type of choice (e.g., 'ques', 'feedback')
 * @param {string} question - The question asked
 * @param {*} data - The user's selection and additional data
 * @param {boolean} saveToStorage - Whether to save to localStorage
 * @returns {Promise} - Promise resolving to success or failure
 */
export const saveChoice = async (type, question, data, saveToStorage = true) => {
  try {
    // Save to local storage if enabled
    if (saveToStorage) {
      const key = `birthday_${type}_${Date.now()}`;
      const saveData = {
        question,
        data,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(key, JSON.stringify(saveData));
    }
    
    // Extract question data using our mapping
    let questionId = null;
    let questionText = question;
    
    // First try to get the question ID from data
    if (data.id !== undefined && data.id !== null) {
      questionId = data.id;
      // Try to get the full question text
      const matchedQuestion = findQuestionById(questionId);
      if (matchedQuestion) {
        questionText = matchedQuestion.question;
      }
      console.log(`Using provided questionId: ${questionId}`);
    }
    // Try to match by question text
    else if (question) {
      const matchedQuestion = findQuestionByText(question);
      if (matchedQuestion) {
        questionId = matchedQuestion.id;
        questionText = matchedQuestion.question; // Use the exact question text from our map
        console.log(`Matched question by text: ${questionId}`);
      }
    }
    
    // If we still don't have an ID, use the legacy extraction methods
    if (!questionId) {
      // Check the question string for "id: X" pattern
      if (question && typeof question === 'string') {
        const idMatch = question.match(/id:\s*(\d+)/i);
        if (idMatch && idMatch[1]) {
          questionId = idMatch[1];
          console.log(`Extracted id from question text: ${questionId}`);
        }
      }
      
      // Check all string properties in data for "id:" pattern
      if (!questionId) {
        for (const key in data) {
          if (typeof data[key] === 'string') {
            const idMatch = data[key].match(/id:\s*(\d+)/i);
            if (idMatch && idMatch[1]) {
              questionId = idMatch[1];
              console.log(`Found id: ${questionId} in data.${key}`);
              break;
            }
          }
        }
      }
      
      // If still not found, try regular extraction from question
      if (!questionId && question) {
        const matches = question.match(/Question\s*(\d+)/i) || 
                        question.match(/^Q(\d+)/i) || 
                        question.match(/^(\d+)[.]/) || 
                        question.match(/(\d+)/);
        
        if (matches) {
          questionId = matches[1];
          console.log(`Extracted number from question: ${questionId}`);
        }
      }
      
      // If after all attempts we still don't have an ID, generate one
      if (!questionId) {
        questionId = `q${Date.now().toString().substr(-4)}`;
        console.log(`Generated questionId: ${questionId}`);
      }
    }
    
    console.log(`Final questionId: ${questionId}, question: "${questionText}"`);
    
    // Save to Firebase based on the type
    if (type === 'ques') {
      // For regular questions with answers
      if (data.selectedAnswer !== undefined) {
        console.log(`Saving regular answer: "${data.selectedAnswer}"`);
        
        // Update this section to also save followUpResponse if it exists
        const followUpResponse = data.followUpResponse || null;
        
        await saveQuestionAnswer(
          questionText, // Use the matched question text
          data.selectedAnswer, 
          data.followUpQuestion || null, 
          followUpResponse,
          questionId
        );
      }
      // For follow-up responses (only save when user actually provides a follow-up)
      else if (data.followUpResponse !== undefined && data.followUpQuestion !== undefined) {
        // Get the original question and answer
        let originalQuestion = data.originalQuestion || question;
        let originalAnswer = data.originalAnswer || data.selectedOption;
        
        // Try to find the original question using the questionId
        if (questionId) {
          const matchedQuestion = findQuestionById(questionId);
          if (matchedQuestion) {
            originalQuestion = matchedQuestion.question;
            
            // If we don't have originalAnswer but have originalOption, use that
            if (!originalAnswer && data.originalOption) {
              originalAnswer = data.originalOption;
            }
          }
        }
        
        // If still no original answer, try various sources
        if (!originalAnswer) {
          originalAnswer = data.selectedAnswer || data.option || data.selection || "No selection recorded";
          console.warn(`Had to use fallback for original answer: ${originalAnswer}`);
        }
        
        console.log(`Saving follow-up response: 
          Original question: "${originalQuestion}"
          Original answer: "${originalAnswer}"
          Follow-up question: "${data.followUpQuestion}"
          Follow-up answer: "${data.followUpResponse}"
        `);
        
        // When saving a follow-up, store the original question and answer first
        await saveQuestionAnswer(
          originalQuestion,
          originalAnswer,
          data.followUpQuestion,
          data.followUpResponse, // Use followUpResponse instead of response
          questionId
        );
      }
      // For skipped follow-up questions
      else if (data.skipped === true && data.followUpQuestion !== undefined) {
        // Get the original answer
        const originalAnswer = data.originalAnswer || data.selectedAnswer;
        
        if (!originalAnswer) {
          console.error("Missing original answer for skipped follow-up");
        }
        
        console.log(`Saving skipped follow-up with original answer: "${originalAnswer}"`);
        
        // Force save with explicit parameters
        await saveSkippedFollowUp(
          questionText, // Use the matched question text
          originalAnswer, // Original answer
          data.followUpQuestion,
          questionId
        );
      }
    } else if (type === 'feedback') {
      // For feedback type, only call the dedicated saveFeedback function
      await saveFeedback(data.message);
    }
    
    return true;
  } catch (error) {
    console.error("Error saving choice:", error);
    return false;
  }
};

/**
 * Explicitly saves a skipped follow-up question
 * This dedicated function ensures skipped responses are always saved
 */
async function saveSkippedFollowUp(question, originalAnswer, followUpQuestion, questionId) {
  console.log("EXPLICITLY SAVING SKIPPED FOLLOW-UP");
  
  try {
    await saveQuestionAnswer(
      question,
      originalAnswer || "Option not recorded", // Original answer or fallback
      followUpQuestion,
      "I'd rather not 🚫",
      questionId
    );
    console.log("SKIPPED FOLLOW-UP SAVED SUCCESSFULLY");
    return true;
  } catch (error) {
    console.error("Failed to save skipped follow-up:", error);
    return false;
  }
}

/**
 * Checks permission status from localStorage
 * @returns {boolean} - Whether saving is allowed
 */
export const isSavingAllowed = () => {
  return true; // Always allow saving
};

/**
 * Sets permission status in localStorage
 * @param {boolean} allowed - Whether saving is allowed
 */
export const setSavingPermission = (allowed) => {
  localStorage.setItem('allowDataSaving', allowed ? 'true' : 'false');
};
