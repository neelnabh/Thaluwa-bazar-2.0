import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { validateOrderTransition } from '@/lib/state-machine';
import { OrderStatus } from '@/types';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';

  try {
    const { status: newStatus, user_id } = await req.json();

    if (!newStatus || !user_id) {
      return NextResponse.json({ error: "Missing required status or user ID" }, { status: 400 });
    }

    const order = db.getOrderById(id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const user = db.getUserById(user_id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isBuyer = order.buyer_id === user.id;
    const isSeller = order.seller_id === user.id;

    // Validate state machine transition & RBAC
    const validation = validateOrderTransition(
      order.status,
      newStatus as OrderStatus,
      user.role,
      isBuyer,
      isSeller
    );

    if (!validation.valid) {
      db.logAuditEvent({
        id: `aud_${Date.now()}`,
        actor_id: user.id,
        actor_role: user.role,
        actor_name: user.name,
        action: 'ORDER_STATUS_TRANSITION_DENIED',
        target_type: 'ORDER',
        target_id: order.id,
        result: 'DENIED',
        details: validation.message || 'Unauthorized state transition',
        ip_address: ip,
        created_at: new Date().toISOString(),
      });

      return NextResponse.json({ error: validation.message }, { status: 403 });
    }

    const updated = db.updateOrderStatus(order.id, newStatus as OrderStatus);

    // Notify other party
    const notifyTargetId = isSeller ? order.buyer_id : order.seller_id;
    db.createNotification({
      id: `notif_${Date.now()}`,
      user_id: notifyTargetId,
      title_en: `Order Status: ${newStatus}`,
      title_as: `অৰ্ডাৰ স্থিতি: ${newStatus}`,
      message_en: `Order #${order.id.slice(-4)} is now marked as ${newStatus}.`,
      message_as: `অৰ্ডাৰ #${order.id.slice(-4)}-ৰ অৱস্থা সলনি হৈছে: ${newStatus}`,
      type: 'order',
      link: isSeller ? '/buyer/dashboard' : '/seller/dashboard',
      is_read: false,
      created_at: new Date().toISOString(),
    });

    // Audit log
    db.logAuditEvent({
      id: `aud_${Date.now()}`,
      actor_id: user.id,
      actor_role: user.role,
      actor_name: user.name,
      action: 'ORDER_STATUS_UPDATED',
      target_type: 'ORDER',
      target_id: order.id,
      result: 'SUCCESS',
      details: `Transitioned status from ${order.status} -> ${newStatus}`,
      ip_address: ip,
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error("Status update error:", error);
    return NextResponse.json({ error: "Failed to update order status" }, { status: 500 });
  }
}
