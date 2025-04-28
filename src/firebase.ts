import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth, User, NextOrObserver, onAuthStateChanged } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { getFunctions, Functions } from "firebase/functions";
import { getAnalytics, Analytics, isSupported } from "firebase/analytics";

// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCqM2fTwccgFUKmrwFYP7XFVAgo-9sVArM",
  authDomain: "incubation-platform-61610.firebaseapp.com",
  projectId: "incubation-platform-61610",
  storageBucket: "incubation-platform-61610.appspot.com",
  messagingSenderId: "608623931092",
  appId: "1:608623931092:web:449de44205d7d2d7d49541",
  measurementId: "G-V6MZVHG72Z",
};

// ✅ Initialize Firebase App with error handling
let app: FirebaseApp | null = null;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let functions: Functions;
let analytics: Analytics | null = null;

try {
  console.log("Initializing Firebase...");
  app = initializeApp(firebaseConfig);
  
  // ✅ Core Services
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  functions = getFunctions(app);
  
  // Add auth state listener for debugging
  auth.onAuthStateChanged((user) => {
    if (user) {
      console.log("User is signed in:", user.uid);
    } else {
      console.log("User is signed out");
    }
  });
  
  // ✅ Optional: Initialize Analytics (only if supported)
  isSupported()
    .then((supported) => {
      if (supported && app) {
        analytics = getAnalytics(app);
      }
    })
    .catch((error) => {
      console.error("Analytics not supported:", error);
      analytics = null;
    });
    
  console.log("Firebase initialized successfully");

} catch (error) {
  console.error("Firebase initialization error:", error);
  // Create fallback objects to prevent the app from crashing
  app = null;
  auth = {
    currentUser: null,
    onAuthStateChanged: (observer: NextOrObserver<User | null>) => {
      // Use a type guard to check if the observer is a function
      if (typeof observer === 'function') {
        observer(null);
      } else if (observer && typeof observer.next === 'function') {
        observer.next(null);
      }
      return () => {};
    }
  } as Auth;
  db = {} as Firestore;
  storage = {} as FirebaseStorage;
  functions = {} as Functions;
}

// Export all services
export { app, auth, db, storage, functions, analytics };
