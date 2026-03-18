import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import Project from "@/models/Project";

// Input validation
const validateProjectInput = (data) => {
  const errors = [];
  if (!data.title || typeof data.title !== 'string' || data.title.trim().length < 2 || data.title.length > 200) {
    errors.push("Title must be 2-200 characters");
  }
  if (!data.description || typeof data.description !== 'string' || data.description.trim().length < 10 || data.description.length > 5000) {
    errors.push("Description must be 10-5000 characters");
  }
  if (data.techStack && !Array.isArray(data.techStack)) {
    errors.push("Tech stack must be an array");
  } else if (data.techStack) {
    if (data.techStack.length > 20) errors.push("Tech stack max 20 items");
    if (data.techStack.some(item => typeof item !== 'string' || item.length > 50)) {
      errors.push("Each tech item must be string under 50 chars");
    }
  }
  if (data.githubLink && (typeof data.githubLink !== 'string' || data.githubLink.length > 500)) {
    errors.push("GitHub link invalid");
  }
  if (data.liveLink && (typeof data.liveLink !== 'string' || data.liveLink.length > 500)) {
    errors.push("Live link invalid");
  }
  if (data.featured !== undefined && typeof data.featured !== 'boolean') {
    errors.push("Featured must be boolean");
  }
  return errors;
};

// API Key auth check
const authenticateRequest = (request) => {
  const apiKey = request.headers.get('x-api-key');
  const validApiKey = process.env.PROJECTS_API_KEY;
  if (!validApiKey) return { authenticated: false, error: "API key not configured" };
  if (!apiKey || apiKey !== validApiKey) return { authenticated: false, error: "Invalid API key" };
  return { authenticated: true };
};

// fetch all projects
export async function GET() {
  try {
    await connectMongoDB();
    const projects = await Project.find().sort({ createdAt: -1 });
    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return NextResponse.json({ message: "Failed to fetch projects" }, { status: 500 });
  }
}

// add new project (requires API key)
export async function POST(request) {
  try {
    const auth = authenticateRequest(request);
    if (!auth.authenticated) {
      return NextResponse.json({ message: auth.error }, { status: 401 });
    }
    
    const body = await request.json();
    const { title, description, techStack, githubLink, liveLink, featured } = body;
    
    const validationErrors = validateProjectInput({ title, description, techStack, githubLink, liveLink, featured });
    if (validationErrors.length > 0) {
      return NextResponse.json({ message: "Validation failed", errors: validationErrors }, { status: 400 });
    }
    
    await connectMongoDB();
    await Project.create({ 
      title: title.trim(), 
      description: description.trim(), 
      techStack: techStack || [], 
      githubLink: githubLink?.trim() || null, 
      liveLink: liveLink?.trim() || null, 
      featured: featured || false 
    });
    return NextResponse.json({ message: "Project Created" }, { status: 201 });
  } catch (error) {
    console.error("Failed to create project:", error);
    return NextResponse.json({ message: "Failed to create project" }, { status: 500 });
  }
}