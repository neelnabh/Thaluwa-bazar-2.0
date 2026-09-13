import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const user = userId ? db.getUserById(userId) : null;

  if (!user || (user.role !== 'admin' && user.role !== 'moderator')) {
    return NextResponse.json({ error: "Forbidden: Admin or Moderator role required" }, { status: 403 });
  }

  const users = db.getUsers();
  const products = db.getProducts();
  const orders = db.getOrders();
  const reports = db.getReports();
  const auditLogs = db.getAuditLogs();
  const settings = db.getSettings();

  const totalRevenueGMV = orders
    .filter(o => o.status === 'COMPLETED')
    .reduce((sum, o) => sum + o.total_price, 0);

  return NextResponse.json({
    metrics: {
      total_users: users.length,
      total_sellers: users.filter(u => u.role === 'seller').length,
      total_listings: products.length,
      total_orders: orders.length,
      completed_orders: orders.filter(o => o.status === 'COMPLETED').length,
      pending_reports: reports.filter(r => r.status === 'pending').length,
      total_gmv_inr: totalRevenueGMV,
    },
    users: users.map(({ password_hash, ...u }) => u),
    reports,
    auditLogs: auditLogs.slice(0, 50),
    settings,
  });
}
