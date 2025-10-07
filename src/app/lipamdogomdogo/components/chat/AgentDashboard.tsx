"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../lib/supabase";
import { useChat } from "../../contexts/ChatContext";
import {
  MessageCircle,
  User,
  Clock,
  CheckCircle,
  Send,
  Phone,
  Mail,
  AlertCircle,
  Loader2,
  Users,
  Eye,
  EyeOff,
  LogOut,
  Settings,
  Bell,
  Search,
  Filter,
  X,
} from "lucide-react";
import { ChatConversation, ChatMessage, ChatAgent } from "../../lib/types";

// ===== AGENT DASHBOARD COMPONENT =====
// This is the dashboard where your 3 staff members can manage incoming chats
// They can see all conversations, respond to customers, and manage their status

interface AgentDashboardProps {
  agentId: string;
  onLogout: () => void;
}

export default function AgentDashboard({
  agentId,
  onLogout,
}: AgentDashboardProps) {
  // ===== CHAT CONTEXT =====
  const { sendAgentMessage } = useChat();

  // ===== LOCAL STATE =====
  const [agent, setAgent] = useState<ChatAgent | null>(null);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [currentConversation, setCurrentConversation] =
    useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "waiting" | "active" | "closed"
  >("all");
  const [isOnline, setIsOnline] = useState(false);

  // ===== REFS =====
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ===== EFFECTS =====

  // Load agent data
  useEffect(() => {
    loadAgentData();
  }, [agentId]);

  // Set up realtime subscriptions
  useEffect(() => {
    if (!agent) return;

    // Subscribe to conversation updates
    const conversationSubscription = supabase
      .channel("agent-conversations")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chat_conversations" },
        (payload) => {
          // Reload conversations when they change
          loadConversations();
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages" },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          // If this message is for the current conversation, add it
          if (
            currentConversation &&
            newMessage.conversation_id === currentConversation.id
          ) {
            setMessages((prev) => [...prev, newMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(conversationSubscription);
    };
  }, [agent, currentConversation]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load conversations when agent changes
  useEffect(() => {
    if (agent) {
      loadConversations();
    }
  }, [agent]);

  // ===== FUNCTIONS =====

  // Load agent data
  const loadAgentData = async () => {
    try {
      const { data, error } = await supabase
        .from("chat_agents")
        .select("*")
        .eq("id", agentId)
        .single();

      if (error) throw error;
      setAgent(data);
      setIsOnline(data.status === "online");
    } catch (error) {
      console.error("Failed to load agent data:", error);
      setError("Failed to load agent data");
    }
  };

  // Load conversations assigned to this agent
  const loadConversations = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("chat_conversations")
        .select("*")
        .or(`agent_id.eq.${agentId},agent_id.is.null`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error("Failed to load conversations:", error);
      setError("Failed to load conversations");
    } finally {
      setIsLoading(false);
    }
  };

  // Load messages for a specific conversation
  const loadMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Failed to load messages:", error);
      setError("Failed to load messages");
    }
  };

  // Select a conversation
  const selectConversation = async (conversation: ChatConversation) => {
    setCurrentConversation(conversation);
    await loadMessages(conversation.id);

    // Mark messages as read
    await markMessagesAsRead(conversation.id);
  };

  // Send a message
  const sendMessage = async (content: string) => {
    if (!currentConversation || !content.trim() || !agent) return;

    try {
      setIsLoading(true);

      // If conversation is not assigned to this agent, assign it
      if (!currentConversation.agent_id) {
        const { error: assignError } = await supabase
          .from("chat_conversations")
          .update({
            agent_id: agent.id,
            status: "active",
          })
          .eq("id", currentConversation.id);

        if (assignError) throw assignError;

        // Update local state
        setCurrentConversation((prev) =>
          prev
            ? {
                ...prev,
                agent_id: agent.id,
                status: "active",
              }
            : null
        );
      }

      // Use the context's sendAgentMessage function
      await sendAgentMessage(
        currentConversation.id,
        content.trim(),
        agent.user_id,
        agent.name
      );

      // Refresh messages to get the latest state
      await loadMessages(currentConversation.id);
      setMessageInput("");
    } catch (error) {
      console.error("Failed to send message:", error);
      setError("Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  // Mark messages as read
  const markMessagesAsRead = async (conversationId: string) => {
    try {
      await supabase
        .from("chat_messages")
        .update({ is_read: true })
        .eq("conversation_id", conversationId)
        .eq("sender_type", "customer");
    } catch (error) {
      console.error("Failed to mark messages as read:", error);
    }
  };

  // Update agent status
  const updateAgentStatus = async (status: "online" | "away" | "offline") => {
    try {
      const { error } = await supabase
        .from("chat_agents")
        .update({ status })
        .eq("id", agentId);

      if (error) {
        console.warn(
          "Agent status update failed (RLS permission issue), continuing with local state only:",
          error
        );
        // Continue with local state update even if database update fails
        setIsOnline(status === "online");
        setAgent((prev) => (prev ? { ...prev, status } : null));
        return;
      }

      setIsOnline(status === "online");
      setAgent((prev) => (prev ? { ...prev, status } : null));
    } catch (error) {
      console.warn(
        "Agent status update failed, continuing with local state only:",
        error
      );
      // Continue with local state update even if database update fails
      setIsOnline(status === "online");
      setAgent((prev) => (prev ? { ...prev, status } : null));
    }
  };

  // Handle message form submission
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendMessage(messageInput);
  };

  // ===== FILTERED CONVERSATIONS =====
  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch =
      conv.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.customer_email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || conv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // ===== RENDER =====
  if (!agent) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
        <span className="ml-2">Loading agent dashboard...</span>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* ===== SIDEBAR ===== */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Agent Header */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-semibold">{agent.name}</h2>
                <p className="text-sm text-green-100">Agent Dashboard</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Status Toggle */}
          <div className="mt-4 flex space-x-2">
            <button
              onClick={() => updateAgentStatus("online")}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                isOnline
                  ? "bg-green-400 text-white"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              Online
            </button>
            <button
              onClick={() => updateAgentStatus("away")}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                agent.status === "away"
                  ? "bg-yellow-400 text-white"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              Away
            </button>
            <button
              onClick={() => updateAgentStatus("offline")}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                !isOnline
                  ? "bg-red-400 text-white"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              Offline
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-black pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Conversations</option>
            <option value="waiting">Waiting</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-green-600" />
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No conversations found</p>
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {filteredConversations.map((conversation) => (
                <motion.div
                  key={conversation.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    currentConversation?.id === conversation.id
                      ? "bg-green-50 border border-green-200"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => selectConversation(conversation)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm text-gray-900">
                      {conversation.customer_name || "Anonymous"}
                    </h4>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        conversation.status === "waiting"
                          ? "bg-yellow-100 text-yellow-800"
                          : conversation.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {conversation.status}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>
                      {new Date(
                        conversation.last_message_at || conversation.created_at
                      ).toLocaleString([], {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {conversation.customer_email && (
                    <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1">
                      <Mail className="w-3 h-3" />
                      <span>{conversation.customer_email}</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ===== MAIN CHAT AREA ===== */}
      <div className="flex-1 flex flex-col">
        {currentConversation ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {currentConversation.customer_name ||
                        "Anonymous Customer"}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      {currentConversation.customer_email && (
                        <div className="flex items-center space-x-1">
                          <Mail className="w-3 h-3" />
                          <span>{currentConversation.customer_email}</span>
                        </div>
                      )}
                      {currentConversation.customer_phone && (
                        <div className="flex items-center space-x-1">
                          <Phone className="w-3 h-3" />
                          <span>{currentConversation.customer_phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      currentConversation.status === "waiting"
                        ? "bg-yellow-100 text-yellow-800"
                        : currentConversation.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {currentConversation.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={`${message.id}-${index}`}
                  className={`flex ${
                    message.sender_type === "agent"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                      message.sender_type === "agent"
                        ? "bg-green-500 text-white"
                        : message.sender_type === "system"
                        ? "bg-gray-100 text-gray-700 text-center"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p>{message.content}</p>
                    <div
                      className={`text-xs mt-1 opacity-70 ${
                        message.sender_type === "agent"
                          ? "text-green-100"
                          : "text-gray-500"
                      }`}
                    >
                      {new Date(message.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {message.is_read &&
                        message.sender_type === "customer" && (
                          <CheckCircle className="w-3 h-3 inline ml-1" />
                        )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 text-gray-900 bg-white"
                />
                <button
                  type="submit"
                  disabled={!messageInput.trim() || isLoading}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </form>
            </div>
          </>
        ) : (
          /* No Conversation Selected */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Select a conversation
              </h3>
              <p className="text-gray-500">
                Choose a conversation from the sidebar to start chatting
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2 max-w-sm">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
          <button
            onClick={() => setError(null)}
            className="text-red-600 hover:text-red-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

// ===== EXPORT =====
// This component provides a complete agent dashboard for managing customer chats
