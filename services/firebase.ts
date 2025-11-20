
// Note: Real Firebase imports are commented out to resolve build errors regarding missing module exports.
// This file currently provides a Mock Auth implementation for demonstration purposes.

// import { initializeApp } from 'firebase/app';
// import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

export interface User {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

// TODO: To use real Firebase, uncomment the imports above, restore the logic, and fill in your config.
/*
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:0000000000000000000000"
};
*/

// Mock Internal State
let currentUser: User | null = null;
const listeners: ((user: User | null) => void)[] = [];

const notifyListeners = () => {
  listeners.forEach(l => l(currentUser));
};

export const loginWithGoogle = async () => {
  console.log("Logging in (Mock Mode)...");
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  currentUser = {
    uid: 'mock-user-' + Date.now(),
    displayName: 'Demo User',
    email: 'demo@example.com',
    photoURL: null
  };
  notifyListeners();
  return currentUser;
};

export const logout = async () => {
  console.log("Logging out (Mock Mode)...");
  currentUser = null;
  notifyListeners();
};

export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  listeners.push(callback);
  // Trigger with current state immediately
  callback(currentUser);
  
  // Return unsubscribe function
  return () => {
    const index = listeners.indexOf(callback);
    if (index > -1) listeners.splice(index, 1);
  };
};
