-- Fix agent status update permissions
-- Run this in your Supabase SQL Editor

-- First, drop the existing policy if it exists
DROP POLICY IF EXISTS "Agents can update their own status" ON chat_agents;

-- Add policy to allow agents to update their own status
CREATE POLICY "Agents can update their own status" ON chat_agents
    FOR UPDATE USING (
        auth.role() = 'authenticated' AND 
        user_id = auth.uid()
    );

-- Allow anonymous users to view agent status (for customer chat widget)
CREATE POLICY "Anyone can view agent status" ON chat_agents
    FOR SELECT USING (true);

-- Alternative approach: Allow all authenticated users to update agent status
-- (Use this if the above doesn't work)
-- DROP POLICY IF EXISTS "Agents can update their own status" ON chat_agents;
-- CREATE POLICY "Authenticated users can update agent status" ON chat_agents
--     FOR UPDATE USING (auth.role() = 'authenticated');
