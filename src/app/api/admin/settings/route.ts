import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { user_id, settings } = await req.json();
    const user = user_id ? db.getUserById(user_id) : null;

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized: Super Admin required" }, { status: 403 });
    }

    const updated = db.updateSettings(settings);

    db.logAuditEvent({
      id: `aud_${Date.now()}`,
      actor_id: user.id,
      actor_role: user.role,
      actor_name: user.name,
      action: 'UPDATE_MARKETPLACE_SETTINGS',
      target_type: 'SETTINGS',
      target_id: 'GLOBAL',
      result: 'SUCCESS',
      details: `Updated settings: Radius=${updated.marketplace_radius_km}km, Seller Sub=₹${updated.seller_monthly_subscription_fee}`,
      ip_address: req.headers.get('x-forwarded-for') || '127.0.0.1',
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error("Failed to update settings:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
