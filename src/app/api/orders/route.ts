import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sanitizeText, checkRateLimit } from '@/lib/security';
import { Order } from '@/types';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const role = searchParams.get('role');

  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 401 });
  }

  const allOrders = db.getOrders();
  let orders: Order[] = [];

  if (role === 'seller') {
    orders = allOrders.filter(o => o.seller_id === userId);
  } else if (role === 'admin' || role === 'moderator') {
    orders = allOrders;
  } else {
    // Buyer
    orders = allOrders.filter(o => o.buyer_id === userId);
  }

  return NextResponse.json({ orders });
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  if (!checkRateLimit(`order_create_${ip}`, 20, 60000)) {
    return NextResponse.json({ error: "Too many order requests. Please wait." }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { buyer_id, product_id, quantity, delivery_type, notes } = body;

    if (!buyer_id || !product_id || !quantity || quantity <= 0) {
      return NextResponse.json({ error: "Invalid order parameters" }, { status: 400 });
    }

    const buyer = db.getUserById(buyer_id);
    const product = db.getProductById(product_id);

    if (!buyer || !product) {
      return NextResponse.json({ error: "Buyer or product not found" }, { status: 404 });
    }

    const seller = db.getUserById(product.seller_id);
    if (!seller) {
      return NextResponse.json({ error: "Seller not found" }, { status: 404 });
    }

    // Pricing is calculated strictly SERVER-SIDE
    const unitPrice = product.price;
    const qty = Math.min(Number(quantity), product.quantity_available);
    const totalPrice = unitPrice * qty;

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      buyer_id,
      seller_id: product.seller_id,
      product_id,
      unit_price: unitPrice,
      quantity: qty,
      total_price: totalPrice,
      unit: product.unit,
      status: 'REQUESTED',
      delivery_type: delivery_type === 'seller_delivery' ? 'seller_delivery' : 'pickup',
      notes: sanitizeText(notes || ''),
      pickup_location: product.location_name,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const saved = db.createOrder(newOrder);

    // Notify seller
    db.createNotification({
      id: `notif_${Date.now()}`,
      user_id: seller.id,
      title_en: 'New Hyperlocal Order Received',
      title_as: 'নতুন স্থানীয় অৰ্ডাৰ অনুৰোধ',
      message_en: `${buyer.name} ordered ${qty} ${product.unit} of ${product.title_en} (₹${totalPrice}).`,
      message_as: `${buyer.name}-এ ${product.title_as}-ৰ ${qty} ${product.unit} (₹${totalPrice}) অৰ্ডাৰ কৰিছে।`,
      type: 'order',
      link: '/seller/dashboard',
      is_read: false,
      created_at: new Date().toISOString(),
    });

    // Audit log
    db.logAuditEvent({
      id: `aud_${Date.now()}`,
      actor_id: buyer.id,
      actor_role: buyer.role,
      actor_name: buyer.name,
      action: 'CREATE_ORDER',
      target_type: 'ORDER',
      target_id: saved.id,
      result: 'SUCCESS',
      details: `Created order for ₹${totalPrice} (${qty} x ${product.title_en})`,
      ip_address: ip,
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, order: saved }, { status: 201 });
  } catch (error) {
    console.error("Failed to create order:", error);
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
  }
}
