// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDuNXbI2TGpfy-EUfj29JoyJ1i_RzdQvlI",
  authDomain: "project-b5897.firebaseapp.com",
  projectId: "project-b5897",
  storageBucket: "project-b5897.firebasestorage.app",
  messagingSenderId: "910841988873",
  appId: "1:910841988873:web:5c14621f2823ab19de35d8",
  measurementId: "G-88WDXL448S"
};

// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('✓ Firebase initialized successfully');
} catch (error) {
  console.error('✗ Firebase initialization error:', error);
  throw error;
}

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;