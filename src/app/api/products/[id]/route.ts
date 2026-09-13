import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { calculateDistanceKm } from '@/lib/geo';
import { sanitizeProductPublic } from '@/lib/security';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId') || '';
  const lat = parseFloat(searchParams.get('lat') || '26.1285');
  const lng = parseFloat(searchParams.get('lng') || '91.7925');

  const product = db.getProductById(id);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const seller = db.getUserById(product.seller_id);
  const sellerProfile = db.getSellerProfile(product.seller_id);
  const isUnlocked = userId ? db.isContactUnlocked(userId, product.seller_id) : false;

  const distance_km = calculateDistanceKm(lat, lng, product.lat, product.lng);

  // OWASP ASVS Contact Privacy: Only populate seller_phone if contact is legitimately unlocked
  const sanitized = sanitizeProductPublic({
    ...product,
    seller_name: sellerProfile?.business_name || seller?.name || 'Local Seller',
    seller_rating: sellerProfile?.rating_aggregate || 4.8,
    seller_verified: seller?.is_verified ?? true,
    seller_phone: isUnlocked ? seller?.phone : undefined,
    distance_km,
  }, isUnlocked);

  const reviews = db.getReviews(product.id);

  return NextResponse.json({
    product: sanitized,
    seller_profile: sellerProfile,
    is_contact_unlocked: isUnlocked,
    reviews,
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = db.getUserById(userId);
  const product = db.getProductById(id);

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  // Check authorization (Must be listing owner or admin/mod)
  if (product.seller_id !== userId && user?.role !== 'admin' && user?.role !== 'moderator') {
    return NextResponse.json({ error: "Forbidden: You do not own this listing." }, { status: 403 });
  }

  db.deleteProduct(id);

  db.logAuditEvent({
    id: `aud_${Date.now()}`,
    actor_id: user?.id || 'unknown',
    actor_role: user?.role || 'buyer',
    actor_name: user?.name || 'User',
    action: 'DELETE_PRODUCT_LISTING',
    target_type: 'PRODUCT',
    target_id: id,
    result: 'SUCCESS',
    details: `Deleted product ID ${id}`,
    ip_address: req.headers.get('x-forwarded-for') || '127.0.0.1',
    created_at: new Date().toISOString(),
  });

  return NextResponse.json({ success: true, message: "Listing deleted" });
}
