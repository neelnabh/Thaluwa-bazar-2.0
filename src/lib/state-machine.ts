import { OrderStatus, UserRole } from "@/types";

export interface StateTransitionResult {
  valid: boolean;
  message?: string;
}

export const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  REQUESTED: ['ACCEPTED', 'REJECTED', 'CANCELLED'],
  ACCEPTED: ['READY_FOR_PICKUP', 'REJECTED', 'CANCELLED'],
  READY_FOR_PICKUP: ['COMPLETED', 'CANCELLED'],
  COMPLETED: ['DISPUTED'],
  REJECTED: [],
  CANCELLED: [],
  DISPUTED: ['COMPLETED'],
};

/**
 * Validates whether an order state transition is mathematically and authorizationally valid
 */
export function validateOrderTransition(
  currentStatus: OrderStatus,
  newStatus: OrderStatus,
  userRole: UserRole,
  isBuyer: boolean,
  isSeller: boolean
): StateTransitionResult {
  // Check valid state jump
  const allowed = ALLOWED_TRANSITIONS[currentStatus];
  if (!allowed || !allowed.includes(newStatus)) {
    return {
      valid: false,
      message: `Invalid state transition from ${currentStatus} to ${newStatus}.`,
    };
  }

  // Admin / Moderator override
  if (userRole === 'admin' || userRole === 'moderator') {
    return { valid: true };
  }

  // Role permissions
  if (newStatus === 'ACCEPTED' || newStatus === 'REJECTED' || newStatus === 'READY_FOR_PICKUP') {
    if (!isSeller) {
      return { valid: false, message: "Only the seller can accept, reject, or mark orders ready." };
    }
  }

  if (newStatus === 'CANCELLED') {
    if (!isBuyer && !isSeller) {
      return { valid: false, message: "Only order participants can cancel an order." };
    }
  }

  if (newStatus === 'COMPLETED') {
    // Both buyer or seller can mark complete, or seller confirms handover
    if (!isBuyer && !isSeller) {
      return { valid: false, message: "Only buyer or seller can mark completed." };
    }
  }

  if (newStatus === 'DISPUTED') {
    if (!isBuyer) {
      return { valid: false, message: "Only buyer can file a dispute after completion." };
    }
  }

  return { valid: true };
}
