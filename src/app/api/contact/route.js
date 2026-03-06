import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import Message from "@/models/Message";
import { Resend } from 'resend';

// Use the environment variable for security
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { name, email, phone, message } = await request.json();
    
    // 1. Save to MongoDB (Your permanent log)
    await connectMongoDB();
    await Message.create({ name, email, phone, message });

    // 2. Trigger the Email Notification
    await resend.emails.send({
      from: 'Portfolio <onboarding@resend.dev>',
      to: 'ubaiddar1614@gmail.com', // Your Gmail
      subject: `🚀 New Message from ${name}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #10b981;">New Inquiry Received</h2>
          <hr />
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Message:</strong></p>
          <div style="background: #f4f4f4; padding: 15px; border-radius: 10px;">
            ${message}
          </div>
        </div>
      `
    });
    
    return NextResponse.json({ message: "Success!" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error", error: error.message }, { status: 500 });
  }
}