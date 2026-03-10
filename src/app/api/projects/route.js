import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import Project from "@/models/Project";

// fetch all projects
export async function GET() {
  try {
    await connectMongoDB();
    const projects = await Project.find().sort({ createdAt: -1 });
    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch projects" }, { status: 500 });
  }
}

// add new project (use postman or smth)
export async function POST(request) {
  try {
    const { title, description, techStack, githubLink, liveLink, featured } = await request.json();
    await connectMongoDB();
    await Project.create({ title, description, techStack, githubLink, liveLink, featured });
    return NextResponse.json({ message: "Project Created" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to create project" }, { status: 500 });
  }
}