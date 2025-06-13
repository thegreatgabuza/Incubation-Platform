import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth, User, onAuthStateChanged } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { getFunctions, Functions } from "firebase/functions";
import { getAnalytics, Analytics, isSupported } from "firebase/analytics";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDOugyzJkqn4TpD-o1fxWxs7uCK2bCniQQ",
  authDomain: "demodbn.firebaseapp.com",
  projectId: "demodbn",
  storageBucket: "demodbn.firebasestorage.app",
  messagingSenderId: "599400723868",
  appId: "1:599400723868:web:e2b23059726bcde37cc459",
  measurementId: "G-01MB4RKHWL"
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
  onAuthStateChanged(auth, (user: User | null) => {
    if (user) {
      console.log("User is signed in:", user.uid);
    } else {
      console.log("User is signed out");
    }
  });
  
  // ✅ Optional: Initialize Analytics (only if supported)
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
