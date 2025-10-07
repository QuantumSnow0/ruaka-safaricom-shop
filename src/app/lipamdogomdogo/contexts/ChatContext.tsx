"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import { supabase } from "../lib/supabase";
import {
  ChatConversation,
  ChatMessage,
  ChatAgent,
  ChatEvent,
  ChatWidgetConfig,
} from "../lib/types";

// ===== CHAT STATE INTERFACE =====
// This defines the shape of our chat application state
interface ChatState {
  // Current conversation details
  currentConversation: ChatConversation | null;
  messages: ChatMessage[];

  // Agent information
  currentAgent: ChatAgent | null;
  availableAgents: ChatAgent[];

  // Chat widget state
  isWidgetOpen: boolean;
  isWidgetMinimized: boolean;
  isConnecting: boolean;
  isConnected: boolean;

  // Customer information (for anonymous users)
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };

  // System configuration
  config: ChatWidgetConfig | null;

  // UI state
  isLoading: boolean;
  error: string | null;

  // Real-time connection
  subscription: any; // Supabase realtime subscription
}

// ===== CHAT ACTION TYPES =====
// These define all the possible actions that can update our chat state
type ChatAction =
  // Connection actions
  | { type: "SET_CONNECTING"; payload: boolean }
  | { type: "SET_CONNECTED"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }

  // Conversation actions
  | { type: "SET_CURRENT_CONVERSATION"; payload: ChatConversation | null }
  | { type: "SET_MESSAGES"; payload: ChatMessage[] }
  | { type: "ADD_MESSAGE"; payload: ChatMessage }
  | { type: "UPDATE_MESSAGE"; payload: ChatMessage }

  // Agent actions
  | { type: "SET_CURRENT_AGENT"; payload: ChatAgent | null }
  | { type: "SET_AVAILABLE_AGENTS"; payload: ChatAgent[] }
  | {
      type: "UPDATE_AGENT_STATUS";
      payload: { agentId: string; status: "online" | "away" | "offline" };
    }

  // Widget UI actions
  | { type: "SET_WIDGET_OPEN"; payload: boolean }
  | { type: "SET_WIDGET_MINIMIZED"; payload: boolean }
  | { type: "TOGGLE_WIDGET" }
  | { type: "MINIMIZE_WIDGET" }
  | { type: "MAXIMIZE_WIDGET" }

  // Customer info actions
  | {
      type: "SET_CUSTOMER_INFO";
      payload: { name: string; email: string; phone: string };
    }
  | {
      type: "UPDATE_CUSTOMER_INFO";
      payload: { name: string; email: string; phone: string };
    }
  | { type: "UPDATE_CUSTOMER_NAME"; payload: string }
  | { type: "UPDATE_CUSTOMER_EMAIL"; payload: string }
  | { type: "UPDATE_CUSTOMER_PHONE"; payload: string }

  // Configuration actions
  | { type: "SET_CONFIG"; payload: ChatWidgetConfig | null }
  | { type: "SET_LOADING"; payload: boolean }

  // Subscription actions
  | { type: "SET_SUBSCRIPTION"; payload: any };

// ===== INITIAL STATE =====
// The starting state of our chat application
const initialState: ChatState = {
  currentConversation: null,
  messages: [],
  currentAgent: null,
  availableAgents: [],
  isWidgetOpen: false,
  isWidgetMinimized: false,
  isConnecting: false,
  isConnected: false,
  customerInfo: {
    name: "",
    email: "",
    phone: "",
  },
  config: null,
  isLoading: false,
  error: null,
  subscription: null,
};

// ===== CHAT REDUCER =====
// This function handles all state updates in a predictable way
function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    // Connection state updates
    case "SET_CONNECTING":
      return { ...state, isConnecting: action.payload };

    case "SET_CONNECTED":
      return { ...state, isConnected: action.payload, isConnecting: false };

    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };

    // Conversation management
    case "SET_CURRENT_CONVERSATION":
      return { ...state, currentConversation: action.payload };

    case "SET_MESSAGES":
      return { ...state, messages: action.payload };

    case "ADD_MESSAGE":
      return {
        ...state,
        messages: [...state.messages, action.payload],
        currentConversation: state.currentConversation
          ? {
              ...state.currentConversation,
              last_message_at: action.payload.created_at,
            }
          : null,
      };

    case "UPDATE_MESSAGE":
      return {
        ...state,
        messages: state.messages.map((msg) =>
          msg.id === action.payload.id ? action.payload : msg
        ),
      };

    // Agent management
    case "SET_CURRENT_AGENT":
      return { ...state, currentAgent: action.payload };

    case "SET_AVAILABLE_AGENTS":
      return { ...state, availableAgents: action.payload };

    case "UPDATE_AGENT_STATUS":
      return {
        ...state,
        availableAgents: state.availableAgents.map((agent) =>
          agent.id === action.payload.agentId
            ? { ...agent, status: action.payload.status }
            : agent
        ),
        currentAgent:
          state.currentAgent?.id === action.payload.agentId
            ? { ...state.currentAgent, status: action.payload.status }
            : state.currentAgent,
      };

    // Widget UI state
    case "SET_WIDGET_OPEN":
      return { ...state, isWidgetOpen: action.payload };

    case "SET_WIDGET_MINIMIZED":
      return { ...state, isWidgetMinimized: action.payload };

    case "TOGGLE_WIDGET":
      return {
        ...state,
        isWidgetOpen: !state.isWidgetOpen,
        isWidgetMinimized: false, // When opening, always maximize
      };

    case "MINIMIZE_WIDGET":
      return { ...state, isWidgetMinimized: true };

    case "MAXIMIZE_WIDGET":
      return { ...state, isWidgetMinimized: false };

    // Customer information updates
    case "SET_CUSTOMER_INFO":
      return { ...state, customerInfo: action.payload };

    case "UPDATE_CUSTOMER_INFO":
      return { ...state, customerInfo: action.payload };

    case "UPDATE_CUSTOMER_NAME":
      return {
        ...state,
        customerInfo: { ...state.customerInfo, name: action.payload },
      };

    case "UPDATE_CUSTOMER_EMAIL":
      return {
        ...state,
        customerInfo: { ...state.customerInfo, email: action.payload },
      };

    case "UPDATE_CUSTOMER_PHONE":
      return {
        ...state,
        customerInfo: { ...state.customerInfo, phone: action.payload },
      };

    // Configuration and loading states
    case "SET_CONFIG":
      return { ...state, config: action.payload };

    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_SUBSCRIPTION":
      return { ...state, subscription: action.payload };

    default:
      return state;
  }
}

// ===== CHAT CONTEXT INTERFACE =====
// This defines what functions and data our components can access
interface ChatContextType extends ChatState {
  // Connection management
  connect: () => Promise<void>;
  disconnect: () => void;

  // Conversation management
  startConversation: (customerInfo?: {
    name: string;
    email?: string;
    phone?: string;
  }) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  sendAgentMessage: (
    conversationId: string,
    content: string,
    agentId: string,
    agentName: string
  ) => Promise<void>;
  closeConversation: () => Promise<void>;
  loadConversation: (conversationId: string) => Promise<void>;

  // Widget controls
  openWidget: () => void;
  closeWidget: () => void;
  toggleWidget: () => void;
  minimizeWidget: () => void;
  maximizeWidget: () => void;

  // Agent management
  loadAvailableAgents: () => Promise<void>;

  // Configuration
  loadConfig: () => Promise<void>;

  // Utility functions
  markMessagesAsRead: (conversationId: string) => Promise<void>;
  isBusinessHours: () => boolean;
  isAnyAgentOnline: () => boolean;
  isAgentAvailable: () => boolean;

  // Customer info updates
  updateCustomerName: (name: string) => void;
  updateCustomerEmail: (email: string) => void;
  updateCustomerPhone: (phone: string) => void;

  // Polling for anonymous users
  pollMessages: (conversationId: string) => Promise<void>;
}

// ===== CREATE CONTEXT =====
// This creates the React context that will hold our chat state and functions
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// ===== CHAT PROVIDER COMPONENT =====
// This component wraps our app and provides chat functionality to all child components
export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // ===== CONNECTION MANAGEMENT =====

  // Connect to Supabase realtime for live updates
  const connect = useCallback(async () => {
    try {
      dispatch({ type: "SET_CONNECTING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      // Load configuration first
      await loadConfig();

      // Load available agents
      await loadAvailableAgents();

      // Skip real-time subscriptions for anonymous users
      // Real-time requires authentication in Supabase
      console.log("Skipping real-time subscription for anonymous users");
      const subscription = null;

      dispatch({ type: "SET_SUBSCRIPTION", payload: subscription });
      dispatch({ type: "SET_CONNECTED", payload: true });
    } catch (error) {
      console.error("Failed to connect to chat:", error);
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to connect to chat service",
      });
    }
  }, [supabase, state.currentConversation?.id]);

  // Disconnect from realtime
  const disconnect = useCallback(() => {
    if (state.subscription) {
      supabase.removeChannel(state.subscription);
      dispatch({ type: "SET_SUBSCRIPTION", payload: null });
    }
    dispatch({ type: "SET_CONNECTED", payload: false });
  }, [supabase, state.subscription]);

  // ===== CONVERSATION MANAGEMENT =====

  // Start a new conversation
  const startConversation = useCallback(
    async (customerInfo?: { name: string; email?: string; phone?: string }) => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });

        // Create new conversation
        const { data: conversation, error } = await supabase
          .from("chat_conversations")
          .insert({
            customer_name: customerInfo?.name || state.customerInfo.name,
            customer_email: customerInfo?.email || state.customerInfo.email,
            customer_phone: customerInfo?.phone || state.customerInfo.phone,
            status: "waiting",
            priority: "medium",
          })
          .select()
          .single();

        if (error) {
          console.error("Database error:", error);
          console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
          console.log(
            "Using Service Role Key:",
            process.env.SUPABASE_SERVICE_ROLE_KEY ? "✅ Yes" : "❌ Missing"
          );

          // Create a demo conversation for testing without database
          const demoConversation = {
            id: `demo-${Date.now()}`,
            customer_name: customerInfo?.name || state.customerInfo.name,
            customer_email: customerInfo?.email || state.customerInfo.email,
            customer_phone: customerInfo?.phone || state.customerInfo.phone,
            status: "waiting" as const,
            priority: "medium" as const,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          const welcomeMessage = "Hello! How can we help you today?";

          const demoMessage = {
            id: `demo-msg-${Date.now()}`,
            conversation_id: demoConversation.id,
            sender_type: "system" as const,
            sender_name: "System",
            content: welcomeMessage,
            message_type: "system" as const,
            is_read: false,
            created_at: new Date().toISOString(),
          };

          // Update state with demo data
          dispatch({
            type: "SET_CURRENT_CONVERSATION",
            payload: demoConversation,
          });
          dispatch({ type: "ADD_MESSAGE", payload: demoMessage });

          console.log("Demo conversation created successfully!");
          return;
        }

        // Create welcome message
        const welcomeMessage =
          state.config?.welcome_message || "Hello! How can we help you today?";

        const { data: message, error: messageError } = await supabase
          .from("chat_messages")
          .insert({
            conversation_id: conversation.id,
            sender_type: "system",
            sender_name: "System",
            content: welcomeMessage,
            message_type: "system",
          })
          .select()
          .single();

        if (messageError) throw messageError;

        // Update state
        dispatch({ type: "SET_CURRENT_CONVERSATION", payload: conversation });
        dispatch({ type: "ADD_MESSAGE", payload: message });

        // Try to assign to available agent
        await assignConversationToAgent(conversation.id);
      } catch (error) {
        console.error("Failed to start conversation:", error);
        dispatch({
          type: "SET_ERROR",
          payload:
            "Failed to start conversation. Please set up database tables first.",
        });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [supabase, state.customerInfo, state.config]
  );

  // Send a message
  const sendMessage = useCallback(
    async (content: string) => {
      if (!state.currentConversation || !content.trim()) return;

      try {
        dispatch({ type: "SET_LOADING", payload: true });

        const { data: message, error } = await supabase
          .from("chat_messages")
          .insert({
            conversation_id: state.currentConversation.id,
            sender_type: "customer",
            sender_name: state.customerInfo.name || "Customer",
            content: content.trim(),
            message_type: "text",
          })
          .select()
          .single();

        if (error) throw error;

        dispatch({ type: "ADD_MESSAGE", payload: message });
      } catch (error) {
        console.error("Failed to send message:", error);
        dispatch({ type: "SET_ERROR", payload: "Failed to send message" });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [supabase, state.currentConversation, state.customerInfo.name]
  );

  // Send message from agent
  const sendAgentMessage = useCallback(
    async (
      conversationId: string,
      content: string,
      agentId: string,
      agentName: string
    ) => {
      if (!content.trim()) return;

      try {
        const { data: message, error } = await supabase
          .from("chat_messages")
          .insert({
            conversation_id: conversationId,
            sender_id: agentId,
            sender_type: "agent",
            sender_name: agentName,
            content: content.trim(),
            message_type: "text",
            is_read: true,
          })
          .select()
          .single();

        if (error) throw error;

        // Only add to state if this is the current conversation
        if (state.currentConversation?.id === conversationId) {
          dispatch({ type: "ADD_MESSAGE", payload: message });
        }
      } catch (error) {
        console.error("Failed to send agent message:", error);
        throw error;
      }
    },
    [supabase, state.currentConversation?.id]
  );

  // Load a specific conversation
  const loadConversation = useCallback(
    async (conversationId: string) => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });

        // Load conversation details
        const { data: conversation, error: convError } = await supabase
          .from("chat_conversations")
          .select("*")
          .eq("id", conversationId)
          .single();

        if (convError) throw convError;

        // Load messages for this conversation
        const { data: messages, error: msgError } = await supabase
          .from("chat_messages")
          .select("*")
          .eq("conversation_id", conversationId)
          .order("created_at", { ascending: true });

        if (msgError) throw msgError;

        dispatch({ type: "SET_CURRENT_CONVERSATION", payload: conversation });
        dispatch({ type: "SET_MESSAGES", payload: messages });
      } catch (error) {
        console.error("Failed to load conversation:", error);
        dispatch({ type: "SET_ERROR", payload: "Failed to load conversation" });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [supabase]
  );

  // Close current conversation
  const closeConversation = useCallback(async () => {
    if (!state.currentConversation) return;

    try {
      await supabase
        .from("chat_conversations")
        .update({ status: "closed" })
        .eq("id", state.currentConversation.id);

      dispatch({ type: "SET_CURRENT_CONVERSATION", payload: null });
      dispatch({ type: "SET_MESSAGES", payload: [] });
    } catch (error) {
      console.error("Failed to close conversation:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to close conversation" });
    }
  }, [supabase, state.currentConversation]);

  // ===== AGENT MANAGEMENT =====

  // Load available agents
  const loadAvailableAgents = useCallback(async () => {
    try {
      const { data: agents, error } = await supabase
        .from("chat_agents")
        .select("*")
        .eq("is_active", true)
        .order("status", { ascending: false }); // Online agents first

      if (error) {
        console.log("No agents table found or error loading agents:", error);
        dispatch({ type: "SET_AVAILABLE_AGENTS", payload: [] });
        return;
      }

      dispatch({ type: "SET_AVAILABLE_AGENTS", payload: agents || [] });
    } catch (error) {
      console.log("Failed to load agents:", error);
      dispatch({ type: "SET_AVAILABLE_AGENTS", payload: [] });
    }
  }, [supabase]);

  // Assign conversation to available agent
  const assignConversationToAgent = useCallback(
    async (conversationId: string) => {
      try {
        // Find an available agent (online and not at max capacity)
        const { data: availableAgent, error: agentError } = await supabase
          .from("chat_agents")
          .select("*")
          .eq("is_active", true)
          .eq("status", "online")
          .lt("current_chats_count", "max_concurrent_chats")
          .order("current_chats_count", { ascending: true }) // Agent with least chats first
          .limit(1)
          .single();

        if (agentError || !availableAgent) {
          console.log("No available agents at the moment");
          return;
        }

        // Assign conversation to agent
        const { error: assignError } = await supabase
          .from("chat_conversations")
          .update({
            agent_id: availableAgent.id,
            status: "active",
          })
          .eq("id", conversationId);

        if (assignError) throw assignError;

        // Create assignment record
        await supabase.from("chat_assignments").insert({
          conversation_id: conversationId,
          agent_id: availableAgent.id,
        });

        console.log(`Conversation assigned to agent: ${availableAgent.name}`);
      } catch (error) {
        console.error("Failed to assign conversation to agent:", error);
      }
    },
    [supabase]
  );

  // ===== CONFIGURATION =====

  // Load chat widget configuration
  const loadConfig = useCallback(async () => {
    try {
      const { data: config, error } = await supabase
        .from("chat_widget_config")
        .select("*")
        .single();

      if (error) {
        // If table doesn't exist or no config found, use default
        console.log("Using default chat configuration");
        dispatch({
          type: "SET_CONFIG",
          payload: {
            is_enabled: true,
            welcome_message:
              "Welcome to Safaricom Shop Ruaka! 👋 How can we help you today?",
            offline_message:
              "Sorry, we're currently offline. Please leave a message and we'll get back to you soon!",
            business_hours: {
              enabled: true,
              timezone: "Africa/Nairobi",
              schedule: {
                monday: {
                  is_open: true,
                  open_time: "08:00",
                  close_time: "19:00",
                },
                tuesday: {
                  is_open: true,
                  open_time: "08:00",
                  close_time: "19:00",
                },
                wednesday: {
                  is_open: true,
                  open_time: "08:00",
                  close_time: "19:00",
                },
                thursday: {
                  is_open: true,
                  open_time: "08:00",
                  close_time: "19:00",
                },
                friday: {
                  is_open: true,
                  open_time: "08:00",
                  close_time: "19:00",
                },
                saturday: {
                  is_open: true,
                  open_time: "09:00",
                  close_time: "18:00",
                },
                sunday: {
                  is_open: true,
                  open_time: "10:00",
                  close_time: "17:00",
                },
              },
            },
            auto_assign: true,
          },
        });
        return;
      }

      dispatch({ type: "SET_CONFIG", payload: config });
    } catch (error) {
      console.log("Using default chat configuration due to error:", error);
      // Use default config if loading fails
      dispatch({
        type: "SET_CONFIG",
        payload: {
          is_enabled: true,
          welcome_message:
            "Welcome to Safaricom Shop Ruaka! 👋 How can we help you today?",
          offline_message:
            "Sorry, we're currently offline. Please leave a message and we'll get back to you soon!",
          business_hours: {
            enabled: true,
            timezone: "Africa/Nairobi",
            schedule: {
              monday: {
                is_open: true,
                open_time: "08:00",
                close_time: "19:00",
              },
              tuesday: {
                is_open: true,
                open_time: "08:00",
                close_time: "19:00",
              },
              wednesday: {
                is_open: true,
                open_time: "08:00",
                close_time: "19:00",
              },
              thursday: {
                is_open: true,
                open_time: "08:00",
                close_time: "19:00",
              },
              friday: {
                is_open: true,
                open_time: "08:00",
                close_time: "19:00",
              },
              saturday: {
                is_open: true,
                open_time: "09:00",
                close_time: "18:00",
              },
              sunday: {
                is_open: true,
                open_time: "10:00",
                close_time: "17:00",
              },
            },
          },
          auto_assign: true,
        },
      });
    }
  }, [supabase]);

  // ===== WIDGET CONTROLS =====

  const openWidget = useCallback(() => {
    dispatch({ type: "SET_WIDGET_OPEN", payload: true });
  }, []);

  const closeWidget = useCallback(() => {
    dispatch({ type: "SET_WIDGET_OPEN", payload: false });
    dispatch({ type: "SET_WIDGET_MINIMIZED", payload: false });
  }, []);

  const toggleWidget = useCallback(() => {
    dispatch({ type: "TOGGLE_WIDGET" });
  }, []);

  const minimizeWidget = useCallback(() => {
    dispatch({ type: "MINIMIZE_WIDGET" });
  }, []);

  const maximizeWidget = useCallback(() => {
    dispatch({ type: "MAXIMIZE_WIDGET" });
  }, []);

  // ===== UTILITY FUNCTIONS =====

  // Mark messages as read
  const markMessagesAsRead = useCallback(
    async (conversationId: string) => {
      try {
        await supabase
          .from("chat_messages")
          .update({ is_read: true })
          .eq("conversation_id", conversationId)
          .eq("sender_type", "agent"); // Only mark agent messages as read
      } catch (error) {
        console.error("Failed to mark messages as read:", error);
      }
    },
    [supabase]
  );

  // Check if it's business hours
  const isBusinessHours = useCallback((): boolean => {
    if (!state.config?.business_hours.enabled) return true;

    const now = new Date();
    const dayNames = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const dayName = dayNames[now.getDay()]; // Get day name (0 = Sunday, 1 = Monday, etc.)
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM format

    const todaySchedule = state.config.business_hours.schedule[dayName];
    if (!todaySchedule?.is_open) return false;

    return !!(
      todaySchedule.open_time &&
      todaySchedule.close_time &&
      currentTime >= todaySchedule.open_time &&
      currentTime <= todaySchedule.close_time
    );
  }, [state.config]);

  // Check if any agents are online
  const isAnyAgentOnline = useCallback((): boolean => {
    const hasOnlineAgent = state.availableAgents.some(
      (agent) => agent.status === "online"
    );
    console.log(
      "Agents:",
      state.availableAgents,
      "Has online agent:",
      hasOnlineAgent
    );
    return hasOnlineAgent;
  }, [state.availableAgents]);

  // Check if agents are available (business hours AND at least one agent online)
  const isAgentAvailable = useCallback((): boolean => {
    const businessHours = isBusinessHours();
    const agentOnline = isAnyAgentOnline();
    const available = businessHours && agentOnline;
    console.log(
      "Business hours:",
      businessHours,
      "Agent online:",
      agentOnline,
      "Available:",
      available
    );
    return available;
  }, [isBusinessHours, isAnyAgentOnline]);

  // ===== EFFECTS =====

  // Auto-connect when component mounts
  useEffect(() => {
    connect();

    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  // ===== CONTEXT VALUE =====

  // ===== CUSTOMER INFO UPDATERS =====

  const updateCustomerName = useCallback(
    (name: string) => {
      dispatch({
        type: "UPDATE_CUSTOMER_INFO",
        payload: { ...state.customerInfo, name },
      });
    },
    [state.customerInfo]
  );

  const updateCustomerEmail = useCallback(
    (email: string) => {
      dispatch({
        type: "UPDATE_CUSTOMER_INFO",
        payload: { ...state.customerInfo, email },
      });
    },
    [state.customerInfo]
  );

  const updateCustomerPhone = useCallback(
    (phone: string) => {
      dispatch({
        type: "UPDATE_CUSTOMER_INFO",
        payload: { ...state.customerInfo, phone },
      });
    },
    [state.customerInfo]
  );

  // ===== CONTEXT VALUE =====

  const contextValue: ChatContextType = {
    ...state,
    connect,
    disconnect,
    startConversation,
    sendMessage,
    sendAgentMessage,
    closeConversation,
    loadConversation,
    openWidget,
    closeWidget,
    toggleWidget,
    minimizeWidget,
    maximizeWidget,
    loadAvailableAgents,
    loadConfig,
    markMessagesAsRead,
    updateCustomerName,
    updateCustomerEmail,
    updateCustomerPhone,
    isBusinessHours,
    isAnyAgentOnline,
    isAgentAvailable,

    // Polling for anonymous users (since real-time doesn't work)
    pollMessages: async (conversationId: string) => {
      if (state.currentConversation?.id === conversationId) {
        try {
          const { data: messages, error } = await supabase
            .from("chat_messages")
            .select("*")
            .eq("conversation_id", conversationId)
            .order("created_at", { ascending: true });

          if (!error && messages) {
            dispatch({ type: "SET_MESSAGES", payload: messages });
          }
        } catch (error) {
          console.error("Error polling messages:", error);
        }
      }
    },
  };

  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
}

// ===== CUSTOM HOOK =====
// This hook allows components to access the chat context easily
export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}

// ===== EXPORT TYPES =====
// Export types so other components can use them
export type { ChatContextType, ChatState, ChatAction };
