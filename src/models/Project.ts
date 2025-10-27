import { Schema, model, Document, Types } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description?: string;
  skills?: string[];
  url?: string;
  slug?: string;
  image?: string;
}

const ProjectSchema = new Schema<IProject>({
  title: { type: String, required: true },
  description: { type: String },
  skills: { type: [String], default: [] },
  url: { type: String },
  slug: { type: String },
  image: { type: String }
}, { timestamps: true });

export default model<IProject>('Project', ProjectSchema);
