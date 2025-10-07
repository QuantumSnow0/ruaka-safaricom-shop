// Type definitions for Lipamdogomdogo e-commerce platform

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  pricerange?: string;
  original_price?: number;
  discount_percentage?: number;
  brand: string;
  model: string;
  storage: string;
  ram: string;
  color?: string;
  image_url?: string;
  image_urls?: string[];
  images?: string[];
  features?: string[] | Record<string, any>;
  specifications?: Record<string, any>;
  in_stock: boolean;
  stock_quantity: number;
  created_at: string;
  updated_at: string;
  // Technical specifications
  display?: string;
  processor?: string;
  camera?: string;
  battery?: string;
  software?: string;
  // Installment plans
  deposit_64gb?: number;
  deposit_128gb?: number;
  daily_installment_64gb?: number;
  daily_installment_128gb?: number;
  installment_plans?: Array<{
    storage: string;
    ram: string;
    network: string;
    price: number;
    deposit: number;
    daily_installment: number;
  }>;
  // Variant options
  storage_options?: string[];
  network_options?: string[];
  ram_options?: string[];
  // Display options
  is_curved_display?: boolean;
  is_special_offer?: boolean;
  is_featured?: boolean;
  is_bestseller?: boolean;
  is_flash_sale?: boolean;
  is_limited?: boolean;
  is_hot_deal?: boolean;
  // Category and tagging
  category?: string;
  subcategory?: string;
  tags?: string[];
}

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  product: Product;
}

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  payment_status: "pending" | "paid" | "failed" | "refunded";
  payment_method: "mpesa" | "cod";
  mpesa_transaction_id?: string;
  total_amount: number;
  shipping_address: Address;
  billing_address: Address;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  created_at: string;
}

export interface Address {
  full_name: string;
  phone: string;
  email: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  county: string;
  postal_code?: string;
  country: string;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  updated_at: string;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

// M-Pesa related types
export interface MpesaSTKPushRequest {
  phone_number: string;
  amount: number;
  account_reference: string;
  transaction_desc: string;
}

export interface MpesaSTKPushResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

export interface MpesaCallbackData {
  Body: {
    stkCallback: {
      MerchantRequestID: string;
      CheckoutRequestID: string;
      ResultCode: number;
      ResultDesc: string;
      CallbackMetadata?: {
        Item: Array<{
          Name: string;
          Value: string | number;
        }>;
      };
    };
  };
}

// ===== LIVE CHAT SYSTEM TYPES =====
export interface ChatConversation {
  id: string;
  customer_id?: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  agent_id?: string;
  status: "waiting" | "active" | "closed";
  priority: "low" | "medium" | "high";
  subject?: string;
  created_at: string;
  updated_at: string;
  last_message_at?: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id?: string;
  sender_type: "customer" | "agent" | "system";
  sender_name: string;
  content: string;
  message_type: "text" | "image" | "file" | "system";
  is_read: boolean;
  created_at: string;
}

export interface ChatAgent {
  id: string;
  user_id: string;
  name: string;
  email: string;
  status: "online" | "away" | "offline";
  max_concurrent_chats: number;
  current_chats_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChatAssignment {
  id: string;
  conversation_id: string;
  agent_id: string;
  assigned_at: string;
  assigned_by?: string;
}

export interface ChatEvent {
  id: string;
  conversation_id: string;
  event_type:
    | "conversation_started"
    | "agent_assigned"
    | "conversation_ended"
    | "message_sent";
  event_data: Record<string, any>;
  created_at: string;
}

export interface ChatWidgetConfig {
  is_enabled: boolean;
  welcome_message: string;
  offline_message: string;
  business_hours: {
    enabled: boolean;
    timezone: string;
    schedule: {
      [key: string]: {
        is_open: boolean;
        open_time?: string;
        close_time?: string;
      };
    };
  };
  auto_assign: boolean;
}
