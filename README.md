# Birthday Surprise Web App 🎂✨

A special interactive birthday celebration application built with React and Firebase, featuring cute animal dialogue boxes and personalized birthday experiences.

## Overview

This application is designed as a birthday gift, offering a sequential journey through several interactive pages:

1. **Thank You Page** - Welcoming entry page with confetti animation
2. **Wishing Page** - Asks permission to save user choices
3. **Memories Page** - Displays special photo memories
4. **Feedback Page** - Collects birthday messages and ratings
5. **Quiz Page** - Fun interactive quiz about the birthday person
6. **Home Page** - Final celebration page with personalized message

## Features

- 🎨 Beautiful birthday-themed UI with gradient colors and animations
- 🐱 Cute animal dialogue boxes (bunny, bear, cat, penguin)
- 🔒 User privacy controls for data collection
- 📸 Photo memory gallery integration
- ✨ Interactive elements with animations
- 🎮 Custom birthday quiz functionality
- 🎇 Confetti celebrations
- 📱 Responsive design for all devices

## Technologies Used

- **React** - Frontend framework
- **Firebase/Firestore** - Backend data storage
- **React Router** - Page navigation
- **CSS Animations** - Visual effects
- **LocalStorage** - User preferences

## Setup & Installation

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Configure Firebase:
   - Create a Firebase project at https://firebase.google.com
   - Enable Firestore database
   - Update the firebaseConfig.js file with your project credentials

4. Start the development server:
   ```
   npm start
   ```

## Project Structure

```
/birthday/
├── public/
│   ├── index.html
│   └── assets/
│       ├── cat-icon.png
│       ├── bunny-icon.png
│       ├── bear-icon.png
│       ├── penguin-icon.png
│       └── memories/
│           └── [memory images]
├── src/
│   ├── App.js             # Main component with routing
│   ├── App.css            # Global styles
│   ├── firebaseConfig.js  # Firebase configuration
│   ├── components/
│   │   └── DialogueBox.js # Reusable animal dialogue component
│   ├── pages/
│   │   ├── ThankYou.js    # Welcome page
│   │   ├── Wishing.js     # Permission request page
│   │   ├── Memories.js    # Photo gallery page
│   │   ├── Feedback.js    # User message collection
│   │   ├── Quiz.js        # Interactive quiz
│   │   └── Home.js        # Final celebration page
│   └── utils/
│       └── saveChoice.js  # Firebase interaction helpers
└── README.md
```

## Customization

To personalize this birthday app:

1. **Photos**: Add personal photos to the public/assets/memories folder
2. **Quiz**: Update the quiz questions in src/pages/Quiz.js
3. **Messages**: Customize the dialogue messages in each page component
4. **Colors**: Adjust the color palette in App.css

## Deployment

For production deployment:

1. Build the application:
   ```
   npm run build
   ```

2. Deploy to Firebase Hosting (optional):
   ```
   firebase init
   firebase deploy
   ```

## Credits

- Animal illustrations: Provide attribution if needed
- Confetti effects: canvas-confetti (MIT License)

## License

This project is created as a personal gift and is not intended for commercial use.

---

Made with ❤️ for a special birthday celebration
