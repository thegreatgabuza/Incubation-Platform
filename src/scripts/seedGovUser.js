// Script to create a government user in Firebase
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signOut 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc 
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

async function createGovUser() {
  try {
    // Create the user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log(`Created authentication user: ${user.uid}`);
    
    // Add user data to Firestore with Government role
    await setDoc(doc(db, "users", user.uid), {
      email: email,
      name: "Government Entity",
      role: "Government",
      createdAt: new Date().toISOString()
    });
    
    console.log(`Added user to Firestore with Government role`);
    
    // Sign out after creation
    await signOut(auth);
    console.log("Signed out");
    
    console.log("Government user created successfully!");
    console.log("Email: gov@company.com");
    console.log("Password: Password@1");
    
  } catch (error) {
    console.error("Error creating government user:", error.message);
  }
}

createGovUser(); 