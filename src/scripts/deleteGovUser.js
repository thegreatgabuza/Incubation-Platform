// Script to delete a government user in Firebase
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword,
  deleteUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  deleteDoc
} from 'firebase/firestore';

// Firebase configuration from your firebase.ts file
const firebaseConfig = {
  apiKey: "AIzaSyCqM2fTwccgFUKmrwFYP7XFVAgo-9sVArM",
  authDomain: "incubation-platform-61610.firebaseapp.com",
  projectId: "incubation-platform-61610",
  storageBucket: "incubation-platform-61610.appspot.com",
  messagingSenderId: "608623931092",
  appId: "1:608623931092:web:449de44205d7d2d7d49541",
  measurementId: "G-V6MZVHG72Z",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// User credentials
const email = "gov@company.com";
const password = "Password@1";

async function deleteGovUser() {
  try {
    console.log(`Attempting to delete user: ${email}`);
    
    // Sign in as the government user
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log(`Signed in as: ${user.uid}`);
    
    // Delete the user document from Firestore
    try {
      await deleteDoc(doc(db, "users", user.uid));
      console.log(`Deleted user document from Firestore: ${user.uid}`);
    } catch (firestoreError) {
      console.warn("Could not delete user from Firestore (may not exist):", firestoreError.message);
    }
    
    // Delete the user from Authentication
    await deleteUser(user);
    console.log(`Deleted authentication user: ${user.uid}`);
    
    console.log("Government user deleted successfully");
    
  } catch (error) {
    console.error("Error deleting government user:", error.message);
  }
}

// Execute the function
deleteGovUser(); 