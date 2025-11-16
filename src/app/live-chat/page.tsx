"use client";

import React, { useState, useEffect, useRef } from "react";
import { useChat } from "../lipamdogomdogo/contexts/ChatContext";
import { MessageCircle, Send, Loader2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@lipam/lib/supabase";

export default function LiveChatPage() {
  const router = useRouter();
  const {
    messages,
    currentConversation,
    isLoading,
    startConversation,
    sendMessage,
    isAgentAvailable,
    isAnyAgentOnline,
    pollMessages,
  } = useChat();

  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);
  const [keyboardInset, setKeyboardInset] = useState(0);
  const [agentTyping, setAgentTyping] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typingChannelRef = useRef<any>(null);
  const [agentInitials, setAgentInitials] = useState<string>("AG");

  const agentsAvailable = isAgentAvailable();
  const anyAgentOnline = isAnyAgentOnline();

  // Initialize conversation on mount
  useEffect(() => {
    if (!hasInitialized.current && !currentConversation) {
      hasInitialized.current = true;
      const init = async () => {
        try {
          await startConversation({ name: "Guest", email: "", phone: "" });
        } catch (err) {
          console.error("Failed to initialize conversation:", err);
          hasInitialized.current = false;
        }
      };
      init();
    }
  }, [currentConversation, startConversation]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Poll for messages every 3 seconds and subscribe to typing events
  useEffect(() => {
    if (currentConversation?.id) {
      // Try to resolve agent initials from assigned agent
      (async () => {
        try {
          if (currentConversation.agent_id) {
            const { data, error } = await supabase
              .from("chat_agents")
              .select("name, full_name, email")
              .eq("id", currentConversation.agent_id)
              .maybeSingle();
            if (!error && data) {
              const displayName =
                (data as any).name || (data as any).full_name || (data as any).email || "";
              const initials = (displayName || "")
                .trim()
                .split(/\s+/)
                .slice(0, 2)
                .map((s) => s[0]?.toUpperCase())
                .join("");
              if (initials) setAgentInitials(initials);
            }
          } else {
            // Fallback: try last agent message sender_name
            const lastAgent = [...messages]
              .reverse()
              .find((m) => m.sender_type === "agent");
            if (lastAgent?.sender_name) {
              const initials = lastAgent.sender_name
                .trim()
                .split(/\s+/)
                .slice(0, 2)
                .map((s) => s[0]?.toUpperCase())
                .join("");
              if (initials) setAgentInitials(initials);
            }
          }
        } catch {}
      })();

      // Setup realtime typing channel for this conversation
      if (typingChannelRef.current) {
        supabase.removeChannel(typingChannelRef.current);
        typingChannelRef.current = null;
      }
      const channel = supabase
        .channel(`typing:${currentConversation.id}`)
        .on("broadcast", { event: "agent_typing" }, (payload) => {
          const { typing } = (payload as any).payload || {};
          if (typing) {
            setAgentTyping(true);
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => {
              setAgentTyping(false);
            }, 2500);
          } else {
            setAgentTyping(false);
          }
        })
        .subscribe();
      typingChannelRef.current = channel;

      const interval = setInterval(() => {
        pollMessages(currentConversation.id);
      }, 3000);

      return () => {
        clearInterval(interval);
        if (typingChannelRef.current) {
          supabase.removeChannel(typingChannelRef.current);
          typingChannelRef.current = null;
        }
      };
    }
  }, [currentConversation?.id, pollMessages]);

  // Adjust layout when the soft keyboard appears using Visual Viewport API
  useEffect(() => {
    if (typeof window === "undefined" || !(window as any).visualViewport) {
      return;
    }

    const viewport = (window as any).visualViewport as VisualViewport;
    const updateInset = () => {
      const inset = Math.max(
        0,
        window.innerHeight - (viewport.height + viewport.offsetTop)
      );
      setKeyboardInset(inset);
    };

    updateInset();
    viewport.addEventListener("resize", updateInset);
    viewport.addEventListener("scroll", updateInset);
    window.addEventListener("orientationchange", updateInset);

    return () => {
      viewport.removeEventListener("resize", updateInset);
      viewport.removeEventListener("scroll", updateInset);
      window.removeEventListener("orientationchange", updateInset);
    };
  }, []);

  // Removed auto-scroll on keyboard inset change to allow user control while typing

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    try {
      await sendMessage(messageInput);
      setMessageInput("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <div className="chat-container">
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          padding: 0;
          height: 100%;
          overflow: hidden;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            sans-serif;
        }

        .chat-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          flex-direction: column;
          background: #f8fafc;
        }

        .chat-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 64px;
          background: white;
          border-bottom: 1px solid #e2e8f0;
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 1000;
        }

        .chat-messages {
          position: fixed;
          top: 64px;
          left: 0;
          right: 0;
          bottom: 80px;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 16px;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
          background: #f8fafc;
        }

        .chat-input {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 80px;
          background: white;
          border-top: 1px solid #e2e8f0;
          padding: 16px;
          display: flex;
          align-items: center;
          z-index: 1000;
        }

        .message-bubble {
          max-width: 75%;
          margin-bottom: 12px;
          word-wrap: break-word;
        }

        .message-customer {
          margin-left: auto;
          background: #10b981;
          color: white;
          border-radius: 18px 18px 6px 18px;
        }

        .message-agent {
          margin-right: auto;
          background: white;
          color: #1f2937;
          border-radius: 18px 18px 18px 6px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .message-system {
          margin: 0 auto;
          background: #f1f5f9;
          color: #64748b;
          border-radius: 18px;
          text-align: center;
          font-style: italic;
        }

        .message-content {
          padding: 12px 16px;
        }

        .message-time {
          font-size: 11px;
          opacity: 0.7;
          margin-top: 4px;
          text-align: right;
        }

        .input-form {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
        }

        .input-field {
          flex: 1;
          background: white;
          color: #111827;
          border: 1px solid #d1d5db;
          border-radius: 9999px;
          border: none;
          padding: 12px 16px;
          font-size: 16px;
          outline: none;
        }

        .input-field:focus {
          background: #ffffff;
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.4);
        }

        .send-button {
          background: #10b981;
          border: none;
          border-radius: 50%;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .send-button:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .send-button:not(:disabled):hover {
          background: #059669;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          text-align: center;
          color: #64748b;
        }

        .empty-icon {
          width: 64px;
          height: 64px;
          background: #e2e8f0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }

        .back-button {
          background: none;
          border: none;
          padding: 8px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s;
        }

        .back-button:hover {
          background: #f1f5f9;
        }

        .call-button {
          background: none;
          border: none;
          padding: 8px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s;
        }

        .call-button:hover {
          background: #f1f5f9;
        }

        .agent-avatar {
          width: 40px;
          height: 40px;
          background: #d1d5db;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 12px;
        }

        .status-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid white;
          position: absolute;
          bottom: 0;
          right: 0;
        }

        .status-online {
          background: #10b981;
        }
        .status-away {
          background: #f59e0b;
        }
        .status-offline {
          background: #9ca3af;
        }

        @media (max-width: 640px) {
          .chat-header {
            padding: 12px;
          }

          .chat-messages {
            padding: 12px;
          }

          .chat-input {
            padding: 12px;
          }

          .message-bubble {
            max-width: 85%;
          }

          .input-field {
            font-size: 16px; /* Prevents zoom on iOS */
          }
        }
      `}</style>

      {/* Header */}
      <div className="chat-header">
        <div style={{ display: "flex", alignItems: "center" }}>
          <button
            onClick={() => router.back()}
            className="back-button"
            aria-label="Go back"
          >
            <ArrowLeft size={20} color="#374151" />
          </button>

          <div className="agent-avatar" style={{ position: "relative" }}>
            <img
              src="/helpline.png"
              alt="Live chat"
              style={{ width: "22px", height: "22px", objectFit: "contain" }}
            />
            <div
              className={`status-indicator ${
                agentsAvailable
                  ? "status-online"
                  : anyAgentOnline
                  ? "status-away"
                  : "status-offline"
              }`}
            />
          </div>

          <div>
            <h1
              style={{
                fontSize: "16px",
                fontWeight: "600",
                margin: 0,
                color: "#1f2937",
              }}
            >
              Safaricom Shop
            </h1>
            <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>
              {agentsAvailable
                ? "Online now"
                : anyAgentOnline
                ? "Agents available"
                : "Offline"}
            </p>
          </div>
        </div>

        {/* Right action removed per request */}
      </div>

      {/* Messages */}
      <div
        className="chat-messages"
        style={{
          bottom: 80 + keyboardInset,
          paddingBottom: 16 + keyboardInset,
        }}
      >
        {messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <MessageCircle size={32} color="#94a3b8" />
            </div>
            <p>Start chatting with us!</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={`${message.id}-${index}`}
              className={`message-bubble ${
                message.sender_type === "customer"
                  ? "message-customer"
                  : message.sender_type === "system"
                  ? "message-system"
                  : "message-agent"
              }`}
            >
              <div className="message-content">
                {message.sender_type !== "customer" &&
                  message.sender_type !== "system" && (
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        marginBottom: "4px",
                        color: "#059669",
                      }}
                    >
                      {message.sender_name}
                    </div>
                  )}
                <p style={{ margin: 0 }}>{message.content}</p>
                <div className="message-time">
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

      {/* Typing indicator (subtle bubble with animated dots) */}
      <style jsx global>{`
        @keyframes bounceDots {
          0%, 80%, 100% { transform: scale(0); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
      {agentTyping && (
        <div style={{ position: "fixed", left: 12, right: 12, bottom: 88 + keyboardInset }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
            {/* Agent initials badge */}
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 9999,
                background: "#d1fae5",
                color: "#065f46",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 700,
                border: "1px solid #bbf7d0",
              }}
            >
              {agentInitials || "AG"}
            </div>
            {/* Dots bubble */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "#ffffff",
                color: "#111827",
                borderRadius: 16,
                padding: "8px 12px",
                boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
                border: "1px solid #e5e7eb",
                maxWidth: "60%",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  background: "#6b7280",
                  borderRadius: 9999,
                  animation: "bounceDots 1.4s infinite ease-in-out both",
                  animationDelay: "0s",
                  display: "inline-block",
                }}
              />
              <span
                style={{
                  width: 6,
                  height: 6,
                  background: "#6b7280",
                  borderRadius: 9999,
                  animation: "bounceDots 1.4s infinite ease-in-out both",
                  animationDelay: "0.2s",
                  display: "inline-block",
                }}
              />
              <span
                style={{
                  width: 6,
                  height: 6,
                  background: "#6b7280",
                  borderRadius: 9999,
                  animation: "bounceDots 1.4s infinite ease-in-out both",
                  animationDelay: "0.4s",
                  display: "inline-block",
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="chat-input" style={{ bottom: keyboardInset }}>
        <form onSubmit={handleSendMessage} className="input-form">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => {
              setMessageInput(e.target.value);
              if (currentConversation?.id) {
                // Broadcast customer typing with debounce stop
                const channel = typingChannelRef.current
                  ? typingChannelRef.current
                  : supabase.channel(`typing:${currentConversation.id}`);
                channel.send({
                  type: "broadcast",
                  event: "customer_typing",
                  payload: { typing: true },
                });
                if (typingTimeoutRef.current)
                  clearTimeout(typingTimeoutRef.current);
                typingTimeoutRef.current = setTimeout(() => {
                  channel.send({
                    type: "broadcast",
                    event: "customer_typing",
                    payload: { typing: false },
                  });
                }, 1200);
              }
            }}
            placeholder={
              agentsAvailable
                ? "Type your message..."
                : "Agents are offline. Leave a message..."
            }
            disabled={isLoading}
            className="input-field"
          />
          <button
            type="submit"
            disabled={!messageInput.trim() || isLoading}
            className="send-button"
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader2
                size={20}
                style={{ animation: "spin 1s linear infinite" }}
              />
            ) : (
              <Send size={20} color="white" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
