import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email } = body || {};

    if (!fullName || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate the caller is authenticated (based on cookies/session)
    const cookieStore = cookies();
    const supabaseAuth = createRouteHandlerClient({ cookies: () => cookieStore });
    const {
      data: { user },
      error: userError,
    } = await supabaseAuth.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Use service role to bypass RLS for controlled system insert
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json(
        { error: "Server not configured (Supabase env missing)" },
        { status: 500 }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceKey);

    // If agent already exists, do nothing (idempotent)
    const { data: existing, error: existingError } = await supabaseAdmin
      .from("chat_agents")
      .select("id, is_active")
      .or(`user_id.eq.${user.id},email.eq.${email}`)
      .limit(1)
      .maybeSingle();

    if (existingError) {
      return NextResponse.json(
        { error: existingError.message || "Failed to check existing agent" },
        { status: 400 }
      );
    }

    if (!existing) {
      const { error: insertError } = await supabaseAdmin.from("chat_agents").insert({
        user_id: user.id,
        full_name: fullName,
        email,
        is_active: false,
        created_at: new Date().toISOString(),
      });

      if (insertError) {
        return NextResponse.json(
          { error: insertError.message || "Failed to create agent row" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Unexpected error" },
      { status: 500 }
    );
  }
}


