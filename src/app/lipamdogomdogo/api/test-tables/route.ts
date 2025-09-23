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
    // Test if orders table exists
    const { data: ordersData, error: ordersError } = await supabase
      .from("orders")
      .select("id")
      .limit(1);

    // Test if order_items table exists
    const { data: itemsData, error: itemsError } = await supabase
      .from("order_items")
      .select("id")
      .limit(1);

    return NextResponse.json({
      ordersTable: {
        exists: !ordersError,
        error: ordersError?.message,
      },
      orderItemsTable: {
        exists: !itemsError,
        error: itemsError?.message,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to test tables", details: error },
      { status: 500 }
    );
  }
}

