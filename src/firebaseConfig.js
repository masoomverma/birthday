import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAHJbJEZN-rIYCLTGJD2p2lfO73wqFbumE",
  authDomain: "birthday-running-19.firebaseapp.com",
  projectId: "birthday-running-19",
  storageBucket: "birthday-running-19.appspot.com",
  messagingSenderId: "492167999106",
  appId: "1:492167999106:web:b4b2a18116b0a454a98e9b",
  measurementId: "G-LWMN9BEN8S",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
