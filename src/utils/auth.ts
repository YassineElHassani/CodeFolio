import { Request } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

export interface AuthUser {
  id: string;
  username: string;
  isAdmin: boolean;
}

export async function getUserFromReq(req: Request): Promise<AuthUser | null> {
  const header = req.headers['authorization'] || req.headers['Authorization'];
  const token = typeof header === 'string' && header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return null;
  try {
    const secret = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(token, secret) as any;
    // Optionally verify user still exists
    const user = await User.findById(decoded.id).lean();
    if (!user) return null;
    return { id: user._id.toString(), username: user.username, isAdmin: user.isAdmin };
  } catch (err) {
    return null;
  }
}
