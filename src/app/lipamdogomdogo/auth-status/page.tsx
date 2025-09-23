"use client";

import React, { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function AuthStatusPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClientComponentClient();

        // Get current session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        console.log("Auth Status: Session check", {
          session,
          error: sessionError,
        });

        if (sessionError) {
          setError(sessionError.message);
        } else if (session?.user) {
          setUser(session.user);
          console.log("Auth Status: User found", session.user);
        } else {
          console.log("Auth Status: No user in session");
        }

        setLoading(false);
      } catch (err) {
        console.error("Auth Status: Error", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Authentication Status
        </h1>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="font-semibold text-red-900 mb-2">Error:</h3>
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {user ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">
                ✅ You are logged in!
              </h3>
              <p className="text-sm text-green-800">Email: {user.email}</p>
              <p className="text-sm text-green-800">ID: {user.id}</p>
              <p className="text-sm text-green-800">
                Email Confirmed: {user.email_confirmed_at ? "Yes" : "No"}
              </p>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-semibold text-yellow-900 mb-2">
                Admin Check:
              </h3>
              <p className="text-sm text-yellow-800">
                Is Admin: {user.email === "bmuthuri93@gmail.com" ? "Yes" : "No"}
              </p>
            </div>

            <div className="space-y-2">
              <a
                href="/admin"
                className="w-full block text-center bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg"
              >
                Try Admin Dashboard
              </a>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="font-semibold text-red-900 mb-2">
              ❌ Not logged in
            </h3>
            <p className="text-sm text-red-800 mb-4">
              You need to log in to access the admin dashboard.
            </p>
            <a
              href="/login"
              className="w-full block text-center bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg"
            >
              Go to Login
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

