import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import webpush from "web-push";

// Expect env vars:
// VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

export async function POST(req: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const vapidPublic = process.env.VAPID_PUBLIC_KEY!;
    const vapidPrivate = process.env.VAPID_PRIVATE_KEY!;

    if (!supabaseUrl || !serviceKey || !vapidPublic || !vapidPrivate) {
      return NextResponse.json(
        { error: "Server not configured (Supabase or VAPID env missing)" },
        { status: 500 }
      );
    }

    const body = await req.json();
    // Body can be the raw Supabase row or a shaped payload:
    // {
    //   conversation_id, sender_type, content
    // }
    const { conversation_id, sender_type, content } = body || {};
    if (!conversation_id || sender_type !== "customer") {
      return NextResponse.json({ ok: true }); // ignore other events
    }

    const supabase = createClient(supabaseUrl, serviceKey);

    // Find assigned agent; if none, pick active agents
    const { data: conversation } = await supabase
      .from("chat_conversations")
      .select("id, agent_id, customer_name")
      .eq("id", conversation_id)
      .maybeSingle();

    let agentIds: string[] = [];
    if (conversation?.agent_id) {
      agentIds = [conversation.agent_id];
    } else {
      const { data: agents } = await supabase
        .from("chat_agents")
        .select("id")
        .eq("is_active", true)
        .limit(3);
      agentIds = (agents || []).map((a) => a.id);
    }
    if (agentIds.length === 0) {
      return NextResponse.json({ ok: true }); // nobody to notify
    }

    // Load subscriptions
    const { data: subs } = await supabase
      .from("agent_push_subscriptions")
      .select("endpoint, p256dh, auth, agent_id")
      .in("agent_id", agentIds);

    if (!subs || subs.length === 0) {
      return NextResponse.json({ ok: true });
    }

    webpush.setVapidDetails("mailto:no-reply@example.com", vapidPublic, vapidPrivate);

    const payload = JSON.stringify({
      title: "New chat message",
      body: content ? String(content).slice(0, 120) : "You have a new customer message",
      icon: "/helpline.png",
      badge: "/helpline.png",
      url: `/agent-dashboard?conversationId=${conversation_id}`,
      tag: `chat-${conversation_id}`,
    });

    // Fan out
    await Promise.all(
      subs.map(async (s) => {
        const subscription = {
          endpoint: s.endpoint,
          keys: { p256dh: s.p256dh, auth: s.auth },
        } as any;
        try {
          await webpush.sendNotification(subscription, payload);
        } catch (err: any) {
          // If subscription is gone, best-effort cleanup
          if (err?.statusCode === 410 || err?.statusCode === 404) {
            await supabase
              .from("agent_push_subscriptions")
              .delete()
              .eq("endpoint", s.endpoint);
          }
        }
      })
    );

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Unexpected error" }, { status: 500 });
  }
}


