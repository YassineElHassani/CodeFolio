import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  password: string; // hashed
  isAdmin: boolean;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: true }
}, { timestamps: true });

export default model<IUser>('User', UserSchema);
