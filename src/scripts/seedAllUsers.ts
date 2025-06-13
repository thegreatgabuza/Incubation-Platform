import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

/**
 * Comprehensive script to seed demo users for ALL roles in the Incubation Platform
 * Password for all users: Demo@123
 * Email pattern: [role]@demodbn.com
 */

interface UserSeed {
  email: string;
  name: string;
  role: string;
  description: string;
  phone?: string;
  department?: string;
}

// All users to be seeded with comprehensive demo data
const usersToSeed: UserSeed[] = [
  {
    email: "admin@demodbn.com",
    name: "Nomsa Mthembu",
    role: "Admin",
    description: "System Administrator with full platform access",
    phone: "+27-11-555-0101",
    department: "IT Administration"
  },
  {
    email: "director@demodbn.com", 
    name: "Sipho Ndlovu",
    role: "Director",
    description: "Executive Director overseeing platform operations",
    phone: "+27-11-555-0102",
    department: "Executive Leadership"
  },
  {
    email: "operations@demodbn.com",
    name: "Thandi Zulu",
    role: "Operations", 
    description: "Operations Manager handling day-to-day activities",
    phone: "+27-11-555-0103",
    department: "Operations"
  },
  {
    email: "consultant@demodbn.com",
    name: "Mandla Dlamini",
    role: "Consultant",
    description: "Senior Business Consultant providing mentorship",
    phone: "+27-11-555-0104", 
    department: "Advisory Services"
  },
  {
    email: "funder@demodbn.com",
    name: "Zanele Nkomo",
    role: "Funder",
    description: "Investment Manager evaluating funding opportunities",
    phone: "+27-11-555-0105",
    department: "Investment Division"
  },
  {
    email: "government@demodbn.com",
    name: "Bongani Mkhize",
    role: "Government", 
    description: "Government Liaison for policy and compliance",
    phone: "+27-11-555-0106",
    department: "Government Relations"
  },
  {
    email: "corporate@demodbn.com",
    name: "Lindiwe Buthelezi",
    role: "Corporate",
    description: "Corporate Partnership Manager",
    phone: "+27-11-555-0107", 
    department: "Corporate Relations"
  },
  {
    email: "incubatee@demodbn.com",
    name: "Sizani Mbeki",
    role: "Incubatee",
    description: "Startup Founder in the incubation program",
    phone: "+27-11-555-0108",
    department: "Participant"
  }
];

// Standard password for all demo users
const DEMO_PASSWORD = "Demo@123";

/**
 * Creates a user in Firebase Auth and Firestore with comprehensive profile data
 */
const createUser = async (user: UserSeed): Promise<boolean> => {
  try {
    console.log(`🔄 Creating ${user.role} user: ${user.email}...`);
    
    // 1. Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      user.email,
      DEMO_PASSWORD
    );

    // 2. Add comprehensive user profile to Firestore
    const userProfile = {
      uid: userCredential.user.uid,
      email: user.email,
      name: user.name,
      role: user.role,
      description: user.description,
      phone: user.phone,
      department: user.department,
      status: "active",
      profileComplete: true,
      emailVerified: true,
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      preferences: {
        theme: "light",
        notifications: true,
        language: "en"
      },
      // Role-specific metadata
      ...(user.role === "Funder" && {
        investmentFocus: ["Technology", "Healthcare", "Fintech"],
        investmentRange: "$50K - $500K",
        portfolioSize: Math.floor(Math.random() * 15) + 5
      }),
             ...(user.role === "Incubatee" && {
         companyName: "Ubuntu Tech Solutions",
         industry: "Technology",
         stage: "Seed",
         foundingDate: "2023-01-15"
       }),
      ...(user.role === "Consultant" && {
        expertise: ["Business Strategy", "Marketing", "Operations"],
        experience: "15+ years",
        activeClients: Math.floor(Math.random() * 10) + 3
      })
    };

    await setDoc(doc(db, "users", userCredential.user.uid), userProfile);

    console.log(`✅ Successfully created ${user.role} user: ${user.name} (${user.email})`);
    return true;
    
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      console.log(`⚠️  User ${user.email} already exists, skipping...`);
      return true;
    } else {
      console.error(`❌ Failed to create ${user.role} user (${user.email}):`, error.message);
      return false;
    }
  }
};

/**
 * Main function to seed all users
 */
const seedAllUsers = async (): Promise<void> => {
  console.log("🌱 Starting comprehensive user seeding process...");
  console.log(`📊 Creating ${usersToSeed.length} demo accounts for all platform roles\n`);
  
  let successCount = 0;
  let failureCount = 0;
  
  // Process users sequentially to avoid rate limiting
  for (const user of usersToSeed) {
    const success = await createUser(user);
    if (success) {
      successCount++;
    } else {
      failureCount++;
    }
    
    // Small delay to prevent rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log("\n" + "=".repeat(60));
  console.log("✨ User seeding completed!");
  console.log(`📈 Success: ${successCount}/${usersToSeed.length} users created`);
  
  if (failureCount > 0) {
    console.log(`⚠️  Failures: ${failureCount} users failed to create`);
  }
  
  console.log("\n🔐 Demo Login Credentials:");
  console.log("Password for ALL users: Demo@123");
  console.log("\n📧 User Accounts:");
  usersToSeed.forEach(user => {
    console.log(`   ${user.role.padEnd(12)} | ${user.email.padEnd(25)} | ${user.name}`);
  });
  
  console.log("\n🎯 You can now login with any of these accounts to test different role permissions!");
};

/**
 * Handle graceful cleanup on process termination
 */
process.on('SIGINT', () => {
  console.log('\n👋 Seeding process interrupted');
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  process.exit(1);
});

// Execute the seeding when run directly
seedAllUsers().catch((error) => {
  console.error('💥 Seeding failed:', error);
  process.exit(1);
});

export { seedAllUsers }; 