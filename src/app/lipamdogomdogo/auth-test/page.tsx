"use client";

import React from "react";
import { useAuth } from "@lipam/contexts/AuthContext";
import Button from "@lipam/components/ui/Button";

export default function AuthTestPage() {
  const { user, loading, isAdmin, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Auth Test
        </h1>

        {user ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">
                ✅ Logged In
              </h3>
              <p className="text-sm text-green-800">Email: {user.email}</p>
              <p className="text-sm text-green-800">ID: {user.id}</p>
              <p className="text-sm text-green-800">
                Email Confirmed: {user.email_confirmed_at ? "Yes" : "No"}
              </p>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-semibold text-yellow-900 mb-2">
                Admin Status
              </h3>
              <p className="text-sm text-yellow-800">
                Is Admin: {isAdmin ? "Yes" : "No"}
              </p>
            </div>

            <div className="space-y-2">
              <Button
                onClick={() => (window.location.href = "/admin")}
                className="w-full"
              >
                Try Admin Dashboard
              </Button>

              <Button onClick={signOut} variant="outline" className="w-full">
                Sign Out
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="font-semibold text-red-900 mb-2">
                ❌ Not Logged In
              </h3>
              <p className="text-sm text-red-800">
                You need to log in to test admin access.
              </p>
            </div>

            <div className="space-y-2">
              <Button
                onClick={() => (window.location.href = "/login")}
                className="w-full"
              >
                Go to Login
              </Button>

              <Button
                onClick={() => (window.location.href = "/signup")}
                variant="outline"
                className="w-full"
              >
                Go to Sign Up
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
