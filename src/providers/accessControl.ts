import { AccessControlProvider } from "@refinedev/core";
import { auth } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";

/**
 * Access control provider for Refine
 * This provider controls access to resources based on user roles
 */
export const accessControlProvider: AccessControlProvider = {
  can: async ({ resource, action, params }) => {
    // If no authenticated user, deny access
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return {
        can: false,
        reason: "Unauthorized: Please login first",
      };
    }

    try {
      // Get user's role from Firestore
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      if (!userDoc.exists()) {
        return {
          can: false, 
          reason: "User data not found"
        };
      }

      const userData = userDoc.data();
      const userRole = userData.role;

      // Special case to control sidebar visibility for operations users
      if (userRole === "Operations") {
        // Operations users should only see operations resources in the sidebar
        if (action === "list" && (resource === "dashboard" || resource === "companies")) {
          return {
            can: false,
            reason: "Resource not available for Operations users",
          };
        }
      }

      // Define access rules based on resources and roles
      if (resource === "dashboard" || resource === "companies") {
        // Common resources - all authenticated users can access except when restricted above
        return { can: true };
      }

      if ((resource === "admin" || resource === "forms") && userRole !== "Admin") {
        return {
          can: false,
          reason: "You need Admin privileges to access this resource",
        };
      }

      if (resource === "director" && userRole !== "Director") {
        return {
          can: false,
          reason: "You need Director privileges to access this resource",
        };
      }

      if (resource === "operations" && userRole !== "Operations") {
        return {
          can: false,
          reason: "You need Operations privileges to access this resource",
        };
      }

      if (resource === "consultant" && userRole !== "Consultant") {
        return {
          can: false,
          reason: "You need Consultant privileges to access this resource",
        };
      }

      // Default: allow access
      return { can: true };
    } catch (error) {
      console.error("Error checking permissions:", error);
      return {
        can: false,
        reason: "An error occurred while checking permissions",
      };
    }
  },
}; 