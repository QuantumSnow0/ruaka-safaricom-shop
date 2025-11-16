"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../lipamdogomdogo/lib/supabase";
import AgentDashboard from "../lipamdogomdogo/components/chat/AgentDashboard";
import { Loader2, AlertCircle } from "lucide-react";

// ===== AGENT DASHBOARD CONTENT =====
// This component handles the actual dashboard logic
function AgentDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");

  // ===== EFFECTS =====

  // Check authentication on component mount
  useEffect(() => {
    checkAuthentication();
  }, []);

  // ===== FUNCTIONS =====

  // Check if user is authenticated and is a valid agent
  const checkAuthentication = async () => {
    try {
      setIsLoading(true);

      // Get the current user
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        router.push("/agent-login");
        return;
      }

      // Get agent ID from URL params
      const agentId = searchParams.get("agentId");

      if (!agentId) {
        setError("Invalid agent ID");
        setIsLoading(false);
        return;
      }

      // Verify this user is the agent
      const { data: agentData, error: agentError } = await supabase
        .from("chat_agents")
        .select("*")
        .eq("id", agentId)
        .eq("user_id", user.id)
        .eq("is_active", true)
        .single();

      if (agentError || !agentData) {
        setError("Access denied. You are not authorized as a chat agent.");
        setIsLoading(false);
        return;
      }

      setIsAuthenticated(true);
      setIsLoading(false);
    } catch (error) {
      console.error("Authentication error:", error);
      setError("Authentication failed. Please try logging in again.");
      setIsLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/agent-login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // ===== RENDER =====

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Access Denied
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => router.push("/agent-login")}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Render dashboard
  const agentId = searchParams.get("agentId");
  const initialConversationId = searchParams.get("conversationId") || undefined;

  if (!agentId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Invalid Request
          </h2>
          <p className="text-gray-600 mb-4">Agent ID is missing</p>
          <button
            onClick={() => router.push("/agent-login")}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <AgentDashboard
      agentId={agentId}
      onLogout={handleLogout}
      initialConversationId={initialConversationId}
    />
  );
}

// ===== MAIN PAGE COMPONENT =====
// This wraps the dashboard content in a Suspense boundary for useSearchParams
export default function AgentDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading agent dashboard...</p>
          </div>
        </div>
      }
    >
      <AgentDashboardContent />
    </Suspense>
  );
}
