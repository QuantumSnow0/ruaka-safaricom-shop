# 🚀 Live Chat System Setup Guide

## Overview

You now have a complete live chat system for your Safaricom Shop! Here's everything you need to know to get it running.

## 📋 What You Got

### ✅ **Complete Features**

- **Real-time messaging** between customers and agents
- **3 agent support** with automatic chat assignment
- **Customer chat widget** (floating button on your website)
- **Agent dashboard** for managing chats
- **Business hours** configuration
- **Mobile responsive** design
- **Supabase integration** for data storage and real-time updates

### 🎯 **Components Created**

1. **Database Setup** (`database/chat-system-setup.sql`)
2. **TypeScript Types** (`src/app/lipamdogomdogo/lib/types.ts`)
3. **Chat Context** (`src/app/lipamdogomdogo/contexts/ChatContext.tsx`)
4. **Customer Widget** (`src/app/lipamdogomdogo/components/ChatWidget.tsx`)
5. **Agent Dashboard** (`src/app/lipamdogomdogo/components/chat/AgentDashboard.tsx`)
6. **Agent Login** (`src/app/lipamdogomdogo/agent-login/page.tsx`)
7. **Agent Dashboard Page** (`src/app/lipamdogomdogo/agent-dashboard/page.tsx`)

## 🛠️ Setup Instructions

### Step 1: Database Setup

1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `database/chat-system-setup.sql`
4. **Run the SQL script** - this creates all necessary tables and configurations

### Step 2: Create Your 3 Agents

Run this SQL in Supabase to create your 3 chat agents:

```sql
-- Replace these with your actual staff email addresses
INSERT INTO chat_agents (user_id, name, email, status, max_concurrent_chats)
VALUES
  ('bonface123', 'Agent 1 - coder', 'agent1@yourdomain.com', 'offline', 5),
  ('your-user-uuid-2', 'Agent 2 - Support', 'agent2@yourdomain.com', 'offline', 5),
  ('your-user-uuid-3', 'Agent 3 - Technical', 'agent3@yourdomain.com', 'offline', 5);
```

### Step 3: Update Admin Emails

In the SQL file, update these lines with your admin email:

```sql
-- Line 185-186 in the SQL file
AND auth.users.email IN ('admin@safaricomshop.com', 'your-admin-email@domain.com')
```

### Step 4: Create Agent Accounts

1. Go to **Supabase Auth** → **Users**
2. **Invite** your 3 agents using their email addresses
3. They will receive email invitations to create accounts

### Step 5: Test the System

1. **Start your development server**: `npm run dev`
2. **Visit your homepage** - you should see a green chat button in the bottom right
3. **Click the chat button** to test customer chat
4. **Go to** `/agent-login` to test agent login
5. **Login with agent credentials** to access the dashboard

## 🎮 How to Use

### For Customers

1. **Visit your website** - they'll see a green chat button
2. **Click the button** - a chat window opens
3. **Enter their name and contact info**
4. **Start chatting** - messages are sent to available agents

### For Agents (Your Staff)

1. **Go to** `yourwebsite.com/agent-login`
2. **Login** with their email and password
3. **See the dashboard** with all incoming chats
4. **Click a conversation** to respond
5. **Toggle online/away/offline** status

### For You (Admin)

1. **Monitor chats** through the agent dashboard
2. **Update business hours** in the database
3. **Add/remove agents** by updating the `chat_agents` table
4. **View chat history** in Supabase

## ⚙️ Configuration Options

### Business Hours

Update the `chat_widget_config` table to set your business hours:

```sql
UPDATE chat_widget_config
SET business_hours = '{
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
}'::jsonb;
```

### Welcome Messages

Customize the welcome message:

```sql
UPDATE chat_widget_config
SET welcome_message = 'Welcome to Safaricom Shop Ruaka! 👋 How can we help you today?';
```

## 🚨 Troubleshooting

### Chat Button Not Appearing

- Check if `is_enabled` is `true` in `chat_widget_config`
- Verify the ChatProvider is wrapping your app in `layout.tsx`

### Agents Can't Login

- Ensure they have accounts in Supabase Auth
- Check if they exist in the `chat_agents` table
- Verify `is_active` is `true`

### Messages Not Sending

- Check Supabase realtime is enabled
- Verify database permissions
- Check browser console for errors

### Real-time Updates Not Working

- Ensure Supabase realtime is enabled for your tables
- Check Row Level Security (RLS) policies
- Verify WebSocket connections

## 📱 Mobile Support

The chat system is fully responsive and works great on:

- **Desktop** browsers
- **Mobile** phones
- **Tablets**

## 🔒 Security Features

- **Row Level Security** (RLS) enabled
- **Agent authentication** required
- **Customer data protection**
- **Secure WebSocket** connections

## 📊 Monitoring

You can monitor chat activity through:

- **Supabase Dashboard** - view all conversations and messages
- **Agent Dashboard** - real-time chat management
- **Database queries** - custom analytics

## 🎉 You're All Set!

Your live chat system is now ready! Customers can chat with your staff in real-time, and your team can manage conversations efficiently.

## 📞 Need Help?

If you encounter any issues:

1. Check the browser console for errors
2. Verify Supabase configuration
3. Ensure all SQL scripts ran successfully
4. Test with a simple conversation first

**Happy chatting! 🎊**
