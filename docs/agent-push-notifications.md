Agent Push Notifications - Setup Guide

Overview

- Goal: Notify agents of new customer messages even when the dashboard is closed (free Web Push).
- What’s included in the codebase:
  - DB: agent push subscriptions table (database/push-notifications.sql)
  - Service worker: public/agent-sw.js
  - API routes:
    - POST /api/push/subscribe (saves a browser’s push subscription)
    - POST /api/push/notify (sends push notifications; target for Supabase webhook)
  - Agent UI: “Enable notifications” button in AgentDashboard to register the browser and save the subscription

Architecture

1. Agent clicks Enable notifications in the dashboard → browser asks permission → service worker registers → push subscription is sent to /api/push/subscribe → stored per agent.
2. On new customer message, Supabase triggers a webhook → /api/push/notify → server looks up the assigned agent’s subscriptions (or available agents) → sends web push with VAPID.
3. Service worker displays a notification; clicking it focuses/opens the agent dashboard and deep-links to the conversation.

Files added

- public/agent-sw.js (service worker that receives and displays notifications)
- src/app/api/push/subscribe/route.ts (save subscription)
- src/app/api/push/notify/route.ts (send push; called by webhook)
- database/push-notifications.sql (creates agent_push_subscriptions table)

Prerequisites

- Environment variables (set in your hosting platform):
  - NEXT_PUBLIC_SUPABASE_URL
  - SUPABASE_SERVICE_ROLE_KEY (server only)
  - NEXT_PUBLIC_VAPID_PUBLIC_KEY
  - VAPID_PRIVATE_KEY

Generate VAPID keys
Use Node locally to generate keys:
const webpush = require('web-push');
const keys = webpush.generateVAPIDKeys();
console.log(keys.publicKey);
console.log(keys.privateKey);
Set:

- NEXT_PUBLIC_VAPID_PUBLIC_KEY = <publicKey>
- VAPID_PRIVATE_KEY = <privateKey>

Create the DB table

- Open Supabase SQL editor and run:
  - database/push-notifications.sql

Deploy the service worker

- public/agent-sw.js is already created; deploy your app so it is served at /agent-sw.js

Enable notifications in the dashboard

- Open the agent dashboard as an approved agent
- Click “Enable notifications”
  - You’ll be prompted for notification permission
  - A push subscription will be saved to agent_push_subscriptions

Create the Supabase webhook

- In Supabase:
  - Create a new HTTP Webhook on table: chat_messages
  - Event: INSERT
  - Filter: sender_type = 'customer'
  - URL: https://<your-domain>/api/push/notify
  - Headers: Content-Type: application/json
  - Payload: default row payload is fine (the route expects conversation_id, sender_type, content; if your payload differs, you can map/transform it or update the route to read the row)

How notifications are targeted

- If chat_conversations.agent_id is set → notify that agent
- Else → notify all active agents (is_active = true) up to a small fan-out

Local testing (manual)

- Make sure you’ve enabled notifications in the dashboard once (subscription saved)
- Call notify route:
  curl -X POST https://<your-domain>/api/push/notify \\
  -H "Content-Type: application/json" \\
  -d '{ "conversation_id": "<an-existing-conversation-id>", "sender_type": "customer", "content": "Test message" }'
  You should see a notification pop up (if the browser has permission and the service worker is active).

Production checklist

- [ ] NEXT_PUBLIC_VAPID_PUBLIC_KEY set
- [ ] VAPID_PRIVATE_KEY set
- [ ] SUPABASE_SERVICE_ROLE_KEY set (server side only)
- [ ] NEXT_PUBLIC_SUPABASE_URL set
- [ ] agent_push_subscriptions table created
- [ ] Webhook created on chat_messages INSERT to /api/push/notify
- [ ] Agents click “Enable notifications” once per device/browser

Optional improvements

- Rate limiting / cooldown per conversation to avoid spam
- Send different titles for unassigned vs assigned conversations
- Fallback: Telegram/email if no active subscriptions are found
- Deep-link to a specific conversation (currently included via url /agent-dashboard?conversationId=...)

Troubleshooting

- No notification:
  - Ensure Notification permission is “Allowed”
  - Verify service worker installed (Application tab → Service Workers)
  - Check agent_push_subscriptions has your endpoint/keys
  - Verify env keys present (VAPID and Supabase service key)
  - Open /api/push/notify logs for errors
- “VAPID public key not configured” in UI:
  - Ensure NEXT_PUBLIC_VAPID_PUBLIC_KEY is set at build time and deployed
