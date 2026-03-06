import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import Message from "@/models/Message";

// Notice how POST is in ALL CAPS!
export async function POST(request) {
  try {
    const { name, email, phone, message } = await request.json();
    
    if (!name || !email || !phone || !message) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    await connectMongoDB();
    await Message.create({ name, email, phone, message });
    
    return NextResponse.json({ message: "Message sent successfully!" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to send message" }, { status: 500 });
  }
}