import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Save data to Firebase Firestore
 * @param {string} collectionName - Name of the collection (e.g., 'answers', 'feedback')
 * @param {Object} data - Data to be stored
 * @returns {Promise<string>} - ID of the created document
 */
export const saveToFirebase = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      timestamp: serverTimestamp()
    });
    console.log(`Data saved to ${collectionName} with ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error(`Error saving to ${collectionName}:`, error);
    return null;
  }
};

/**
 * Save question answers to Firebase
 * @param {string} questionText - The question text
 * @param {string} answer - The selected answer
 * @param {string} followUpQuestion - Optional follow-up question
 * @param {string} followUpAnswer - Optional follow-up answer
 * @returns {Promise<string>} - ID of the created document
 */
export const saveQuestionAnswer = async (questionText, answer, followUpQuestion = null, followUpAnswer = null) => {
  const data = {
    question: questionText,
    answer: answer
  };
  
  if (followUpQuestion && followUpAnswer) {
    data.followUpQuestion = followUpQuestion;
    data.followUpAnswer = followUpAnswer;
  }
  
  return saveToFirebase('answers', data);
};

/**
 * Save feedback message to Firebase
 * @param {string} message - The feedback message
 * @param {string} mood - The selected mood
 * @returns {Promise<string>} - ID of the created document
 */
export const saveFeedback = async (message, mood) => {
  return saveToFirebase('feedback', {
    message,
    mood
  });
};
