import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@lipam/lib/supabase";

// M-Pesa callback endpoint for STK Push results
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Log the callback for debugging
    console.log("M-Pesa Callback received:", JSON.stringify(body, null, 2));

    // Extract callback data
    const {
      Body: {
        stkCallback: {
          CheckoutRequestID,
          ResultCode,
          ResultDesc,
          CallbackMetadata,
        },
      },
    } = body;

    // Find the order by CheckoutRequestID
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("mpesa_checkout_request_id", CheckoutRequestID)
      .single();

    if (orderError || !order) {
      console.error(
        "Order not found for CheckoutRequestID:",
        CheckoutRequestID
      );
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Update order based on payment result
    if (ResultCode === 0) {
      // Payment successful
      const metadata = CallbackMetadata?.Item || [];
      const mpesaReceiptNumber = metadata.find(
        (item: any) => item.Name === "MpesaReceiptNumber"
      )?.Value;
      const transactionDate = metadata.find(
        (item: any) => item.Name === "TransactionDate"
      )?.Value;
      const phoneNumber = metadata.find(
        (item: any) => item.Name === "PhoneNumber"
      )?.Value;

      // Update order status
      const { error: updateError } = await supabase
        .from("orders")
        .update({
          payment_status: "paid",
          order_status: "approved",
          mpesa_receipt_number: mpesaReceiptNumber,
          mpesa_transaction_date: transactionDate,
          updated_at: new Date().toISOString(),
        })
        .eq("id", order.id);

      if (updateError) {
        console.error("Error updating order:", updateError);
        return NextResponse.json(
          { error: "Failed to update order" },
          { status: 500 }
        );
      }

      // Send confirmation email (in production)
      // await sendOrderConfirmationEmail(order.id)

      console.log(`Order ${order.id} payment confirmed`);
    } else {
      // Payment failed
      const { error: updateError } = await supabase
        .from("orders")
        .update({
          payment_status: "failed",
          payment_failure_reason: ResultDesc,
          updated_at: new Date().toISOString(),
        })
        .eq("id", order.id);

      if (updateError) {
        console.error("Error updating order:", updateError);
        return NextResponse.json(
          { error: "Failed to update order" },
          { status: 500 }
        );
      }

      console.log(`Order ${order.id} payment failed: ${ResultDesc}`);
    }

    return NextResponse.json({
      success: true,
      message: "Callback processed successfully",
    });
  } catch (error) {
    console.error("M-Pesa callback error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
