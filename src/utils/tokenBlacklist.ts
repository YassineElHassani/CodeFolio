import mongoose from 'mongoose';

// Schema for blacklisted tokens
const tokenBlacklistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 }
  }
});

const TokenBlacklist = mongoose.model('TokenBlacklist', tokenBlacklistSchema);

export const blacklistToken = async (token: string, expiresIn: number) => {
  const expiresAt = new Date(Date.now() + expiresIn * 1000);
  await TokenBlacklist.create({ token, expiresAt });
};

export const isTokenBlacklisted = async (token: string): Promise<boolean> => {
  const blacklistedToken = await TokenBlacklist.findOne({ token });
  return !!blacklistedToken;
};