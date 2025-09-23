import { NextRequest, NextResponse } from "next/server";

// M-Pesa STK Push API endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phoneNumber, amount, accountReference, transactionDesc } = body;

    // Validate required fields
    if (!phoneNumber || !amount || !accountReference) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Format phone number (remove +254 and add 254)
    const formattedPhone = phoneNumber.replace(/^\+?254/, "254");

    // M-Pesa API credentials (in production, these should be in environment variables)
    const consumerKey = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    const businessShortCode = process.env.MPESA_BUSINESS_SHORT_CODE;
    const passkey = process.env.MPESA_PASSKEY;
    const callbackUrl = process.env.MPESA_CALLBACK_URL;

    if (!consumerKey || !consumerSecret || !businessShortCode || !passkey) {
      return NextResponse.json(
        { error: "M-Pesa configuration missing" },
        { status: 500 }
      );
    }

    // Get access token
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString(
      "base64"
    );
    const tokenResponse = await fetch(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!tokenResponse.ok) {
      throw new Error("Failed to get access token");
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Generate timestamp
    const timestamp = new Date()
      .toISOString()
      .replace(/[^0-9]/g, "")
      .slice(0, -3);

    // Generate password
    const password = Buffer.from(
      `${businessShortCode}${passkey}${timestamp}`
    ).toString("base64");

    // STK Push request
    const stkPushData = {
      BusinessShortCode: businessShortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.round(amount),
      PartyA: formattedPhone,
      PartyB: businessShortCode,
      PhoneNumber: formattedPhone,
      CallBackURL: callbackUrl,
      AccountReference: accountReference,
      TransactionDesc: transactionDesc || "Payment for order",
    };

    const stkPushResponse = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(stkPushData),
      }
    );

    const stkPushResult = await stkPushResponse.json();

    if (stkPushResult.ResponseCode === "0") {
      return NextResponse.json({
        success: true,
        checkoutRequestID: stkPushResult.CheckoutRequestID,
        message: "STK Push sent successfully",
      });
    } else {
      return NextResponse.json(
        {
          error: "STK Push failed",
          details: stkPushResult,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("M-Pesa STK Push error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
