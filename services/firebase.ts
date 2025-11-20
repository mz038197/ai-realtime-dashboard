import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

export interface User {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

// ---------------------------------------------------------------------------
// TODO: PASTE YOUR FIREBASE CONFIGURATION HERE
// You can find this in the Firebase Console -> Project Settings -> General
// ---------------------------------------------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyCTDM9wg7YVDRt7L-4b-n6lCTpJwBLj8To",
  authDomain: "ai-realtime-dashboard.firebaseapp.com",
  projectId: "ai-realtime-dashboard",
  storageBucket: "ai-realtime-dashboard.firebasestorage.app",
  messagingSenderId: "451348070658",
  appId: "1:451348070658:web:9b6ed5da63f847bbeec21b",
  measurementId: "G-CZL7GHZP9W"
};

// Initialize Firebase
// Check getApps() to prevent double-initialization in hot-reload environments
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // Return our custom User interface
    return {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL
    } as User;
  } catch (error: any) {
    console.error("Error logging in with Google", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error logging out", error);
  }
};

export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      const user: User = {
        uid: firebaseUser.uid,
        displayName: firebaseUser.displayName,
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL
      };
      callback(user);
    } else {
      callback(null);
    }
  });
};