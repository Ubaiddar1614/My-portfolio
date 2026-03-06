import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  // techStack will be an array of strings like ["Next.js", "Tailwind", "Python"]
  techStack: [{ type: String }], 
  githubLink: { type: String },
  liveLink: { type: String },
  // This helps us decide which projects get the big boxes in the Bento Grid
  featured: { type: Boolean, default: false } 
}, { timestamps: true });

// This line prevents Next.js from crashing by trying to create the model twice
export default mongoose.models.Project || mongoose.model('Project', projectSchema);