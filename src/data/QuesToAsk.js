/**
 * Questions configuration for the birthday app.
 * Add or modify questions here to easily update the app's content.
 */
export const questions = [
  {
    id: 1,
    question: "How was your day?",
    options: ["Boring", "Okay", "Good", "Amazing"],
    multiSelect: false
  },
  {
    id: 2,
    question: "Did anything special happen today?",
    options: ["Of cource, Not", "Nothing in particular", "Yes😊", "Absolutely Yes!💯"],
    followUp: {
      "Yes😊": "What was it that made your day special?",
      "Absolutely Yes!💯": "Wow! I'd love to hear what made your day so special!"
    },
    multiSelect: false
  },
  {
    id: 3,
    question: "Did anything make you smile today?",
    options: ["Not really", "A little", "Yes, a lot!", "Totally!"],
    followUp: {
      "Yes, a lot!": "What made you smile today?",
      "Totally!": "That's great! What brought those smiles?"
    },
    multiSelect: false
  },
  {
    id: 4,
    question: "What was the best part of your day?",
    options: ["Nothing", "A small moment", "Something exciting", "The whole day!"],
    followUp: {
      "A small moment": "Would you like to share that small moment?",
      "Something exciting": "I'd love to hear about that exciting thing!"
    },
    multiSelect: false
  },
  {
    id: 5,
    question: "What's one thing you're grateful for today?",
    options: ["Nothing", "A person", "An event", "Everything!"],
    followUp: {
      "A person": "Would you like to share who this person is and how they made your day special?",
      "An event": "Would you like to tell me about this event?",
      "Everything!": "What are you most grateful for today? (A person, an event or something else?)"
    },
    multiSelect: false 
  }
];

/**
 * Find a question by its ID
 * @param {number|string} id - Question ID
 * @returns {object|null} - Matched question object or null if not found
 */
export const findQuestionById = (id) => {
  if (id === undefined || id === null) return null;
  
  // Convert to number if it's a string number
  const numId = typeof id === 'string' && !isNaN(id) ? parseInt(id, 10) : id;
  
  return questions.find(q => q.id === numId);
};

/**
 * Find a question by its exact text or a partial match
 * @param {string} questionText - Text to match against questions
 * @returns {object|null} - Matched question object or null if not found
 */
export const findQuestionByText = (questionText) => {
  if (!questionText) return null;
  
  // Try exact match first
  const exactMatch = questions.find(q => q.question === questionText);
  if (exactMatch) return exactMatch;
  
  // Try partial match
  for (const q of questions) {
    if (questionText.includes(q.question) || q.question.includes(questionText)) {
      return q;
    }
  }
  
  return null;
};

/**
 * Find a follow-up question by the original question and selected option
 * @param {string|number} questionId - ID of the original question
 * @param {string} selectedOption - Selected option text
 * @returns {string|null} - Follow-up question text or null if not found
 */
export const findFollowUpQuestion = (questionId, selectedOption) => {
  try {
    const question = findQuestionById(questionId);
    if (!question || !question.followUp) return null;
    
    // Handle the case when selectedOption might be an object
    const optionKey = typeof selectedOption === 'string' 
      ? selectedOption 
      : String(selectedOption);
    
    // Make sure we return a string
    const followUp = question.followUp[optionKey] || null;
    
    return typeof followUp === 'string' ? followUp : null;
  } catch (error) {
    console.error("Error finding follow-up question:", error);
    return null;
  }
};

/**
 * Get a random question from the list
 * @returns {object} - Random question object
 */
export const getRandomQuestion = () => {
  const randomIndex = Math.floor(Math.random() * questions.length);
  return questions[randomIndex];
};
