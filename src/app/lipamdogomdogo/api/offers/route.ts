import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// GET - Fetch all offers
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("offers")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching offers:", error);
      return NextResponse.json(
        { error: "Failed to fetch offers", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ offers: data || [] });
  } catch (error) {
    console.error("Error in offers API:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST - Create new offer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      subtitle,
      side_image_url,
      is_active = true,
      display_order,
    } = body;

    const { data, error } = await supabase
      .from("offers")
      .insert([
        {
          title,
          subtitle,
          side_image_url,
          is_active,
          display_order,
        },
      ])
      .select();

    if (error) {
      console.error("Error creating offer:", error);
      return NextResponse.json(
        { error: "Failed to create offer", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ offer: data[0] });
  } catch (error) {
    console.error("Error in create offer API:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

