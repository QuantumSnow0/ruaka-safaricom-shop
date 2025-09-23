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
    const { name, email, phone, subject, message } = body;

    // Validate required fields
    if (!name || !email || !phone || !subject || !message) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Validate phone number (Kenyan format)
    const phoneRegex = /^(\+254|0)[0-9]{9}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid Kenyan phone number" },
        { status: 400 }
      );
    }

    // Determine priority based on subject keywords
    const urgentKeywords = [
      "urgent",
      "emergency",
      "asap",
      "immediately",
      "critical",
    ];
    const highKeywords = ["problem", "issue", "complaint", "refund", "cancel"];

    let priority: "low" | "medium" | "high" | "urgent" = "medium";
    const subjectLower = subject.toLowerCase();
    const messageLower = message.toLowerCase();

    if (
      urgentKeywords.some(
        (keyword) =>
          subjectLower.includes(keyword) || messageLower.includes(keyword)
      )
    ) {
      priority = "urgent";
    } else if (
      highKeywords.some(
        (keyword) =>
          subjectLower.includes(keyword) || messageLower.includes(keyword)
      )
    ) {
      priority = "high";
    }

    // Insert message using service role (bypasses RLS)
    const { data: messageData, error: dbError } = await supabase
      .from("contact_messages")
      .insert([
        {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          subject: subject.trim(),
          message: message.trim(),
          priority,
          status: "new",
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        {
          success: false,
          message: `Failed to send message: ${dbError.message}`,
        },
        { status: 500 }
      );
    }

    // Log successful submission
    console.log("Contact message submitted successfully:", {
      id: messageData.id,
      name: name,
      email: email,
      subject: subject,
      priority,
    });

    return NextResponse.json({
      success: true,
      message:
        "Message sent successfully! We'll get back to you within 24 hours.",
    });
  } catch (error) {
    console.error("Error processing contact message:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred. Please try again later.",
      },
      { status: 500 }
    );
  }
}

