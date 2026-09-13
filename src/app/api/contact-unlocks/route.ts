import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { checkRateLimit } from '@/lib/security';
import { ContactUnlock } from '@/types';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  if (!checkRateLimit(`contact_unlock_${ip}`, 15, 60000)) {
    return NextResponse.json({ error: "Contact unlock rate limit exceeded. Please try later." }, { status: 429 });
  }

  try {
    const { buyer_id, seller_id, product_id } = await req.json();

    if (!buyer_id || !seller_id) {
      return NextResponse.json({ error: "Buyer ID and Seller ID required" }, { status: 400 });
    }

    const buyer = db.getUserById(buyer_id);
    const seller = db.getUserById(seller_id);

    if (!buyer || !seller) {
      return NextResponse.json({ error: "Buyer or seller not found" }, { status: 404 });
    }

    const settings = db.getSettings();
    const fee = settings.contact_unlock_fee_enabled ? settings.contact_unlock_fee : 0;

    // Check if already unlocked
    const alreadyUnlocked = db.isContactUnlocked(buyer_id, seller_id);
    if (!alreadyUnlocked) {
      const unlockRecord: ContactUnlock = {
        id: `unl_${Date.now()}`,
        buyer_id,
        seller_id,
        product_id: product_id || '',
        fee_amount: fee,
        payment_status: fee > 0 ? 'paid' : 'free_tier',
        unlocked_at: new Date().toISOString(),
      };
      db.addContactUnlock(unlockRecord);

      // Audit Log for contact privacy trace
      db.logAuditEvent({
        id: `aud_${Date.now()}`,
        actor_id: buyer.id,
        actor_role: buyer.role,
        actor_name: buyer.name,
        action: 'CONTACT_UNLOCK_AUTHORIZED',
        target_type: 'SELLER_PHONE',
        target_id: seller.id,
        result: 'SUCCESS',
        details: `Buyer ${buyer.name} unlocked phone for Seller ${seller.name} (Fee: ₹${fee})`,
        ip_address: ip,
        created_at: new Date().toISOString(),
      });

      // Notify seller
      db.createNotification({
        id: `notif_${Date.now()}`,
        user_id: seller.id,
        title_en: 'Buyer Unlocked Your Contact',
        title_as: 'গ্ৰাহকে আপোনাৰ ফোন নম্বৰ আনলক কৰিছে',
        message_en: `${buyer.name} unlocked your direct contact for inquiries.`,
        message_as: `${buyer.name}-এ যোগাযোগৰ বাবে আপোনাৰ নম্বৰ আনলক কৰিছে।`,
        type: 'unlock',
        link: '/seller/dashboard',
        is_read: false,
        created_at: new Date().toISOString(),
      });
    }

    // Return the authorized phone number
    return NextResponse.json({
      success: true,
      seller_name: seller.name,
      seller_phone: seller.phone,
      message: "Contact unlocked successfully",
    });
  } catch (error) {
    console.error("Error unlocking contact:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
