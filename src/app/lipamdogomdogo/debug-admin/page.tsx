"use client";

import React, { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function DebugAdminPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const checkAuth = async () => {
      try {
        const supabase = createClientComponentClient();

        // Get current session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Session error:", sessionError);
          setError(sessionError.message);
          setLoading(false);
          return;
        }

        console.log("Debug: Session data", { session, user: session?.user });

        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }

        setLoading(false);
      } catch (err) {
        console.error("Debug: Auth check error", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Debug Admin Access
          </h1>

          <div className="space-y-4">
            {/* Loading State */}
            {loading && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Status:</h3>
                <p className="text-sm text-blue-800">
                  Loading authentication data...
                </p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="p-4 bg-red-50 rounded-lg">
                <h3 className="font-semibold text-red-900 mb-2">Error:</h3>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Auth Status */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">
                Authentication Status:
              </h3>
              <p className="text-sm text-gray-600">
                Loading: {loading ? "Yes" : "No"}
              </p>
              <p className="text-sm text-gray-600">
                User: {user ? "Logged In" : "Not Logged In"}
              </p>
              <p className="text-sm text-gray-600">
                Mounted: {mounted ? "Yes" : "No"}
              </p>
            </div>

            {/* User Details */}
            {user && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">
                  User Details:
                </h3>
                <p className="text-sm text-blue-800">Email: {user.email}</p>
                <p className="text-sm text-blue-800">ID: {user.id}</p>
                <p className="text-sm text-blue-800">
                  Email Confirmed: {user.email_confirmed_at ? "Yes" : "No"}
                </p>
                <p className="text-sm text-blue-800">
                  Created: {user.created_at}
                </p>
                <p className="text-sm text-blue-800">
                  Last Sign In: {user.last_sign_in_at}
                </p>
              </div>
            )}

            {/* Admin Check */}
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-semibold text-yellow-900 mb-2">
                Admin Check:
              </h3>
              <p className="text-sm text-yellow-800">
                User Email: {user?.email || "Not logged in"}
              </p>
              <p className="text-sm text-yellow-800">
                Expected Admin Email: bmuthuri93@gmail.com
              </p>
              <p className="text-sm text-yellow-800">
                Emails Match:{" "}
                {user?.email === "bmuthuri93@gmail.com" ? "Yes" : "No"}
              </p>
              <p className="text-sm text-yellow-800">
                User Email Length: {user?.email?.length || 0}
              </p>
              <p className="text-sm text-yellow-800">Admin Email Length: 20</p>
              <p className="text-sm text-yellow-800">
                Exact Match:{" "}
                {user?.email === "bmuthuri93@gmail.com" ? "Yes" : "No"}
              </p>
            </div>

            {/* Environment Check */}
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">
                Environment Check:
              </h3>
              <p className="text-sm text-green-800">
                NEXT_PUBLIC_ADMIN_EMAIL:{" "}
                {process.env.NEXT_PUBLIC_ADMIN_EMAIL || "Not set"}
              </p>
              <p className="text-sm text-green-800">
                NODE_ENV: {process.env.NODE_ENV}
              </p>
            </div>

            {/* Raw User Object */}
            {user && (
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold text-purple-900 mb-2">
                  Raw User Object:
                </h3>
                <pre className="text-xs text-purple-800 overflow-auto">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2">
              <a
                href="/admin"
                className="w-full block text-center bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg"
              >
                Try Admin Dashboard
              </a>

              <a
                href="/login"
                className="w-full block text-center border border-orange-500 text-orange-500 hover:bg-orange-50 py-2 px-4 rounded-lg"
              >
                Go to Login
              </a>

              <button
                onClick={() => window.location.reload()}
                className="w-full block text-center border border-gray-500 text-gray-500 hover:bg-gray-50 py-2 px-4 rounded-lg"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

