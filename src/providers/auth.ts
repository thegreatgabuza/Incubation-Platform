// src/providers/authProvider.ts
import type { AuthProvider } from "@refinedev/core";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "@/firebase"; // path to your firebase.ts
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const token = await result.user.getIdToken();
      localStorage.setItem("access_token", token);

      // Check the user's role to determine where to redirect
      const userDoc = await getDoc(doc(db, "users", result.user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const role = userData.role;
        
        // Return role-specific redirect path
        if (role === 'Admin') {
          return { success: true, redirectTo: "/admin" };
        } else if (role === 'Director') {
          return { success: true, redirectTo: "/director" };
        } else if (role === 'Operations') {
          return { success: true, redirectTo: "/operations" };
        } else if (role === 'Consultant') {
          return { success: true, redirectTo: "/consultant" };
        } else if (role === 'Funder') {
          return { success: true, redirectTo: "/dashboard" };
        }
      }

      // Default redirect
      return {
        success: true,
        redirectTo: "/dashboard",
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          name: "Login Failed",
          message: error.message,
        },
      };
    }
  },

  logout: async () => {
    await signOut(auth);
    localStorage.removeItem("access_token");

    return {
      success: true,
      redirectTo: "/login",
    };
  },

  check: async () => {
    try {
      return new Promise((resolve) => {
        // Added a delay to ensure page renders first
        setTimeout(() => {
          onAuthStateChanged(auth, (user) => {
            if (user) {
              // User is authenticated, but don't force redirect from the landing page
              // This allows the landing page to be visible even for authenticated users
              const currentPath = window.location.pathname;
              
              if (currentPath === "/") {
                // Special case for root path (landing page)
                // Let authenticated users view the landing page without redirect
                console.log("Authenticated user viewing landing page");
                resolve({ authenticated: true });
              } else if (currentPath === "/login" || currentPath === "/register") {
                // If user is authenticated and trying to access login/register, redirect them to dashboard
                console.log("Redirecting authenticated user from auth pages to dashboard");
                resolve({ 
                  authenticated: true,
                  redirectTo: "/dashboard"
                });
              } else if (currentPath.startsWith("/admin") || 
                         currentPath.startsWith("/director") || 
                         currentPath.startsWith("/operations") || 
                         currentPath.startsWith("/consultant") || 
                         currentPath.startsWith("/dashboard")) {
                // User accessing role-specific routes - verify authentication only
                console.log("User accessing protected route:", currentPath);
                resolve({ authenticated: true });
              } else {
                // Default case - let component handle permissions
                console.log("Default auth check for path:", currentPath);
                resolve({ authenticated: true });
              }
            } else {
              // User is not authenticated
              const currentPath = window.location.pathname;
              
              // Don't redirect from public routes
              if (currentPath === "/" || currentPath === "/login" || currentPath === "/register") {
                console.log("Unauthenticated user on public route:", currentPath);
                resolve({ authenticated: false });
              } else {
                // Otherwise redirect to login
                console.log("Redirecting unauthenticated user to login from:", currentPath);
                resolve({ 
                  authenticated: false, 
                  redirectTo: "/login" 
                });
              }
            }
          });
        }, 100); // Small delay to let page render first
      });
    } catch (error) {
      console.error("Auth check error:", error);
      // If there's an error, don't redirect - let the page load
      return { authenticated: false };
    }
  },

  getIdentity: async () => {
    const user: User | null = auth.currentUser;
    if (user) {
      // Fetch additional user data from Firestore
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          return {
            id: user.uid,
            name: userData.name || user.displayName || user.email || "Anonymous",
            email: user.email,
            avatar: user.photoURL ?? undefined,
            role: userData.role, // Include the user's role
          };
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }

      // Fallback if Firestore fetch fails
      return {
        id: user.uid,
        name: user.displayName || user.email || "Anonymous",
        email: user.email,
        avatar: user.photoURL ?? undefined,
      };
    }
    return undefined;
  },

  onError: async (error) => {
    console.error("Auth provider error:", error);
    return { error };
  },
};
