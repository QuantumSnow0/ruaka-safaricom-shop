-- Agent push subscriptions table
create table if not exists agent_push_subscriptions (
  id uuid default gen_random_uuid() primary key,
  agent_id uuid references chat_agents(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  user_agent text,
  created_at timestamptz default now()
);

-- Helpful index
create index if not exists idx_agent_push_subscriptions_agent on agent_push_subscriptions(agent_id);


