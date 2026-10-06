import { User, type IUser, type UserRole } from '../models/User.js';

export function configuredAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isConfiguredAdmin(email: string): boolean {
  return configuredAdminEmails().includes(email.trim().toLowerCase());
}

export function normaliseRole(role: string | undefined): UserRole {
  if (role === 'admin' || role === 'job-lister') return role;
  return 'learner';
}

export async function ensureConfiguredAdmin(user: IUser): Promise<IUser> {
  if (isConfiguredAdmin(user.email) && user.role !== 'admin') {
    user.role = 'admin';
    await user.save();
  }

  return user;
}

export async function syncConfiguredAdmins(): Promise<void> {
  const emails = configuredAdminEmails();
  if (emails.length === 0) return;

  await User.updateMany(
    { email: { $in: emails }, role: { $ne: 'admin' } },
    { $set: { role: 'admin' } },
  );
}
