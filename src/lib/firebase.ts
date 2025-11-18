// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB3nFGlqiWS2qneKEKLo0oM-JuJyRYnxaU",
  authDomain: "nth-placements.firebaseapp.com",
  projectId: "nth-placements",
  storageBucket: "nth-placements.firebasestorage.app",
  messagingSenderId: "1084609334060",
  appId: "1:1084609334060:web:02c9a275c80b8de8993a89",
  measurementId: "G-K0QGM8VMMN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, auth, db, storage };