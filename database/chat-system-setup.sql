-- =====================================================
-- LIVE CHAT SYSTEM DATABASE SETUP
-- =====================================================
-- This SQL file creates all the necessary tables for our live chat system
-- Run these commands in your Supabase SQL editor

-- ===== CHAT AGENTS TABLE =====
-- This table stores information about your 3 staff members who handle chats
CREATE TABLE IF NOT EXISTS chat_agents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- Agent's display name (e.g., "John - Sales")
    email VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(20) DEFAULT 'offline' CHECK (status IN ('online', 'away', 'offline')),
    max_concurrent_chats INTEGER DEFAULT 5, -- How many chats they can handle at once
    current_chats_count INTEGER DEFAULT 0, -- Current active chats (updated by triggers)
    is_active BOOLEAN DEFAULT true, -- Is this agent active in the system
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== CHAT CONVERSATIONS TABLE =====
-- This table stores chat sessions between customers and agents
CREATE TABLE IF NOT EXISTS chat_conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Optional - anonymous users can chat
    customer_name VARCHAR(100), -- Customer's display name (required for anonymous users)
    customer_email VARCHAR(255), -- Customer's email (if provided)
    customer_phone VARCHAR(20), -- Customer's phone (if provided)
    agent_id UUID REFERENCES chat_agents(id) ON DELETE SET NULL, -- Which agent is handling this chat
    status VARCHAR(20) DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'closed')),
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    subject VARCHAR(255), -- Chat subject/topic (optional)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_message_at TIMESTAMP WITH TIME ZONE -- When the last message was sent
);

-- ===== CHAT MESSAGES TABLE =====
-- This table stores individual messages in conversations
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID REFERENCES chat_conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- ID of who sent the message
    sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('customer', 'agent', 'system')),
    sender_name VARCHAR(100) NOT NULL, -- Display name of sender
    content TEXT NOT NULL, -- The actual message text
    message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'system')),
    is_read BOOLEAN DEFAULT false, -- Has the message been read
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== CHAT ASSIGNMENTS TABLE =====
-- This table tracks which agent gets which chat (for audit trail)
CREATE TABLE IF NOT EXISTS chat_assignments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID REFERENCES chat_conversations(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES chat_agents(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL -- Who made the assignment (admin)
);

-- ===== CHAT WIDGET CONFIG TABLE =====
-- This table stores configuration for the chat widget
CREATE TABLE IF NOT EXISTS chat_widget_config (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    is_enabled BOOLEAN DEFAULT true,
    welcome_message TEXT DEFAULT 'Hello! How can we help you today?',
    offline_message TEXT DEFAULT 'Sorry, we''re currently offline. Please leave a message and we''ll get back to you soon!',
    business_hours JSONB DEFAULT '{
        "enabled": true,
        "timezone": "Africa/Nairobi",
        "schedule": {
            "monday": {"is_open": true, "open_time": "08:00", "close_time": "19:00"},
            "tuesday": {"is_open": true, "open_time": "08:00", "close_time": "19:00"},
            "wednesday": {"is_open": true, "open_time": "08:00", "close_time": "19:00"},
            "thursday": {"is_open": true, "open_time": "08:00", "close_time": "19:00"},
            "friday": {"is_open": true, "open_time": "08:00", "close_time": "19:00"},
            "saturday": {"is_open": true, "open_time": "09:00", "close_time": "18:00"},
            "sunday": {"is_open": true, "open_time": "10:00", "close_time": "17:00"}
        }
    }'::jsonb,
    auto_assign BOOLEAN DEFAULT true, -- Automatically assign chats to available agents
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== INDEXES FOR PERFORMANCE =====
-- These indexes make queries faster, especially for real-time operations

-- Index for finding conversations by customer
CREATE INDEX IF NOT EXISTS idx_chat_conversations_customer_id ON chat_conversations(customer_id);

-- Index for finding conversations by agent
CREATE INDEX IF NOT EXISTS idx_chat_conversations_agent_id ON chat_conversations(agent_id);

-- Index for finding conversations by status
CREATE INDEX IF NOT EXISTS idx_chat_conversations_status ON chat_conversations(status);

-- Index for finding messages by conversation (ordered by creation time)
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_created ON chat_messages(conversation_id, created_at);

-- Index for finding unread messages
CREATE INDEX IF NOT EXISTS idx_chat_messages_unread ON chat_messages(is_read, conversation_id) WHERE is_read = false;

-- Index for finding active agents
CREATE INDEX IF NOT EXISTS idx_chat_agents_active ON chat_agents(is_active, status) WHERE is_active = true;

-- ===== TRIGGERS FOR AUTOMATIC UPDATES =====
-- These triggers automatically update timestamps and counters

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update updated_at for conversations
CREATE TRIGGER update_chat_conversations_updated_at 
    BEFORE UPDATE ON chat_conversations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger to update updated_at for agents
CREATE TRIGGER update_chat_agents_updated_at 
    BEFORE UPDATE ON chat_agents 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger to update updated_at for widget config
CREATE TRIGGER update_chat_widget_config_updated_at 
    BEFORE UPDATE ON chat_widget_config 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update last_message_at when a new message is added
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE chat_conversations 
    SET last_message_at = NEW.created_at 
    WHERE id = NEW.conversation_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update last_message_at when messages are added
CREATE TRIGGER update_conversation_last_message_trigger
    AFTER INSERT ON chat_messages
    FOR EACH ROW EXECUTE FUNCTION update_conversation_last_message();

-- Function to update agent's current chat count
CREATE OR REPLACE FUNCTION update_agent_chat_count()
RETURNS TRIGGER AS $$
BEGIN
    -- Update count when conversation status changes to active
    IF NEW.status = 'active' AND OLD.status != 'active' THEN
        UPDATE chat_agents 
        SET current_chats_count = current_chats_count + 1 
        WHERE id = NEW.agent_id;
    END IF;
    
    -- Update count when conversation status changes from active
    IF OLD.status = 'active' AND NEW.status != 'active' THEN
        UPDATE chat_agents 
        SET current_chats_count = GREATEST(current_chats_count - 1, 0) 
        WHERE id = OLD.agent_id;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update agent chat count
CREATE TRIGGER update_agent_chat_count_trigger
    AFTER UPDATE ON chat_conversations
    FOR EACH ROW EXECUTE FUNCTION update_agent_chat_count();

-- ===== ROW LEVEL SECURITY (RLS) POLICIES =====
-- These policies control who can access what data

-- Enable RLS on all tables
ALTER TABLE chat_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_widget_config ENABLE ROW LEVEL SECURITY;

-- Chat agents: Only authenticated users can read, only admins can modify
CREATE POLICY "Chat agents are viewable by authenticated users" ON chat_agents
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Chat agents are manageable by admins" ON chat_agents
    FOR ALL USING (
        auth.role() = 'authenticated' AND 
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email IN ('bmuthuri93@gmail.com', 'maingisamson095@gmail.com')
        )
    );

CREATE POLICY "Agents can update their own status" ON chat_agents
    FOR UPDATE USING (
        auth.role() = 'authenticated' AND 
        user_id = auth.uid()
    );

-- Chat conversations: Allow anonymous users to create conversations, agents can see their assigned chats
CREATE POLICY "Anyone can view conversations" ON chat_conversations
    FOR SELECT USING (true);

CREATE POLICY "Anyone can create conversations" ON chat_conversations
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Agents can manage conversations" ON chat_conversations
    FOR UPDATE USING (
        auth.role() = 'authenticated' AND 
        agent_id IN (
            SELECT id FROM chat_agents WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Agents can delete conversations" ON chat_conversations
    FOR DELETE USING (
        auth.role() = 'authenticated' AND 
        agent_id IN (
            SELECT id FROM chat_agents WHERE user_id = auth.uid()
        )
    );

-- Chat messages: Allow anyone to view and insert messages
CREATE POLICY "Anyone can view messages" ON chat_messages
    FOR SELECT USING (true);

CREATE POLICY "Anyone can insert messages" ON chat_messages
    FOR INSERT WITH CHECK (true);

-- Chat assignments: Agents can view their assignments
CREATE POLICY "Agents can view their assignments" ON chat_assignments
    FOR SELECT USING (
        auth.role() = 'authenticated' AND 
        agent_id IN (
            SELECT id FROM chat_agents WHERE user_id = auth.uid()
        )
    );

-- Chat widget config: Public read access, admin write access
CREATE POLICY "Widget config is publicly readable" ON chat_widget_config
    FOR SELECT USING (true);

CREATE POLICY "Widget config is manageable by admins" ON chat_widget_config
    FOR ALL USING (
        auth.role() = 'authenticated' AND 
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email IN ('bmuthuri93@gmail.com', 'maingisamson095@gmail.com')
        )
    );

-- ===== SAMPLE DATA =====
-- Insert default widget configuration
INSERT INTO chat_widget_config (is_enabled, welcome_message, offline_message) 
VALUES (
    true, 
    'Welcome to Safaricom Shop Ruaka! 👋 How can we help you today?',
    'Sorry, we''re currently offline. Please leave a message and we''ll get back to you soon! 📱'
) ON CONFLICT DO NOTHING;

-- ===== USAGE INSTRUCTIONS =====
/*
1. Run this entire SQL script in your Supabase SQL editor
2. Create your 3 chat agents by inserting records into chat_agents table:
   INSERT INTO chat_agents (user_id, name, email, status, max_concurrent_chats)
   VALUES 
   ('user-uuid-1', 'Agent 1', 'agent1@yourdomain.com', 'offline', 5),
   ('user-uuid-2', 'Agent 2', 'agent2@yourdomain.com', 'offline', 5),
   ('user-uuid-3', 'Agent 3', 'agent3@yourdomain.com', 'offline', 5);
3. Update the admin email addresses in the RLS policies
4. Test the chat system by creating a conversation and sending messages
*/
