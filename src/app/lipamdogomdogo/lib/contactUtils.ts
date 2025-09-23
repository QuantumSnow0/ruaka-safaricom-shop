import { supabase } from "./supabase";
import { ContactMessage } from "./supabase";
import toast from "react-hot-toast";

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export async function sendContactMessage(
  data: ContactFormData
): Promise<{ success: boolean; message: string }> {
  try {
    // Call the API route instead of direct Supabase
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to send message",
      };
    }

    // Send email notification (optional - requires email service setup)
    try {
      await sendEmailNotification(data, result.id || "unknown");
    } catch (emailError) {
      console.warn("Email notification failed:", emailError);
      // Don't fail the entire operation if email fails
    }

    return result;
  } catch (error) {
    console.error("Error sending contact message:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    };
  }
}

async function sendEmailNotification(
  data: ContactFormData,
  messageId: string
): Promise<void> {
  // This is a placeholder for email notification
  // In production, you would integrate with an email service like:
  // - Resend (recommended for Next.js)
  // - SendGrid
  // - Nodemailer with SMTP
  // - Supabase Edge Functions with email service

  const emailData = {
    to: "bmuthuri93@gmail.com", // Admin email
    subject: `New Contact Message: ${data.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">New Contact Message Received</h2>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1e293b;">Message Details</h3>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          <p><strong>Subject:</strong> ${data.subject}</p>
          <p><strong>Message ID:</strong> ${messageId}</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h3 style="margin-top: 0; color: #1e293b;">Message Content</h3>
          <p style="white-space: pre-wrap; line-height: 1.6;">${data.message}</p>
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background-color: #fef3c7; border-radius: 8px;">
          <p style="margin: 0; color: #92400e;">
            <strong>Action Required:</strong> Please respond to this message within 24 hours.
          </p>
        </div>
      </div>
    `,
  };

  // For now, just log the email data
  // In production, replace this with actual email sending logic
  console.log("Email notification data:", emailData);

  // Example with Resend (uncomment when you have RESEND_API_KEY set up):
  /*
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(emailData),
  })
  
  if (!response.ok) {
    throw new Error('Failed to send email notification')
  }
  */
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  try {
    // Use API route for fetching messages (server-side with service role)
    const response = await fetch("/api/contact/messages", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("Error fetching contact messages:", response.statusText);
      return [];
    }

    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    return [];
  }
}

export async function updateContactMessageStatus(
  messageId: string,
  status: ContactMessage["status"],
  adminNotes?: string
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch("/api/contact/messages", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messageId,
        status,
        adminNotes,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to update message status",
      };
    }

    return result;
  } catch (error) {
    console.error("Error updating contact message:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
}
