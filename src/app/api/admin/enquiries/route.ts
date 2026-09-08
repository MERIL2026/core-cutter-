import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/adminAuth';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const search = url.searchParams.get('search');

    let sql = `
      SELECT 
        e.id,
        e.name,
        e.phone,
        e.whatsapp_preference,
        e.service_id,
        s.name as service_name,
        s.slug as service_slug,
        e.location,
        e.message,
        e.status,
        e.source_page,
        e.created_at,
        e.updated_at
      FROM enquiries e
      LEFT JOIN services s ON e.service_id = s.id
    `;

    const conditions: string[] = [];
    const params: unknown[] = [];

    if (status && status !== 'all') {
      params.push(status);
      conditions.push(`e.status = $${params.length}`);
    }

    if (search && search.trim() !== '') {
      params.push(`%${search.trim().toLowerCase()}%`);
      const idx = params.length;
      conditions.push(`(
        LOWER(e.name) LIKE $${idx} OR 
        LOWER(e.phone) LIKE $${idx} OR 
        LOWER(e.location) LIKE $${idx} OR 
        LOWER(COALESCE(e.message, '')) LIKE $${idx}
      )`);
    }

    if (conditions.length > 0) {
      sql += ` WHERE ` + conditions.join(' AND ');
    }

    sql += ` ORDER BY e.created_at DESC LIMIT 200;`;

    const result = await query(sql, params);

    // Calculate lead status metrics
    const statsResult = await query(`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'new') as new_count,
        COUNT(*) FILTER (WHERE status = 'contacted') as contacted_count,
        COUNT(*) FILTER (WHERE status = 'quoted') as quoted_count,
        COUNT(*) FILTER (WHERE status = 'closed') as closed_count,
        COUNT(*) FILTER (WHERE status = 'spam') as spam_count,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '24 hours') as today_count
      FROM enquiries;
    `);

    const stats = statsResult.rows[0] || {
      total: 0,
      new_count: 0,
      contacted_count: 0,
      quoted_count: 0,
      closed_count: 0,
      spam_count: 0,
      today_count: 0,
    };

    return NextResponse.json({
      success: true,
      enquiries: result.rows,
      stats: {
        total: parseInt(stats.total || '0', 10),
        new: parseInt(stats.new_count || '0', 10),
        contacted: parseInt(stats.contacted_count || '0', 10),
        quoted: parseInt(stats.quoted_count || '0', 10),
        closed: parseInt(stats.closed_count || '0', 10),
        spam: parseInt(stats.spam_count || '0', 10),
        today: parseInt(stats.today_count || '0', 10),
      },
    });
  } catch (error: any) {
    console.error('Admin Enquiries Fetch Error:', error);
    return NextResponse.json(
      {
        success: true,
        enquiries: [],
        stats: { total: 0, new: 0, contacted: 0, quoted: 0, closed: 0, spam: 0, today: 0 },
        warning: 'Database temporarily offline or empty.',
      },
      { status: 200 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, status } = body;

    const allowedStatuses = ['new', 'contacted', 'quoted', 'closed', 'spam'];
    if (!id || !status || !allowedStatuses.includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid parameters' }, { status: 400 });
    }

    await query(
      `UPDATE enquiries SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING id;`,
      [status, id]
    );

    return NextResponse.json({ success: true, message: 'Status updated' });
  } catch (error: any) {
    console.error('Admin Enquiry Update Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Enquiry ID is required' }, { status: 400 });
    }

    await query(`DELETE FROM enquiries WHERE id = $1;`, [id]);
    return NextResponse.json({ success: true, message: 'Enquiry deleted' });
  } catch (error: any) {
    console.error('Admin Enquiry Delete Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
