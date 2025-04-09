// src/providers/authProvider.ts
import type { AuthProvider } from "@refinedev/core";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "@/firebase"; // path to your firebase.ts

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const token = await result.user.getIdToken();
      localStorage.setItem("access_token", token);

      return {
        success: true,
        redirectTo: "/",
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
    return new Promise((resolve) => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          resolve({ authenticated: true });
        } else {
          resolve({ authenticated: false, redirectTo: "/login" });
        }
      });
    });
  },

  getIdentity: async () => {
    const user: User | null = auth.currentUser;
    if (user) {
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
    return { error };
  },
};
