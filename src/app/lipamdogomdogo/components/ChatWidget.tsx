"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "../contexts/ChatContext";
import {
  MessageCircle,
  X,
  Minimize2,
  Maximize2,
  Send,
  User,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

// ===== CHAT WIDGET COMPONENT =====
// This is the main chat widget that customers see on your website
// It includes a floating button and expandable chat window

export default function ChatWidget() {
  const {
    // State from context
    isWidgetOpen,
    isWidgetMinimized,
    currentConversation,
    messages,
    customerInfo,
    isLoading,
    error,
    config,
    isConnected,
    // Functions from context
    toggleWidget,
    minimizeWidget,
    maximizeWidget,
    startConversation,
    sendMessage,
    closeConversation,
    updateCustomerName,
    updateCustomerEmail,
    updateCustomerPhone,
    markMessagesAsRead,
    pollMessages,
    isBusinessHours,
    isAnyAgentOnline,
    isAgentAvailable,
    loadAvailableAgents,
  } = useChat();

  // ===== LOCAL STATE =====
  const [messageInput, setMessageInput] = useState("");
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [localCustomerInfo, setLocalCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // ===== REFS =====
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);

  // ===== EFFECTS =====

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Poll for new messages and agent status every 3 seconds (since real-time doesn't work for anonymous users)
  useEffect(() => {
    if (isWidgetOpen) {
      const interval = setInterval(() => {
        // Poll messages if in a conversation
        if (currentConversation?.id) {
          pollMessages(currentConversation.id);
        }
        // Always poll for agent status updates
        loadAvailableAgents();
      }, 3000); // Poll every 3 seconds

      return () => clearInterval(interval);
    }
  }, [
    currentConversation?.id,
    isWidgetOpen,
    pollMessages,
    loadAvailableAgents,
  ]);

  // Focus input when widget opens
  useEffect(() => {
    if (isWidgetOpen && !isWidgetMinimized) {
      setTimeout(() => {
        messageInputRef.current?.focus();
      }, 100);
    }
  }, [isWidgetOpen, isWidgetMinimized]);

  // Mark messages as read when conversation is active
  useEffect(() => {
    if (currentConversation && currentConversation.status === "active") {
      markMessagesAsRead(currentConversation.id);
    }
  }, [currentConversation, markMessagesAsRead]);

  // ===== EVENT HANDLERS =====

  // Handle sending a message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!messageInput.trim() || isLoading) return;

    // If no conversation exists, start one
    if (!currentConversation) {
      await startConversation(localCustomerInfo);
    }

    // Send the message
    await sendMessage(messageInput);
    setMessageInput("");
  };

  // Handle starting a new conversation
  const handleStartConversation = async () => {
    if (!localCustomerInfo.name.trim()) {
      alert("Please enter your name to start a chat");
      return;
    }

    await startConversation(localCustomerInfo);
    setShowCustomerForm(false);
  };

  // Handle customer info input changes
  const handleCustomerInfoChange = (
    field: "name" | "email" | "phone",
    value: string
  ) => {
    setLocalCustomerInfo((prev) => ({ ...prev, [field]: value }));

    // Update context as well
    if (field === "name") updateCustomerName(value);
    if (field === "email") updateCustomerEmail(value);
    if (field === "phone") updateCustomerPhone(value);
  };

  // ===== RENDER CONDITIONS =====

  // Don't render if chat is disabled
  if (!config?.is_enabled) return null;

  // Check if it's business hours and agent availability
  const isOpen = isBusinessHours();
  const agentsAvailable = isAgentAvailable();
  const anyAgentOnline = isAnyAgentOnline();

  // ===== RENDER COMPONENT =====

  return (
    <>
      <style jsx>{`
        .chat-scroll::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .chat-scroll::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 9999px;
        }
        .chat-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
      {/* ===== FLOATING CHAT BUTTON (Modern pill) ===== */}
      <motion.div
        className={`fixed bottom-6 right-6 z-50 ${
          isWidgetOpen ? "md:block hidden" : "block"
        }`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
      >
        <motion.button
          onClick={() => {
            if (typeof window !== "undefined" && window.innerWidth >= 768) {
              toggleWidget();
            } else {
              window.open("/live-chat", "_blank");
            }
          }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          aria-label="Open live chat"
          className={`
            group flex items-center gap-3 pl-4 pr-2 py-2 rounded-full shadow-xl
            border border-white/30 backdrop-blur-md
            ${
              isOpen
                ? "bg-white/80 hover:bg-white"
                : "bg-gray-200/80 hover:bg-gray-200"
            }
            ring-1 ring-black/5
          `}
        >
          {/* Icon with status pulse */}
          <div className="relative flex items-center justify-center w-11 h-11 rounded-full bg-white/90 border border-gray-200 shadow-sm backdrop-blur">
            <img
              src="/helpline.png"
              alt="Live Chat"
              className="w-7 h-7 object-contain"
            />
            {/* Status dot + pulse */}
            <span className="absolute -right-0.5 -top-0.5 inline-flex items-center justify-center">
              {agentsAvailable ? (
                <>
                  <span className="absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-white" />
                </>
              ) : anyAgentOnline ? (
                <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-400 border-2 border-white" />
              ) : (
                <span className="relative inline-flex rounded-full h-3 w-3 bg-gray-400 border-2 border-white" />
              )}
            </span>
          </div>

          {/* Label */}
          <div className="flex flex-col items-start pr-1 select-none">
            <span className="text-sm font-semibold text-gray-800 leading-none">
              Live Chat
            </span>
            <span className="text-[11px] mt-0.5 text-gray-500">
              {agentsAvailable
                ? "Online now"
                : anyAgentOnline
                ? "Agents available"
                : "Offline"}
            </span>
          </div>

          {/* Right CTA chip removed on all breakpoints per request */}
        </motion.button>
      </motion.div>

      {/* ===== Desktop Inline Chat Panel ===== */}
      <AnimatePresence>
        {isWidgetOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-6 right-6 z-50 hidden md:flex md:flex-col w-[380px] max-h-[70vh] h-[560px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white/80 backdrop-blur">
              <div className="flex items-center gap-2">
                <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-white border border-gray-200">
                  <img
                    src="/helpline.png"
                    alt="Live Chat"
                    className="w-5 h-5 object-contain"
                  />
                  <span className="absolute -right-0.5 -top-0.5 inline-flex items-center justify-center">
                    {agentsAvailable ? (
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500 border-2 border-white" />
                    ) : anyAgentOnline ? (
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-400 border-2 border-white" />
                    ) : (
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gray-400 border-2 border-white" />
                    )}
                  </span>
                </div>
                <div className="leading-tight">
                  <div className="text-sm font-semibold text-gray-900">
                    Safaricom Shop
                  </div>
                  <div className="text-xs text-gray-500">
                    {agentsAvailable
                      ? "Online now"
                      : anyAgentOnline
                      ? "Agents available"
                      : "Offline"}
                  </div>
                </div>
              </div>
              <button
                onClick={toggleWidget}
                className="p-2 rounded-full hover:bg-gray-100 transition"
                aria-label="Close chat"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Messages */}
            <div className="chat-scroll flex-1 overflow-y-auto px-3 py-3 space-y-2 bg-gray-50">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-500 text-sm select-none">
                  Start chatting with us!
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={`${message.id}-${index}`}
                    className={`flex ${
                      message.sender_type === "customer"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow ${
                        message.sender_type === "customer"
                          ? "bg-emerald-500 text-white rounded-tr-sm"
                          : message.sender_type === "system"
                          ? "bg-gray-200 text-gray-700"
                          : "bg-white text-gray-900 rounded-tl-sm"
                      }`}
                    >
                      {message.sender_type !== "customer" &&
                        message.sender_type !== "system" && (
                          <div className="text-[10px] font-semibold mb-0.5 text-emerald-600">
                            {message.sender_name}
                          </div>
                        )}
                      <div className="whitespace-pre-wrap break-words">
                        {message.content}
                      </div>
                      <div
                        className={`mt-1 text-[10px] opacity-75 text-right ${
                          message.sender_type === "customer"
                            ? "text-white"
                            : "text-gray-500"
                        }`}
                      >
                        {new Date(message.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleSendMessage}
              className="flex items-center gap-2 p-3 border-t border-gray-200 bg-white"
            >
              <input
                ref={messageInputRef}
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder={
                  agentsAvailable
                    ? "Type your message..."
                    : "Agents are offline. Leave a message..."
                }
                className="flex-1 bg-white border border-gray-300 focus:ring-2 focus:ring-emerald-500 rounded-full px-4 py-2 text-sm outline-none text-gray-900 placeholder-gray-500"
              />
              <button
                type="submit"
                disabled={!messageInput.trim()}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                  messageInput.trim()
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-gray-300"
                }`}
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ===== EXPORT =====
// This component is now ready to be used in your main layout or homepage
