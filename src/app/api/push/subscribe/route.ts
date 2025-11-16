import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabaseCookies = createRouteHandlerClient({ cookies: () => cookieStore });

    // Prefer Authorization: Bearer <access_token> if provided
    const authHeader = req.headers.get("authorization");
    let userId: string | null = null;
    if (authHeader?.toLowerCase().startsWith("bearer ")) {
      const accessToken = authHeader.slice(7).trim();
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
      if (!supabaseUrl || !serviceKey) {
        return NextResponse.json({ error: "Server not configured" }, { status: 500 });
      }
      const supabaseAdmin = createClient(supabaseUrl, serviceKey);
      const { data: userRes, error: tokenErr } = await supabaseAdmin.auth.getUser(accessToken);
      if (tokenErr || !userRes?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      userId = userRes.user.id;
    } else {
      const {
        data: { user },
        error: authError,
      } = await supabaseCookies.auth.getUser();
      if (authError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      userId = user.id;
    }

    // Ensure agent exists and active
    const { data: agent, error: agentErr } = await supabaseCookies
      .from("chat_agents")
      .select("id, is_active")
      .eq("user_id", userId)
      .eq("is_active", true)
      .maybeSingle();
    if (agentErr || !agent) {
      return NextResponse.json({ error: "Agent not active" }, { status: 403 });
    }

    const body = await req.json();
    const subscription = body?.subscription;
    const userAgent = req.headers.get("user-agent") || undefined;
    if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
      return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
    }

    // Upsert by endpoint
    const { error: upsertErr } = await supabaseCookies
      .from("agent_push_subscriptions")
      .upsert(
        {
          agent_id: agent.id,
          endpoint: subscription.endpoint,
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
          user_agent: userAgent,
        },
        { onConflict: "endpoint" }
      );
    if (upsertErr) {
      return NextResponse.json({ error: upsertErr.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Unexpected error" }, { status: 500 });
  }
}


