import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

/**
 * Script to seed users for Director, Admin, and Operations roles
 * All users will have the same password: Password@1
 * All users will have email addresses with @company.com domain
 */

interface UserSeed {
  email: string;
  name: string;
  role: string;
}

// Users to be seeded
const usersToSeed: UserSeed[] = [
  {
    email: "director@company.com",
    name: "Director User",
    role: "Director",
  },
  {
    email: "admin@company.com",
    name: "Admin User",
    role: "Admin",
  },
  {
    email: "operations@company.com",
    name: "Operations User",
    role: "Operations",
  },
];

// Standard password for all seeded users
const standardPassword = "Password@1";

/**
 * Creates a user in Firebase Auth and Firestore
 */
const createUser = async (user: UserSeed) => {
  try {
    // 1. Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      user.email,
      standardPassword
    );

    // 2. Add user info to Firestore
    await setDoc(doc(db, "users", userCredential.user.uid), {
      uid: userCredential.user.uid,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: new Date().toISOString(),
    });

    console.log(`✅ Successfully created ${user.role} user: ${user.email}`);
    return true;
  } catch (error: any) {
    console.error(`❌ Failed to create ${user.role} user:`, error.message);
    return false;
  }
};

/**
 * Main function to seed all users
 */
const seedUsers = async () => {
  console.log("🌱 Starting user seeding process...");
  
  // Process users sequentially to avoid rate limiting
  for (const user of usersToSeed) {
    await createUser(user);
  }
  
  console.log("✨ User seeding completed!");
};

// Execute the seeding
seedUsers().catch(console.error); 