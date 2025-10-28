import mongoose from 'mongoose';

export async function connectDb(uri: string) {
  if (!uri) throw new Error('MONGO_URI is not defined');
  await mongoose.connect(uri);
  console.log('MongoDB connected');
}
