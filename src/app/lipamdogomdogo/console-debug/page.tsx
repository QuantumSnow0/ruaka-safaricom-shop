"use client";

import React, { useEffect } from "react";

export default function ConsoleDebugPage() {
  useEffect(() => {
    console.log("=== CONSOLE DEBUG START ===");

    // Check environment variables
    console.log("Environment Variables:");
    console.log(
      "NEXT_PUBLIC_ADMIN_EMAIL:",
      process.env.NEXT_PUBLIC_ADMIN_EMAIL
    );
    console.log("NODE_ENV:", process.env.NODE_ENV);
    console.log(
      "NEXT_PUBLIC_SUPABASE_URL:",
      process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Not set"
    );
    console.log(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY:",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Not set"
    );

    // Check localStorage
    console.log("Local Storage Keys:");
    Object.keys(localStorage).forEach((key) => {
      console.log(
        `${key}:`,
        localStorage.getItem(key)?.substring(0, 100) + "..."
      );
    });

    // Check cookies
    console.log("Cookies:", document.cookie);

    // Check admin email comparison
    const adminEmail =
      process.env.NEXT_PUBLIC_ADMIN_EMAIL || "bmuthuri93@gmail.com";
    console.log("Admin Email Check:");
    console.log("Expected:", "bmuthuri93@gmail.com");
    console.log("Environment:", adminEmail);
    console.log("Match:", adminEmail === "bmuthuri93@gmail.com");

    console.log("=== CONSOLE DEBUG END ===");
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Console Debug Page
        </h1>
        <p className="text-gray-600 mb-4">
          Check your browser console (F12) for debug information
        </p>
        <div className="space-y-2">
          <a
            href="/admin"
            className="block bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg"
          >
            Try Admin Dashboard
          </a>
          <a
            href="/login"
            className="block border border-orange-500 text-orange-500 hover:bg-orange-50 py-2 px-4 rounded-lg"
          >
            Go to Login
          </a>
        </div>
      </div>
    </div>
  );
}

