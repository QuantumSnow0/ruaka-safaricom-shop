"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { User } from "@supabase/supabase-js";
import { toast } from "react-hot-toast";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    phone: string
  ) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: {
    fullName?: string;
    phone?: string;
  }) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  // Simple admin check
  const isAdmin = user?.email === "bmuthuri93@gmail.com";

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        console.log("Auth: Initial session", { user: session?.user?.email });
      } catch (error) {
        console.error("Auth: Error getting session", error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth: State change", { event, user: session?.user?.email });
      setUser(session?.user ?? null);
      setLoading(false);

      if (event === "SIGNED_OUT") {
        toast.success("You've been signed out");
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Auth: Sign in error", error);
        throw error;
      }

      console.log("Auth: Sign in successful", { user: data.user?.email });
    } catch (error: any) {
      console.error("Auth: Sign in failed", error);
      toast.error(error.message || "Failed to sign in");
      throw error;
    }
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    phone: string
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
          },
        },
      });

      if (error) {
        console.error("Auth: Sign up error", error);
        throw error;
      }

      console.log("Auth: Sign up successful", { user: data.user?.email });
      toast.success(
        "Account created! Please check your email to verify your account."
      );
    } catch (error: any) {
      console.error("Auth: Sign up failed", error);
      toast.error(error.message || "Failed to create account");
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Auth: Sign out error", error);
        throw error;
      }
      console.log("Auth: Sign out successful");
    } catch (error: any) {
      console.error("Auth: Sign out failed", error);
      toast.error(error.message || "Failed to sign out");
      throw error;
    }
  };

  const updateProfile = async (updates: {
    fullName?: string;
    phone?: string;
  }) => {
    try {
      if (!user) {
        throw new Error("No user logged in");
      }

      // Update user metadata
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: updates.fullName,
          phone: updates.phone,
        },
      });

      if (error) {
        console.error("Auth: Update profile error", error);
        throw error;
      }

      // Update profile in profiles table if it exists
      try {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            full_name: updates.fullName,
            phone: updates.phone,
          })
          .eq("id", user.id);

        if (profileError) {
          console.log(
            "Profiles table not found or update failed:",
            profileError
          );
        }
      } catch (e) {
        console.log("Profiles table not available");
      }

      toast.success("Profile updated successfully");
      console.log("Auth: Profile updated successfully");
    } catch (error: any) {
      console.error("Auth: Update profile failed", error);
      toast.error(error.message || "Failed to update profile");
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error("Auth: Reset password error", error);
        throw error;
      }

      console.log("Auth: Reset password email sent", { email });
      toast.success("Password reset email sent! Check your inbox.");
    } catch (error: any) {
      console.error("Auth: Reset password failed", error);
      toast.error(error.message || "Failed to send reset email");
      throw error;
    }
  };

  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        console.error("Auth: Update password error", error);
        throw error;
      }

      console.log("Auth: Password updated successfully");
      toast.success("Password updated successfully!");
    } catch (error: any) {
      console.error("Auth: Update password failed", error);
      toast.error(error.message || "Failed to update password");
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    resetPassword,
    updatePassword,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
