import { Product, User } from "@/types";

// In-memory token bucket rate limiter for sensitive operations (login, search, contact unlocks)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

export function checkRateLimit(key: string, maxRequests: number = 60, windowMs: number = 60000): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now - record.lastReset > windowMs) {
    rateLimitMap.set(key, { count: 1, lastReset: now });
    return true;
  }

  if (record.count >= maxRequests) {
    return false; // Rate limit exceeded
  }

  record.count += 1;
  return true;
}

/**
 * Strips sensitive PII (phone number, email, password hashes) from product & seller responses.
 * OWASP ASVS Level 2 Contact Privacy requirement:
 * "Private seller phone/email data must never be sent to the browser simply because a user can see a product."
 */
export function sanitizeProductPublic(product: Product, isContactUnlocked: boolean = false): Product {
  const cleanProduct = { ...product };
  if (!isContactUnlocked) {
    delete cleanProduct.seller_phone;
  }
  return cleanProduct;
}

export function sanitizeUserPublic(user: User): Partial<User> {
  const { password_hash, phone, email, ...publicUser } = user;
  return publicUser;
}

/**
 * XSS string sanitizer for user inputs (titles, descriptions, comments)
 */
export function sanitizeText(input: string): string {
  if (!input) return "";
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}
