import { saveQuestionAnswer, saveFeedback } from './firebaseUtils';

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
    
    // Extract question number if possible - with priority for "id:" format
    let questionId = null;
    
    // First check for id field in the data object
    if (data.id !== undefined && data.id !== null) {
      questionId = data.id;
      console.log(`Using data.id as questionId: ${questionId}`);
    }
    // Then check for questionId field
    else if (data.questionId !== undefined && data.questionId !== null) {
      questionId = data.questionId;
      console.log(`Using data.questionId: ${questionId}`);
    } 
    // Look for "id:" pattern in any string fields
    else {
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
    }
    
    console.log(`Final questionId: ${questionId} for question: "${question?.substring(0, 30)}..."`);
    
    // Save to Firebase based on the type
    if (type === 'ques') {
      // For regular questions with answers
      if (data.selectedAnswer !== undefined) {
        console.log(`Saving regular answer: "${data.selectedAnswer}"`);
        await saveQuestionAnswer(
          question,
          data.selectedAnswer, 
          data.followUpQuestion || null, 
          null,
          questionId
        );
      }
      // For follow-up responses (only save when user actually provides a follow-up)
      else if (data.response !== undefined && data.followUpQuestion !== undefined) {
        // Get the original answer - use the exact value provided
        const originalAnswer = data.originalAnswer || data.selectedAnswer || "No selection recorded";
        
        console.log(`Saving follow-up response with original answer: "${originalAnswer}"`);
        console.log(`Follow-up question: "${data.followUpQuestion}"`);
        console.log(`Follow-up answer: "${data.response}"`);
        
        await saveQuestionAnswer(
          question,
          originalAnswer, // Use exactly what was provided as originalAnswer
          data.followUpQuestion,
          data.response,
          questionId
        );
      }
      // For skipped follow-up questions
      else if (data.skipped === true && data.followUpQuestion !== undefined) {
        // Get the original answer - use exactly what was provided
        const originalAnswer = data.originalAnswer || data.selectedAnswer || "No selection recorded";
        
        console.log(`Saving skipped follow-up with original answer: "${originalAnswer}"`);
        
        // Force save with explicit parameters
        await saveSkippedFollowUp(
          question,
          originalAnswer, // Pass the original answer exactly as provided
          data.followUpQuestion,
          questionId
        );
      }
    } else if (type === 'feedback') {
      // For feedback type, only call the dedicated saveFeedback function
      // The saveChoice call in Feedback.js will handle the storage in the choices collection
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
    // Use direct Firebase call to ensure data is saved
    await saveQuestionAnswer(
      question,
      originalAnswer || "No selection recorded", // Pass the original answer directly
      followUpQuestion,
      "I'd rather not 🚫", // Using stop sign emoji
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
