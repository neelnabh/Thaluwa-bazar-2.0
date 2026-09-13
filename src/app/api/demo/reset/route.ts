import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST() {
  db.resetDemo();
  return NextResponse.json({ success: true, message: "Demo database reset to default seed successfully" });
}
