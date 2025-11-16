"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import AdminAuth from "@lipam/components/admin/AdminAuth";
import {
  CheckCircle,
  XCircle,
  UserPlus,
  RefreshCw,
  Search,
  Shield,
} from "lucide-react";
import { format } from "date-fns";

interface ChatAgent {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  is_active: boolean;
  created_at: string;
}

export default function AdminAgentsPage() {
  const supabase = createClientComponentClient();
  const [agents, setAgents] = useState<ChatAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchAgents = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("chat_agents")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setAgents(data as ChatAgent[]);
    } catch (err: any) {
      console.error("Failed to fetch agents", err);
      setError(err.message || "Failed to fetch agents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredAgents = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return agents;
    return agents.filter((a) => {
      return (
        (a.full_name || "").toLowerCase().includes(q) ||
        (a.email || "").toLowerCase().includes(q)
      );
    });
  }, [agents, search]);

  const toggleAgent = async (agent: ChatAgent, nextActive: boolean) => {
    setUpdatingId(agent.id);
    setError(null);
    try {
      const { error } = await supabase
        .from("chat_agents")
        .update({ is_active: nextActive })
        .eq("id", agent.id);
      if (error) throw error;
      // Update local state
      setAgents((prev) =>
        prev.map((a) => (a.id === agent.id ? { ...a, is_active: nextActive } : a))
      );
    } catch (err: any) {
      console.error("Failed to update agent", err);
      setError(err.message || "Failed to update agent");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <AdminAuth>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Shield className="w-7 h-7 text-emerald-600" />
              Agent Management
            </h1>
            <p className="text-gray-600">
              Review sign-ups and approve or disable access to the agent dashboard.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow border border-gray-200">
            <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <div className="relative w-full sm:w-80">
                <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={fetchAgents}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700"
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                  Refresh
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="py-20 text-center text-gray-600">Loading agents...</div>
              ) : filteredAgents.length === 0 ? (
                <div className="py-20 text-center text-gray-600">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                    <UserPlus className="h-6 w-6 text-gray-400" />
                  </div>
                  No agents found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Email
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Joined
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {filteredAgents.map((agent) => (
                        <tr key={agent.id}>
                          <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                            {agent.full_name || "—"}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                            {agent.email || "—"}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                agent.is_active
                                  ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                                  : "bg-yellow-50 text-yellow-800 ring-1 ring-yellow-200"
                              }`}
                            >
                              {agent.is_active ? "Active" : "Pending"}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                            {agent.created_at
                              ? format(new Date(agent.created_at), "dd MMM yyyy")
                              : "—"}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
                            {agent.is_active ? (
                              <button
                                onClick={() => toggleAgent(agent, false)}
                                disabled={updatingId === agent.id}
                                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-1.5 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                              >
                                <XCircle className="h-4 w-4 text-red-500" />
                                Disable
                              </button>
                            ) : (
                              <button
                                onClick={() => toggleAgent(agent, true)}
                                disabled={updatingId === agent.id}
                                className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 px-3 py-1.5 text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"
                              >
                                <CheckCircle className="h-4 w-4 text-emerald-600" />
                                Approve
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminAuth>
  );
}


