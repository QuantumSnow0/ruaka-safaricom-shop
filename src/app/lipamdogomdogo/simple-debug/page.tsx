"use client";

import React, { useEffect, useState } from "react";

export default function SimpleDebugPage() {
  const [mounted, setMounted] = useState(false);
  const [localStorageData, setLocalStorageData] = useState<any>(null);
  const [cookies, setCookies] = useState<string>("");

  useEffect(() => {
    setMounted(true);

    // Get data from localStorage
    const supabaseData =
      localStorage.getItem("sb-localhost-auth-token") ||
      localStorage.getItem("supabase.auth.token") ||
      "No Supabase data found";

    setLocalStorageData(supabaseData);

    // Get cookies
    setCookies(document.cookie);

    console.log("SimpleDebug: Page loaded", {
      localStorage: supabaseData,
      cookies: document.cookie,
      userAgent: navigator.userAgent,
    });
  }, []);

  if (!mounted) {
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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Simple Debug - No Supabase Calls
          </h1>

          <div className="space-y-4">
            {/* Basic Info */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Basic Info:</h3>
              <p className="text-sm text-gray-600">
                Mounted: {mounted ? "Yes" : "No"}
              </p>
              <p className="text-sm text-gray-600">
                URL:{" "}
                {typeof window !== "undefined"
                  ? window.location.href
                  : "Server"}
              </p>
              <p className="text-sm text-gray-600">
                User Agent:{" "}
                {typeof window !== "undefined"
                  ? navigator.userAgent.substring(0, 50) + "..."
                  : "Server"}
              </p>
            </div>

            {/* Environment Variables */}
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">
                Environment Variables:
              </h3>
              <p className="text-sm text-green-800">
                NEXT_PUBLIC_ADMIN_EMAIL:{" "}
                {process.env.NEXT_PUBLIC_ADMIN_EMAIL || "Not set"}
              </p>
              <p className="text-sm text-green-800">
                NODE_ENV: {process.env.NODE_ENV}
              </p>
              <p className="text-sm text-green-800">
                NEXT_PUBLIC_SUPABASE_URL:{" "}
                {process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Not set"}
              </p>
              <p className="text-sm text-green-800">
                NEXT_PUBLIC_SUPABASE_ANON_KEY:{" "}
                {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Not set"}
              </p>
            </div>

            {/* Local Storage */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">
                Local Storage (Supabase):
              </h3>
              <pre className="text-xs text-blue-800 overflow-auto bg-white p-2 rounded border">
                {typeof localStorageData === "string"
                  ? localStorageData
                  : JSON.stringify(localStorageData, null, 2)}
              </pre>
            </div>

            {/* Cookies */}
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-semibold text-yellow-900 mb-2">Cookies:</h3>
              <pre className="text-xs text-yellow-800 overflow-auto bg-white p-2 rounded border">
                {cookies || "No cookies found"}
              </pre>
            </div>

            {/* All Local Storage Keys */}
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-2">
                All Local Storage Keys:
              </h3>
              <div className="text-xs text-purple-800 bg-white p-2 rounded border">
                {typeof window !== "undefined"
                  ? Object.keys(localStorage).map((key) => (
                      <div key={key} className="mb-1">
                        <strong>{key}:</strong>{" "}
                        {localStorage.getItem(key)?.substring(0, 100)}...
                      </div>
                    ))
                  : "Server side"}
              </div>
            </div>

            {/* Test Admin Access */}
            <div className="p-4 bg-red-50 rounded-lg">
              <h3 className="font-semibold text-red-900 mb-2">
                Admin Access Test:
              </h3>
              <p className="text-sm text-red-800">
                Expected Admin Email: bmuthuri93@gmail.com
              </p>
              <p className="text-sm text-red-800">
                Environment Admin Email:{" "}
                {process.env.NEXT_PUBLIC_ADMIN_EMAIL || "Not set"}
              </p>
              <p className="text-sm text-red-800">
                Emails Match:{" "}
                {process.env.NEXT_PUBLIC_ADMIN_EMAIL === "bmuthuri93@gmail.com"
                  ? "Yes"
                  : "No"}
              </p>
            </div>

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

