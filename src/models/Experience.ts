import { Schema, model, Document } from 'mongoose';

export interface IExperience extends Document {
  company: string;
  role: string;
  startDate?: Date;
  endDate?: Date;
  details?: string;
}

const ExperienceSchema = new Schema<IExperience>({
  company: { type: String, required: true },
  role: { type: String, required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  details: { type: String }
}, { timestamps: true });

export default model<IExperience>('Experience', ExperienceSchema);
