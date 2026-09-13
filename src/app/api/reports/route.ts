import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sanitizeText, checkRateLimit } from '@/lib/security';
import { Report } from '@/types';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const user = userId ? db.getUserById(userId) : null;

  if (!user || (user.role !== 'admin' && user.role !== 'moderator')) {
    return NextResponse.json({ error: "Unauthorized access to moderation reports." }, { status: 403 });
  }

  const reports = db.getReports();
  return NextResponse.json({ reports });
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  if (!checkRateLimit(`report_${ip}`, 5, 60000)) {
    return NextResponse.json({ error: "Report rate limit exceeded." }, { status: 429 });
  }

  try {
    const { reporter_id, target_type, target_id, target_title, reason, details } = await req.json();

    const reporter = reporter_id ? db.getUserById(reporter_id) : null;

    const newReport: Report = {
      id: `rep_${Date.now()}`,
      reporter_id: reporter_id || 'anonymous',
      reporter_name: reporter?.name || 'Concerned User',
      target_type: target_type || 'product',
      target_id: target_id || 'unknown',
      target_title: sanitizeText(target_title || ''),
      reason: sanitizeText(reason || 'Suspicious listing or policy violation'),
      details: sanitizeText(details || ''),
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    const saved = db.createReport(newReport);

    db.logAuditEvent({
      id: `aud_${Date.now()}`,
      actor_id: reporter?.id || 'anonymous',
      actor_role: reporter?.role || 'buyer',
      actor_name: reporter?.name || 'Anonymous User',
      action: 'SUBMIT_REPORT',
      target_type: newReport.target_type.toUpperCase(),
      target_id: newReport.target_id,
      result: 'SUCCESS',
      details: `Report reason: ${newReport.reason}`,
      ip_address: ip,
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, report: saved }, { status: 201 });
  } catch (error) {
    console.error("Report submit error:", error);
    return NextResponse.json({ error: "Failed to submit report" }, { status: 500 });
  }
}
