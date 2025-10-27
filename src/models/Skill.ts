import { Schema, model, Document } from 'mongoose';

export interface ISkill extends Document {
  name: string;
  level?: string;
  icon?: string;
}

const SkillSchema = new Schema<ISkill>({
  name: { type: String, required: true },
  level: { type: String },
  icon: { type: String }
});

export default model<ISkill>('Skill', SkillSchema);
