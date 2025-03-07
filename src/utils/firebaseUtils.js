import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';

/**
 * Save question answer to Firestore
 * 
 * @param {string} question - The question text that was asked
 * @param {string} answer - The user's selected answer
 * @param {string|null} followUpQuestion - Any follow-up question (if applicable)
 * @param {string|null} followUpAnswer - Answer to the follow-up question (if applicable)
 * @param {number|string|null} questionId - Question ID or number
 * @returns {Promise} - Promise that resolves when data is saved
 */
export const saveQuestionAnswer = async (question, answer, followUpQuestion = null, followUpAnswer = null, questionId = null) => {
  try {
    // Ensure questionId is in the right format and never null
    const finalQuestionId = questionId ? questionId.toString() : `q${Date.now().toString().substr(-4)}`;
    
    // Create a data object with fields in the specific order requested
    const data = {
      questionId: finalQuestionId,
      question: question || "Unknown question", // Store full question text
      answer: answer || "No answer provided", // Store the selected option
      timestamp: serverTimestamp()
    };

    // Add follow-up fields only if they exist
    if (followUpQuestion) {
      data.followUpQuestion = followUpQuestion;
    }
    
    if (followUpAnswer) {
      data.followUpAnswer = followUpAnswer;
    }

    console.log("Saving to Firestore:", data);
    
    // Save to Firestore collection "choices"
    await addDoc(collection(db, "choices"), data);
    return true;
  } catch (error) {
    console.error("Error saving answer to Firestore:", error);
    throw error;
  }
};

/**
 * Save feedback to Firestore
 * 
 * @param {string} message - Feedback message from the user
 * @returns {Promise} - Promise that resolves when data is saved
 */
export const saveFeedback = async (message) => {
  try {
    const data = {
      message,
      timestamp: serverTimestamp()
    };
    
    await addDoc(collection(db, "feedback"), data);
    return true;
  } catch (error) {
    console.error("Error saving feedback to Firestore:", error);
    throw error;
  }
};

/**
 * Save user consent to Firestore
 * 
 * @param {boolean} consentGiven - Whether consent was given by the user
 * @returns {Promise} - Promise that resolves when data is saved
 */
export const saveConsent = async (consentGiven) => {
  try {
    const data = {
      consent: consentGiven ? "Yes, that's fine! 👍" : "I'd rather not 👋",
      timestamp: serverTimestamp()
    };
    
    await addDoc(collection(db, "consent"), data);
    return true;
  } catch (error) {
    console.error("Error saving consent to Firestore:", error);
    throw error;
  }
};
