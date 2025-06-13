import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth, User, onAuthStateChanged } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { getFunctions, Functions } from "firebase/functions";
import { getAnalytics, Analytics, isSupported } from "firebase/analytics";

// ✅ Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// ✅ Validate required environment variables
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN', 
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !import.meta.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('Missing required Firebase environment variables:', missingEnvVars);
  console.error('Please check your .env file and ensure all Firebase configuration variables are set.');
}

// ✅ Initialize Firebase App with error handling
let app: FirebaseApp | null = null;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let functions: Functions;
let analytics: Analytics | null = null;

try {
  console.log("Initializing Firebase...");
  
  // Check if we have the minimum required config
  if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  }
  
  app = initializeApp(firebaseConfig);
  
  // ✅ Core Services
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  functions = getFunctions(app);
  
  // Add auth state listener for debugging
  onAuthStateChanged(auth, (user: User | null) => {
    if (user) {
      console.log("User is signed in:", user.uid);
    } else {
      console.log("User is signed out");
    }
  });
  
  // ✅ Optional: Initialize Analytics (only if supported and measurementId is provided)
  if (import.meta.env.VITE_FIREBASE_MEASUREMENT_ID) {
    isSupported()
      .then((supported: boolean) => {
        if (supported && app) {
          analytics = getAnalytics(app);
          console.log("Analytics initialized successfully");
        }
      })
      .catch((error: Error) => {
        console.error("Analytics not supported:", error);
        analytics = null;
      });
  } else {
    console.log("Analytics measurement ID not provided, skipping analytics initialization");
  }
    
  console.log("Firebase initialized successfully");

} catch (error) {
  console.error("Firebase initialization error:", error);
  
  // Create safe fallback objects
  app = null;
  
  // Create a minimal auth object for fallback
  const mockAuth = {
    currentUser: null,
    onAuthStateChanged: () => () => {},
    signInWithEmailAndPassword: () => Promise.reject(new Error("Firebase not initialized")),
    signOut: () => Promise.reject(new Error("Firebase not initialized")),
    createUserWithEmailAndPassword: () => Promise.reject(new Error("Firebase not initialized"))
  };
  
  auth = mockAuth as unknown as Auth;
  db = {} as Firestore;
  storage = {} as FirebaseStorage;
  functions = {} as Functions;
  analytics = null;
}

// Export all services
export { app, auth, db, storage, functions, analytics };
