import { NextRequest, NextResponse } from "next/server";
import { sendEmail, emailTemplates } from "@lipam/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, to, data } = body;

    if (!to || !type) {
      return NextResponse.json(
        { error: "Missing required fields: to, type" },
        { status: 400 }
      );
    }

    let emailContent;

    switch (type) {
      case "welcome":
        emailContent = emailTemplates.welcome(data.name);
        break;
      case "orderConfirmation":
        emailContent = emailTemplates.orderConfirmation(
          data.orderNumber,
          data.customerName,
          data.total
        );
        break;
      case "orderShipped":
        emailContent = emailTemplates.orderShipped(
          data.orderNumber,
          data.customerName,
          data.trackingNumber
        );
        break;
      case "paymentReminder":
        emailContent = emailTemplates.paymentReminder(
          data.customerName,
          data.amount,
          data.dueDate
        );
        break;
      default:
        return NextResponse.json(
          { error: "Invalid email type" },
          { status: 400 }
        );
    }

    const result = await sendEmail({
      to,
      subject: emailContent.subject,
      html: emailContent.html,
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Email sent successfully",
        messageId: result.messageId,
      });
    } else {
      return NextResponse.json(
        { error: "Failed to send email", details: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Email API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
