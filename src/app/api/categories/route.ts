import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const categories = db.getCategories();
  const products = db.getProducts().filter(p => p.status === 'active');
  
  const enriched = categories.map(cat => ({
    ...cat,
    item_count: products.filter(p => p.category_id === cat.id).length,
  }));

  return NextResponse.json({ categories: enriched });
}
