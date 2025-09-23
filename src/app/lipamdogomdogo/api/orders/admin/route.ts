import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Use service role key for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export async function GET() {
  try {
    console.log("Fetching orders from admin API...");

    // First try to get orders with order_items
    let { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (
          *,
          product:products (*)
        )
      `
      )
      .order("created_at", { ascending: false });

    // If that fails, try without order_items
    if (error) {
      console.log(
        "Failed to fetch with order_items, trying without:",
        error.message
      );
      const fallbackResult = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (fallbackResult.error) {
        throw fallbackResult.error;
      }

      data = fallbackResult.data;
      error = null;
    }

    if (error) {
      console.error("Error fetching orders:", error);
      return NextResponse.json(
        { error: "Failed to fetch orders", details: String(error) },
        { status: 500 }
      );
    }

    console.log("Successfully fetched orders:", data?.length || 0);
    return NextResponse.json(data || []);
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
