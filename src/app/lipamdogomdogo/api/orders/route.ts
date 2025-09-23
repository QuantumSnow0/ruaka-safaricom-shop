import { NextRequest, NextResponse } from "next/server";
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Order creation request body:", JSON.stringify(body, null, 2));

    const { userId, items, totalAmount, shippingAddress, customerInfo } = body;

    // Validate required fields
    if (
      !userId ||
      !items ||
      !totalAmount ||
      !shippingAddress ||
      !customerInfo
    ) {
      console.log("Missing required fields:", {
        userId,
        items,
        totalAmount,
        shippingAddress,
        customerInfo,
      });
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 6)
      .toUpperCase()}`;

    // Create order with simplified structure
    const orderData = {
      user_id: userId,
      order_number: orderNumber,
      total_amount: totalAmount,
      customer_name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
      customer_phone: shippingAddress.phone,
      customer_county: shippingAddress.county,
      status: "pending",
    };

    console.log("Creating order with data:", orderData);

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([orderData])
      .select()
      .single();

    if (orderError) {
      console.error("Error creating order:", orderError);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to create order",
          error: orderError.message,
          details: orderError,
        },
        { status: 500 }
      );
    }

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product.id,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Error creating order items:", itemsError);
      // Try to delete the order if items creation failed
      await supabase.from("orders").delete().eq("id", order.id);
      return NextResponse.json(
        { success: false, message: "Failed to create order items" },
        { status: 500 }
      );
    }

    // Log successful order creation
    console.log("Order created successfully:", {
      orderId: order.id,
      orderNumber: orderNumber,
      customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
      totalAmount: totalAmount,
      itemCount: items.length,
    });

    return NextResponse.json({
      success: true,
      message: "Order placed successfully!",
      order: {
        id: order.id,
        orderNumber: orderNumber,
        totalAmount: totalAmount,
        status: "pending",
      },
    });
  } catch (error) {
    console.error("Error processing order:", error);
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
