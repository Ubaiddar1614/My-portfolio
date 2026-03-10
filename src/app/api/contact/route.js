import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import Message from "@/models/Message";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { name, email, phone, message } = await request.json();
    
    // fire off the email first
    await resend.emails.send({
      from: 'Ubaid Raza Dar <contact@ubaiddar.dev>',
      to: 'ubaiddar1614@gmail.com', 
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

    // auto-reply to visitor
    await resend.emails.send({
      from: 'Ubaid Raza Dar <contact@ubaiddar.dev>',
      to: email,
      subject: 'Thanks for reaching out!',
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #10b981;">Hi ${name},</h2>
          <p>Thanks for your message! I've received it and will get back to you soon.</p>
          <p>Best,<br/>Ubaid Raza Dar</p>
          <hr style="margin-top: 20px; border: none; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #888;">This is an automated confirmation.</p>
        </div>
      `
    });

    // then chuck it in the db (only if email worked)
    await connectMongoDB();
    await Message.create({ name, email, phone, message });
    
    return NextResponse.json({ message: "Success!" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error", error: error.message }, { status: 500 });
  }
}