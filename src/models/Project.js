import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  techStack: [{ type: String }], 
  githubLink: { type: String },
  liveLink: { type: String },
  featured: { type: Boolean, default: false } 
}, { timestamps: true });

// prevents Next.js from creating model twice during hot reload
export default mongoose.models.Project || mongoose.model('Project', projectSchema);