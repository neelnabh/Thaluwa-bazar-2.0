import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { calculateDistanceKm } from '@/lib/geo';
import { sanitizeProductPublic, sanitizeText, checkRateLimit } from '@/lib/security';
import { Product } from '@/types';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get('lat') || '26.1285');
  const lng = parseFloat(searchParams.get('lng') || '91.7925');
  const radius = parseFloat(searchParams.get('radius') || '10'); // km
  const categoryId = searchParams.get('category');
  const query = searchParams.get('q')?.toLowerCase() || '';
  const freshOnly = searchParams.get('fresh') === 'true';
  const userId = searchParams.get('userId') || '';

  let products = db.getProducts();

  // Filter active only
  products = products.filter(p => p.status === 'active');

  // Filter by category
  if (categoryId && categoryId !== 'all') {
    products = products.filter(p => p.category_id === categoryId);
  }

  // Filter by search query
  if (query) {
    products = products.filter(p => 
      p.title_en.toLowerCase().includes(query) ||
      p.title_as.toLowerCase().includes(query) ||
      p.description_en.toLowerCase().includes(query) ||
      p.description_as.toLowerCase().includes(query) ||
      (p.seller_name && p.seller_name.toLowerCase().includes(query))
    );
  }

  // Filter by fresh
  if (freshOnly) {
    products = products.filter(p => p.is_fresh);
  }

  // Calculate distance & filter by radius
  const results = products
    .map(p => {
      const distance_km = calculateDistanceKm(lat, lng, p.lat, p.lng);
      const isUnlocked = userId ? db.isContactUnlocked(userId, p.seller_id) : false;
      const sanitized = sanitizeProductPublic(p, isUnlocked);
      return {
        ...sanitized,
        distance_km,
      };
    })
    .filter(p => p.distance_km <= radius)
    .sort((a, b) => a.distance_km - b.distance_km);

  return NextResponse.json({
    count: results.length,
    radius_km: radius,
    products: results,
  });
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  if (!checkRateLimit(`product_create_${ip}`, 10, 60000)) {
    return NextResponse.json({ error: "Too many listing requests. Please wait." }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { 
      seller_id, 
      category_id, 
      title_en, 
      title_as, 
      description_en, 
      description_as, 
      price, 
      unit, 
      quantity_available, 
      location_name, 
      lat, 
      lng, 
      is_fresh, 
      images 
    } = body;

    if (!seller_id || !title_en || !price || !category_id) {
      return NextResponse.json({ error: "Missing required listing fields." }, { status: 400 });
    }

    const seller = db.getUserById(seller_id);
    if (!seller || (seller.role !== 'seller' && seller.role !== 'admin')) {
      return NextResponse.json({ error: "Unauthorized. Must be registered seller." }, { status: 403 });
    }

    const newProduct: Product = {
      id: `prod_${Date.now()}`,
      seller_id,
      category_id,
      title_en: sanitizeText(title_en),
      title_as: sanitizeText(title_as || title_en),
      description_en: sanitizeText(description_en || ""),
      description_as: sanitizeText(description_as || description_en || ""),
      price: Number(price),
      unit: sanitizeText(unit || 'kg'),
      quantity_available: Number(quantity_available) || 10,
      location_name: sanitizeText(location_name || seller.location_name),
      lat: Number(lat) || seller.lat,
      lng: Number(lng) || seller.lng,
      is_fresh: Boolean(is_fresh),
      harvest_time: is_fresh ? 'Freshly sourced today' : undefined,
      status: 'active',
      images: Array.isArray(images) && images.length > 0 
        ? images 
        : ['https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80'],
      created_at: new Date().toISOString(),
    };

    const saved = db.createProduct(newProduct);

    // Audit log
    db.logAuditEvent({
      id: `aud_${Date.now()}`,
      actor_id: seller.id,
      actor_role: seller.role,
      actor_name: seller.name,
      action: 'CREATE_PRODUCT_LISTING',
      target_type: 'PRODUCT',
      target_id: saved.id,
      result: 'SUCCESS',
      details: `Created listing "${saved.title_en}" for ₹${saved.price}/${saved.unit}`,
      ip_address: ip,
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({ product: saved }, { status: 201 });
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
