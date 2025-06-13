import { doc, updateDoc, getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Script to update existing user profiles with Zulu names
 */

interface UserUpdate {
  email: string;
  newName: string;
  newPhone: string;
}

// Map of email addresses to new Zulu names
const userUpdates: UserUpdate[] = [
  {
    email: "admin@demodbn.com",
    newName: "Nomsa Mthembu",
    newPhone: "+27-11-555-0101"
  },
  {
    email: "director@demodbn.com", 
    newName: "Sipho Ndlovu",
    newPhone: "+27-11-555-0102"
  },
  {
    email: "operations@demodbn.com",
    newName: "Thandi Zulu",
    newPhone: "+27-11-555-0103"
  },
  {
    email: "consultant@demodbn.com",
    newName: "Mandla Dlamini",
    newPhone: "+27-11-555-0104"
  },
  {
    email: "funder@demodbn.com",
    newName: "Zanele Nkomo",
    newPhone: "+27-11-555-0105"
  },
  {
    email: "government@demodbn.com",
    newName: "Bongani Mkhize",
    newPhone: "+27-11-555-0106"
  },
  {
    email: "corporate@demodbn.com",
    newName: "Lindiwe Buthelezi",
    newPhone: "+27-11-555-0107"
  },
  {
    email: "incubatee@demodbn.com",
    newName: "Sizani Mbeki",
    newPhone: "+27-11-555-0108"
  }
];

/**
 * Updates a user's name and phone number by email
 */
const updateUserByEmail = async (userUpdate: UserUpdate): Promise<boolean> => {
  try {
    console.log(`🔄 Updating user: ${userUpdate.email} -> ${userUpdate.newName}...`);
    
    // Find user by email
    const q = query(collection(db, "users"), where("email", "==", userUpdate.email));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log(`⚠️  User with email ${userUpdate.email} not found`);
      return false;
    }
    
    // Update each matching document (should be only one)
    for (const docSnapshot of querySnapshot.docs) {
      const userRef = doc(db, "users", docSnapshot.id);
      
      const updateData: any = {
        name: userUpdate.newName,
        phone: userUpdate.newPhone,
        updatedAt: new Date().toISOString()
      };
      
      // Add specific updates for incubatee
      if (userUpdate.email === "incubatee@demodbn.com") {
        updateData.companyName = "Ubuntu Tech Solutions";
      }
      
      await updateDoc(userRef, updateData);
      
      console.log(`✅ Successfully updated: ${userUpdate.newName} (${userUpdate.email})`);
    }
    
    return true;
    
  } catch (error: any) {
    console.error(`❌ Failed to update user ${userUpdate.email}:`, error.message);
    return false;
  }
};

/**
 * Main function to update all user names
 */
const updateAllUserNames = async (): Promise<void> => {
  console.log("🔄 Starting user name updates to Zulu names...");
  console.log(`📊 Updating ${userUpdates.length} user profiles\n`);
  
  let successCount = 0;
  let failureCount = 0;
  
  // Process users sequentially
  for (const userUpdate of userUpdates) {
    const success = await updateUserByEmail(userUpdate);
    if (success) {
      successCount++;
    } else {
      failureCount++;
    }
    
    // Small delay to prevent rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log("\n" + "=".repeat(60));
  console.log("✨ User name updates completed!");
  console.log(`📈 Success: ${successCount}/${userUpdates.length} users updated`);
  
  if (failureCount > 0) {
    console.log(`⚠️  Failures: ${failureCount} users failed to update`);
  }
  
  console.log("\n🎯 Updated User Profiles:");
  userUpdates.forEach(user => {
    console.log(`   ${user.newName.padEnd(20)} | ${user.email}`);
  });
  
  console.log("\n🔐 Login credentials remain the same: Demo@123");
};

// Execute the updates
updateAllUserNames().catch((error) => {
  console.error('💥 Update failed:', error);
  process.exit(1);
}); 