import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup,
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  writeBatch,
  query,
  getDocs
} from 'firebase/firestore';
import { Student } from '../types';

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
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore
const provider = new GoogleAuthProvider();

// Add these settings to improve compatibility
provider.setCustomParameters({
  prompt: 'select_account'  // Always show account selection
});

// --- Auth Functions ---

export const loginWithGoogle = async () => {
  try {
    console.log("🔐 Starting Google login with popup...");
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("✅ Login successful:", user.email);
    return {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL
    } as User;
  } catch (error: any) {
    console.error("❌ Login error:", error.code, error.message);
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
      console.log("👤 User authenticated:", firebaseUser.email);
      const user: User = {
        uid: firebaseUser.uid,
        displayName: firebaseUser.displayName,
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL
      };
      callback(user);
    } else {
      console.log("👤 No user authenticated");
      callback(null);
    }
  });
};

// --- Firestore Database Functions ---

/**
 * Subscribes to the user's students collection in real-time.
 */
export const subscribeToStudents = (uid: string, callback: (students: Student[]) => void) => {
  const studentsRef = collection(db, 'users', uid, 'students');
  
  // Listen for real-time updates
  return onSnapshot(studentsRef, (snapshot) => {
    const students: Student[] = [];
    snapshot.forEach((doc) => {
      students.push(doc.data() as Student);
    });
    callback(students);
  });
};

/**
 * Overwrites the current list with new students (used for CSV import or AI generation).
 * This performs a batch operation: delete all existing -> add new.
 */
export const overwriteStudents = async (uid: string, newStudents: Student[]) => {
  const batch = writeBatch(db);
  const studentsRef = collection(db, 'users', uid, 'students');

  // 1. Get all current docs to delete them (Firestore doesn't have a "delete collection" method for clients)
  const currentDocs = await getDocs(query(studentsRef));
  currentDocs.forEach((doc) => {
    batch.delete(doc.ref);
  });

  // 2. Add new students
  newStudents.forEach((student) => {
    const docRef = doc(studentsRef, student.id);
    batch.set(docRef, student);
  });

  await batch.commit();
};

/**
 * Updates a single student's score.
 */
export const updateStudentScore = async (uid: string, studentId: string, newScore: number) => {
  const docRef = doc(db, 'users', uid, 'students', studentId);
  await updateDoc(docRef, { score: newScore });
};