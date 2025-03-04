import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';

/**
 * Saves user choices to Firestore
 * @param {string} page - The page where the choice was made
 * @param {string} question - The question asked
 * @param {*} choice - The user's selection
 * @param {boolean} allowSaving - Whether user allowed data to be saved
 * @returns {Promise} - Promise resolving to the doc reference or null
 */
export const saveChoice = async (page, question, choice, allowSaving) => {
  if (!allowSaving) {
    console.log('User did not allow saving data');
    return null;
  }

  try {
    const docRef = await addDoc(collection(db, 'responses'), {
      page,
      question,
      choice,
      timestamp: serverTimestamp()
    });
    console.log('Document written with ID: ', docRef.id);
    return docRef;
  } catch (error) {
    console.error('Error saving choice:', error);
    return null;
  }
};

/**
 * Checks permission status from localStorage
 * @returns {boolean} - Whether saving is allowed
 */
export const isSavingAllowed = () => {
  return localStorage.getItem('allowDataSaving') === 'true';
};

/**
 * Sets permission status in localStorage
 * @param {boolean} allowed - Whether saving is allowed
 */
export const setSavingPermission = (allowed) => {
  localStorage.setItem('allowDataSaving', allowed ? 'true' : 'false');
};
