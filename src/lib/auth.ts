import { db } from './db';
import { User, UserRole } from '@/types';

export function getSessionUser(userIdHeader?: string | null): User | null {
  if (!userIdHeader) {
    // Default to buyer for demo browsing
    return db.getUserById('user_buyer_1') || null;
  }
  return db.getUserById(userIdHeader) || null;
}

export function verifyRole(user: User | null, allowedRoles: UserRole[]): boolean {
  if (!user) return false;
  return allowedRoles.includes(user.role);
}
