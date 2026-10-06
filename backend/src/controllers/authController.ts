import crypto from 'crypto';
import type { Response } from 'express';
import bcrypt from 'bcryptjs';
import { ensureConfiguredAdmin, isConfiguredAdmin, normaliseRole } from '../config/roles.js';
import { User } from '../models/User.js';
import { requireAuth, signToken, type AuthRequest } from '../middleware/auth.js';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function publicUser(user: {
  _id: unknown;
  fullName: string;
  email: string;
  role?: string;
  createdAt?: Date;
}) {
  return {
    id: String(user._id),
    fullName: user.fullName,
    email: user.email,
    role: normaliseRole(user.role),
    createdAt: user.createdAt,
  };
}

export async function signup(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { fullName, email, password } = req.body ?? {};

    if (typeof fullName !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
      res.status(400).json({ message: 'Full name, email and password are required.' });
      return;
    }

    const name = fullName.trim();
    const normalisedEmail = email.trim().toLowerCase();

    if (!name || !normalisedEmail || !password) {
      res.status(400).json({ message: 'Please complete every field.' });
      return;
    }

    if (!isValidEmail(normalisedEmail)) {
      res.status(400).json({ message: 'Please provide a valid email address.' });
      return;
    }

    if (password.length < 8) {
      res.status(400).json({ message: 'Password must be at least 8 characters.' });
      return;
    }

    const existing = await User.findOne({ email: normalisedEmail });
    if (existing) {
      res.status(409).json({ message: 'An account with this email already exists.' });
      return;
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({
      fullName: name,
      email: normalisedEmail,
      password: hashed,
      role: isConfiguredAdmin(normalisedEmail) ? 'admin' : 'learner',
    });

    const token = signToken(String(user._id));
    res.status(201).json({
      message: 'Account created successfully.',
      token,
      user: publicUser(user),
    });
  } catch (error) {
    console.error('signup error:', error);
    res.status(500).json({ message: 'Unable to create account right now.' });
  }
}

export async function login(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { email, password } = req.body ?? {};

    if (typeof email !== 'string' || typeof password !== 'string') {
      res.status(400).json({ message: 'Email and password are required.' });
      return;
    }

    const normalisedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalisedEmail });

    if (!user) {
      res.status(401).json({ message: 'Invalid email or password.' });
      return;
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(401).json({ message: 'Invalid email or password.' });
      return;
    }

    await ensureConfiguredAdmin(user);
    const token = signToken(String(user._id));
    res.json({
      message: 'Signed in successfully.',
      token,
      user: publicUser(user),
    });
  } catch (error) {
    console.error('login error:', error);
    res.status(500).json({ message: 'Unable to sign in right now.' });
  }
}

export async function forgotPassword(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { email } = req.body ?? {};

    if (typeof email !== 'string' || !email.trim()) {
      res.status(400).json({ message: 'Email is required.' });
      return;
    }

    const normalisedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalisedEmail });

    // Always return a generic success message to avoid email enumeration
    const genericMessage =
      'If an account exists for that email, password reset instructions have been prepared.';

    if (!user) {
      res.json({ message: genericMessage });
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
    const resetUrl = `${clientOrigin}/reset-password?token=${resetToken}`;

    // No email provider configured yet — log the link for local/dev use
    console.log(`Password reset link for ${user.email}: ${resetUrl}`);

    res.json({
      message: genericMessage,
      ...(process.env.NODE_ENV !== 'production' ? { resetUrl } : {}),
    });
  } catch (error) {
    console.error('forgotPassword error:', error);
    res.status(500).json({ message: 'Unable to process password reset right now.' });
  }
}

export async function resetPassword(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { token, password } = req.body ?? {};

    if (typeof token !== 'string' || typeof password !== 'string') {
      res.status(400).json({ message: 'Reset token and new password are required.' });
      return;
    }

    if (password.length < 8) {
      res.status(400).json({ message: 'Password must be at least 8 characters.' });
      return;
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      res.status(400).json({ message: 'Reset link is invalid or has expired.' });
      return;
    }

    user.password = await bcrypt.hash(password, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    if (isConfiguredAdmin(user.email)) {
      user.role = 'admin';
    }
    await user.save();

    const authToken = signToken(String(user._id));
    res.json({
      message: 'Password updated successfully. You are now signed in.',
      token: authToken,
      user: publicUser(user),
    });
  } catch (error) {
    console.error('resetPassword error:', error);
    res.status(500).json({ message: 'Unable to reset password right now.' });
  }
}

export async function getMe(req: AuthRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ message: 'Authentication required.' });
    return;
  }

  res.json({ user: publicUser(req.user) });
}

export async function updateSettings(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required.' });
      return;
    }

    const { fullName, email, currentPassword, newPassword } = req.body ?? {};
    const user = req.user;

    if (typeof fullName === 'string' && fullName.trim()) {
      user.fullName = fullName.trim();
    }

    if (typeof email === 'string' && email.trim()) {
      const normalisedEmail = email.trim().toLowerCase();
      if (!isValidEmail(normalisedEmail)) {
        res.status(400).json({ message: 'Please provide a valid email address.' });
        return;
      }

      if (normalisedEmail !== user.email) {
        const taken = await User.findOne({ email: normalisedEmail });
        if (taken) {
          res.status(409).json({ message: 'That email is already in use.' });
          return;
        }
        user.email = normalisedEmail;
      }
    }

    if (typeof newPassword === 'string' && newPassword.length > 0) {
      if (typeof currentPassword !== 'string' || !currentPassword) {
        res.status(400).json({ message: 'Current password is required to set a new password.' });
        return;
      }

      const match = await bcrypt.compare(currentPassword, user.password);
      if (!match) {
        res.status(401).json({ message: 'Current password is incorrect.' });
        return;
      }

      if (newPassword.length < 8) {
        res.status(400).json({ message: 'New password must be at least 8 characters.' });
        return;
      }

      user.password = await bcrypt.hash(newPassword, 12);
    }

    await user.save();

    res.json({
      message: 'Settings updated successfully.',
      user: publicUser(user),
    });
  } catch (error) {
    console.error('updateSettings error:', error);
    res.status(500).json({ message: 'Unable to update settings right now.' });
  }
}

export { requireAuth };
