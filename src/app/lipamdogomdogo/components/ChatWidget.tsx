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
      {/* ===== FLOATING CHAT BUTTON ===== */}
      {/* This is the green chat button that appears in the bottom right corner */}
      {/* Live Chat Container */}
      <motion.div
        className="fixed bottom-6 right-6 z-50 flex items-center space-x-3"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Live Chat Text */}
        <motion.div
          className={`
            bg-white shadow-lg rounded-lg px-3 py-2 text-sm font-medium
            border border-gray-200
            ${isWidgetOpen ? "opacity-0 scale-95" : "opacity-100 scale-100"}
          `}
          transition={{ duration: 0.2 }}
        >
          <span className="text-gray-700">Live Chat</span>
        </motion.div>

        {/* Chat Button */}
        <motion.button
          className={`
            w-14 h-14 rounded-full shadow-lg
            flex items-center justify-center
            transition-all duration-300
            ${
              isOpen
                ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                : "bg-gray-400 hover:bg-gray-500"
            }
            ${isWidgetOpen ? "scale-90" : "scale-100 hover:scale-110"}
          `}
          onClick={toggleWidget}
          whileHover={{ scale: isWidgetOpen ? 0.9 : 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Chat icon or status indicator */}
          {isWidgetOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <div className="relative">
              <img
                src="/live-chat.png"
                alt="Live Chat"
                className="w-10 h-10 object-contain"
              />
              {/* Online/offline indicator */}
              <div
                className={`
              absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white
              ${
                agentsAvailable
                  ? "bg-green-400"
                  : anyAgentOnline
                  ? "bg-yellow-400"
                  : "bg-gray-400"
              }
            `}
              />
            </div>
          )}
        </motion.button>
      </motion.div>

      {/* ===== CHAT WINDOW ===== */}
      {/* This is the expandable chat window that appears when the button is clicked */}
      <AnimatePresence>
        {isWidgetOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-40 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{
              opacity: 1,
              scale: isWidgetMinimized ? 0.95 : 1,
              y: 0,
              height: isWidgetMinimized ? 60 : 500,
            }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* ===== CHAT HEADER ===== */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Safaricom Shop</h3>
                  <p className="text-xs text-green-100">
                    {agentsAvailable
                      ? "Online now"
                      : anyAgentOnline
                      ? "Agents available"
                      : "Offline"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {/* Minimize/Maximize button */}
                <button
                  onClick={isWidgetMinimized ? maximizeWidget : minimizeWidget}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                  {isWidgetMinimized ? (
                    <Maximize2 className="w-4 h-4" />
                  ) : (
                    <Minimize2 className="w-4 h-4" />
                  )}
                </button>

                {/* Close button */}
                <button
                  onClick={toggleWidget}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ===== CHAT CONTENT ===== */}
            {!isWidgetMinimized && (
              <div className="flex flex-col h-96">
                {/* ===== MESSAGES AREA ===== */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {/* Welcome message when no conversation */}
                  {!currentConversation && (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {agentsAvailable
                          ? "Start a conversation"
                          : anyAgentOnline
                          ? "Agents are available"
                          : "We're offline"}
                      </h4>
                      <p className="text-sm text-gray-600 mb-4">
                        {isOpen
                          ? "How can we help you today?"
                          : "Leave a message and we'll get back to you soon!"}
                      </p>

                      {/* Customer info form */}
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Your name *"
                          value={localCustomerInfo.name}
                          onChange={(e) =>
                            handleCustomerInfoChange("name", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
                        />
                        <input
                          type="email"
                          placeholder="Your email"
                          value={localCustomerInfo.email}
                          onChange={(e) =>
                            handleCustomerInfoChange("email", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
                        />
                        <input
                          type="tel"
                          placeholder="Your phone"
                          value={localCustomerInfo.phone}
                          onChange={(e) =>
                            handleCustomerInfoChange("phone", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 bg-white"
                        />
                      </div>
                    </div>
                  )}

                  {/* Error message */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  )}

                  {/* Loading indicator */}
                  {isLoading && (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="w-5 h-5 text-green-600 animate-spin" />
                      <span className="ml-2 text-sm text-gray-600">
                        Loading...
                      </span>
                    </div>
                  )}

                  {/* Messages */}
                  {messages.map((message, index) => (
                    <div
                      key={`${message.id}-${index}`}
                      className={`flex ${
                        message.sender_type === "customer"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`
                          max-w-xs px-3 py-2 rounded-2xl text-sm
                          ${
                            message.sender_type === "customer"
                              ? "bg-green-500 text-white"
                              : message.sender_type === "system"
                              ? "bg-gray-100 text-gray-700 text-center"
                              : "bg-gray-100 text-gray-900"
                          }
                        `}
                      >
                        {/* Message content */}
                        <p>{message.content}</p>

                        {/* Message metadata */}
                        <div
                          className={`
                          text-xs mt-1 opacity-70
                          ${
                            message.sender_type === "customer"
                              ? "text-green-100"
                              : "text-gray-500"
                          }
                        `}
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

                  {/* Typing indicator placeholder */}
                  {currentConversation?.status === "active" && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 px-3 py-2 rounded-2xl text-sm text-gray-600">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          />
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Scroll anchor */}
                  <div ref={messagesEndRef} />
                </div>

                {/* ===== MESSAGE INPUT ===== */}
                <div className="border-t border-gray-200 p-4">
                  {!currentConversation ? (
                    // Start conversation button
                    <button
                      onClick={handleStartConversation}
                      disabled={!localCustomerInfo.name.trim() || isLoading}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 px-4 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Starting chat...
                        </div>
                      ) : (
                        "Start Chat"
                      )}
                    </button>
                  ) : (
                    // Message input form
                    <form
                      onSubmit={handleSendMessage}
                      className="flex space-x-2"
                    >
                      <input
                        ref={messageInputRef}
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder={
                          isOpen
                            ? "Type your message..."
                            : "We're offline, but you can leave a message"
                        }
                        disabled={isLoading || !agentsAvailable}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900 bg-white"
                      />
                      <button
                        type="submit"
                        disabled={
                          !messageInput.trim() || isLoading || !agentsAvailable
                        }
                        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-2 rounded-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ===== EXPORT =====
// This component is now ready to be used in your main layout or homepage
