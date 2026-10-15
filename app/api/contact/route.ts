import { NextResponse } from "next/server";
import { CONTACT_REASONS } from "@/lib/contact-flow";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, reason, message } = body || {};

    // Validate input
    if (
      typeof name !== 'string' || !name.trim() || name.length > 100 ||
      typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      typeof reason !== 'string' || ![...CONTACT_REASONS, 'opportunity', 'project-help', 'tech-query', 'guidance', 'meet', 'other'].includes(reason) ||
      typeof message !== 'string' || !message.trim() || message.length > 3000
    ) {
      return NextResponse.json(
        { error: "Invalid contact fields" },
        { status: 400 }
      );
    }

    // Format message for Telegram
    const telegramMessage = `
📬 New Contact Form Submission

👤 Name: ${name}
📧 Email: ${email}
📋 Reason: ${reason}
💬 Message: ${message}
    `;

    // Send to Telegram
    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;

    if (!telegramBotToken || !telegramChatId) {
      console.error("Telegram configuration missing");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${telegramBotToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: telegramMessage,
        }),
      }
    );

    if (!telegramResponse.ok) {
      const telegramError = await telegramResponse.text();
      console.error("Telegram API error:", telegramError);
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
