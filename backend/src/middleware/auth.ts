import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, type IUser } from '../models/User.js';

export interface AuthRequest extends Request {
  user?: IUser;
}

interface JwtPayload {
  userId: string;
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }
  return secret;
}

export function signToken(userId: string): string {
  return jwt.sign({ userId }, getJwtSecret(), { expiresIn: '7d' });
}

export async function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Authentication required.' });
      return;
    }

    const token = header.slice(7);
    const decoded = jwt.verify(token, getJwtSecret()) as JwtPayload;
    const user = await User.findById(decoded.userId);

    if (!user) {
      res.status(401).json({ message: 'Authentication required.' });
      return;
    }

    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired session. Please sign in again.' });
  }
}
