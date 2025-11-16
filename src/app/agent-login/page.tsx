"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../lipamdogomdogo/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MessageCircle,
  User,
  Lock,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";

// ===== AGENT LOGIN PAGE =====
// This page allows your 3 staff members to log in and access the chat dashboard

export default function AgentLoginPage() {
  const router = useRouter();

  // ===== LOCAL STATE =====
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [isResending, setIsResending] = useState(false);

  // ===== EVENT HANDLERS =====

  // Handle login form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      // Sign in with Supabase Auth
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError) {
        const msg = authError.message || "";
        if (msg.toLowerCase().includes("email not confirmed")) {
          setError(
            "Your email is not confirmed. Please check your inbox for the verification link."
          );
          setIsLoading(false);
          return;
        }
        throw authError;
      }

      // Check if this user is a chat agent (and whether approved)
      const { data: agentRow, error: agentLookupError } = await supabase
        .from("chat_agents")
        .select("id,is_active")
        .eq("user_id", authData.user.id)
        .maybeSingle();

      if (agentLookupError) {
        await supabase.auth.signOut();
        throw agentLookupError;
      }

      if (!agentRow) {
        await supabase.auth.signOut();
        throw new Error(
          "No agent profile found for this account. Please sign up as an agent or contact your administrator."
        );
      }

      if (!agentRow.is_active) {
        await supabase.auth.signOut();
        throw new Error(
          "Your agent account is pending approval. Please wait for admin to activate your access."
        );
      }

      // Redirect to agent dashboard
      router.push(`/agent-dashboard?agentId=${agentRow.id}`);
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Resend verification email
  const handleResendVerification = async () => {
    if (!email) {
      setError("Enter your email above to resend verification.");
      return;
    }
    try {
      setIsResending(true);
      setError("");
      setInfo("");
      const { error: resendError } = await supabase.auth.resend({
        type: "signup",
        email,
      });
      if (resendError) throw resendError;
      setInfo("Verification email sent. Please check your inbox (and spam).");
    } catch (err: any) {
      setError(err.message || "Failed to resend verification email.");
    } finally {
      setIsResending(false);
    }
  };

  // ===== RENDER =====

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-green-500/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">
            Agent Portal
          </h1>
          <p className="text-gray-600">Sign in to manage customer chats</p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
                  placeholder="agent@safaricomshop.com"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </motion.div>
            )}
            {error.toLowerCase().includes("not confirmed") && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Didn&apos;t get the email?</span>
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={isResending}
                  className="text-green-700 hover:text-green-800 font-medium underline disabled:opacity-50"
                >
                  {isResending ? "Sending..." : "Resend verification"}
                </button>
              </div>
            )}
            {info && (
              <motion.div
                className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {info}
              </motion.div>
            )}

            {/* Login Button */}
            <motion.button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </motion.button>
          </form>

          {/* Additional Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center mb-3">
              <p className="text-sm text-gray-700">
                Don&apos;t have an account?{" "}
                <Link
                  href="/agent-signup"
                  className="text-green-700 hover:text-green-800 font-medium underline"
                >
                  Create one
                </Link>
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                For authorized Safaricom Shop staff only
              </p>
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Secure Login</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Real-time Chat</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="text-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-sm text-gray-500">
            Need help? Contact your administrator
          </p>
          <p className="text-xs text-gray-400 mt-1">
            © 2024 Safaricom Shop Ruaka. All rights reserved.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

// ===== EXPORT =====
// This page allows agents to securely log in to access the chat dashboard
