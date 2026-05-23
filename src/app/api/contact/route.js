import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import Message from "@/models/Message";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Simple in-memory rate limiter
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 3;

const rateLimit = (ip) => {
  const now = Date.now();
  const userLimit = rateLimitMap.get(ip);
  if (!userLimit) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true };
  }
  if (now > userLimit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true };
  }
  if (userLimit.count >= RATE_LIMIT_MAX) {
    return { allowed: false, retryAfter: Math.ceil((userLimit.resetTime - now) / 1000 / 60) };
  }
  userLimit.count += 1;
  return { allowed: true };
};

// HTML escape to prevent XSS
const escapeHtml = (unsafe) => {
  if (typeof unsafe !== 'string') return '';
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

// Input validation
const validateInput = (data) => {
  const errors = [];
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2 || data.name.length > 100) {
    errors.push("Name must be 2-100 characters");
  }
  if (!data.email || typeof data.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || data.email.length > 254) {
    errors.push("Valid email required");
  }
  if (!data.phone || typeof data.phone !== 'string' || data.phone.length > 50) {
    errors.push("Phone must be under 50 characters");
  }
  if (!data.message || typeof data.message !== 'string' || data.message.trim().length < 5 || data.message.length > 5000) {
    errors.push("Message must be 5-5000 characters");
  }
  return errors;
};

export async function POST(request) {
  try {
    // 1. IP extraction and Rate Limiting
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : (request.headers.get('x-real-ip') || 'unknown');
    
    const rateLimitCheck = rateLimit(ip);
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        { message: `Too many requests. Please try again in ${rateLimitCheck.retryAfter} minutes.` },
        { status: 429 }
      );
    }

    // 2. Parse and Validate Request Body
    const body = await request.json();
    const { name, email, phone, message } = body;
    
    const validationErrors = validateInput({ name, email, phone, message });
    if (validationErrors.length > 0) {
      return NextResponse.json({ message: "Validation failed", errors: validationErrors }, { status: 400 });
    }
    
    // 3. Connect to Database & Save (Primary Source of Truth)
    await connectMongoDB();
    await Message.create({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      message: message.trim()
    });

    // 4. Send Emails in Background with independent try-catches
    // Preparing escaped strings for safe HTML rendering in email templates
    const safeName = escapeHtml(name.trim());
    const safeEmail = escapeHtml(email.trim());
    const safePhone = escapeHtml(phone.trim());
    const safeMessage = escapeHtml(message.trim());

    // Admin Inquiry Notification
    try {
      await resend.emails.send({
        from: 'Ubaid Raza Dar <contact@ubaiddar.dev>',
        to: 'ubaiddar1614@gmail.com', 
        subject: `🚀 New Message from ${safeName}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #10b981;">New Inquiry Received</h2>
            <hr />
            <p><strong>Name:</strong> ${safeName}</p>
            <p><strong>Email:</strong> ${safeEmail}</p>
            <p><strong>Phone:</strong> ${safePhone}</p>
            <p><strong>Message:</strong></p>
            <div style="background: #f4f4f4; padding: 15px; border-radius: 10px; white-space: pre-wrap;">${safeMessage}</div>
          </div>
        `
      });
    } catch (emailError) {
      console.error("Failed to send admin notification email:", emailError);
      // We do not fail the request; the message is already saved in the database
    }

    // Auto-Reply Confirmation to Visitor
    try {
      await resend.emails.send({
        from: 'Ubaid Raza Dar <contact@ubaiddar.dev>',
        reply_to: 'ubaiddar1614@gmail.com',
        to: email.trim(),
        subject: 'Thanks for reaching out!',
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #10b981;">Hi ${safeName},</h2>
            <p>Thanks for your message! I'll get back to you as soon as possible.</p>
            <p>Best regards,<br/>Ubaid Raza Dar</p>
            <hr style="margin-top: 20px; border: none; border-top: 1px solid #eee;" />
            <p style="font-size: 12px; color: #888;">This is an automated confirmation.</p>
          </div>
        `
      });
    } catch (replyError) {
      console.error("Failed to send auto-reply email to visitor:", replyError);
      // We do not fail the request
    }
    
    return NextResponse.json({ message: "Message sent and stored successfully!" }, { status: 201 });
  } catch (error) {
    console.error("Contact form route error:", error);
    return NextResponse.json({ message: "An unexpected error occurred while processing your request." }, { status: 500 });
  }
}