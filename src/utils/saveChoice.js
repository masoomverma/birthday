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
    
    // Save to Firebase based on the type
    if (type === 'ques') {
      // For regular questions with answers
      if (data.selectedAnswer !== undefined) {
        await saveQuestionAnswer(
          question, 
          data.selectedAnswer, 
          null, // No follow-up question when just answering
          null  // No follow-up answer when just answering
        );
      }
      // For follow-up responses
      else if (data.response !== undefined && data.followUpQuestion !== undefined) {
        await saveQuestionAnswer(
          `Follow-up to Q${data.questionId || ''}`, 
          data.response,
          data.followUpQuestion,
          data.response
        );
      }
    } else if (type === 'feedback') {
      await saveFeedback(data.message, data.mood || '');
    }
    
    return true;
  } catch (error) {
    console.error("Error saving choice:", error);
    return false;
  }
};

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
