"use client";

import React, { useState } from "react";
import { supabase } from "@lipam/lib/supabase";

export default function TestSupabasePage() {
  const [status, setStatus] = useState("Not tested");
  const [error, setError] = useState("");

  const testSupabase = async () => {
    setStatus("Testing...");
    setError("");

    try {
      // Test basic connection
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        setError(`Auth error: ${error.message}`);
        setStatus("Failed");
        return;
      }

      setStatus(`Success! Session: ${data.session ? "Active" : "No session"}`);
    } catch (err: any) {
      setError(`Connection error: ${err.message}`);
      setStatus("Failed");
    }
  };

  const testSignup = async () => {
    setStatus("Testing signup...");
    setError("");

    try {
      const testEmail = `test-${Date.now()}@example.com`;
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: "TestPassword123",
        options: {
          data: {
            full_name: "Test User",
            phone: "+254700000000",
          },
        },
      });

      if (error) {
        setError(`Signup error: ${error.message}`);
        setStatus("Signup failed");
        return;
      }

      setStatus(`Signup success! User ID: ${data.user?.id}`);
    } catch (err: any) {
      setError(`Signup error: ${err.message}`);
      setStatus("Signup failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Supabase Test Page
          </h1>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Status:</h3>
              <p className="text-sm text-gray-600">{status}</p>
              {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
            </div>

            <div className="space-y-2">
              <button
                onClick={testSupabase}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
              >
                Test Supabase Connection
              </button>

              <button
                onClick={testSignup}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg"
              >
                Test Signup
              </button>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-semibold text-yellow-900 mb-2">
                Environment Check:
              </h3>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>
                  • Supabase URL:{" "}
                  {process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Missing"}
                </li>
                <li>
                  • Supabase Key:{" "}
                  {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
                    ? "Set"
                    : "Missing"}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
