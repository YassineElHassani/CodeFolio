import { Schema, model, Document } from 'mongoose';

export interface IProfile extends Document {
  name: string;
  title?: string;
  bio?: string;
  avatarUrl?: string;
  social?: Array<{ platform: string; icon?: string; url: string }>;
}

const ProfileSchema = new Schema<IProfile>({
  name: { type: String, required: true },
  title: { type: String },
  bio: { type: String },
  avatarUrl: { type: String },
  social: {
    type: [
      new Schema({
        platform: { type: String, required: true },
        icon: { type: String },
        url: { type: String, required: true }
      }, { _id: false })
    ],
    default: []
  }
});

export default model<IProfile>('Profile', ProfileSchema);
