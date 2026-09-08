import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/adminAuth';
import { getAllEnquiries } from '@/lib/enquiryStore';
import { defaultBusinessProfile } from '@/content/business';

export const dynamic = 'force-dynamic';

function escapeCsvCell(value: unknown): string {
  if (value === null || value === undefined) return '""';
  const str = String(value).replace(/"/g, '""').replace(/\r\n/g, ' ').replace(/[\r\n]/g, ' ');
  return `"${str}"`;
}

export async function GET(request: NextRequest) {
  if (!verifyAdminSession(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get('status') || 'all';
  const search = searchParams.get('search') || null;

  const { enquiries, stats } = await getAllEnquiries({
    status: statusFilter,
    search: search,
  });

  const generatedAt = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  const fileDate = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

  // Build a clean, executive-level CSV report
  const lines: string[] = [];

  // UTF-8 Byte Order Mark for flawless opening in all viewers
  const BOM = '\uFEFF';

  // Professional Header Metadata Block
  lines.push(`${escapeCsvCell(`${defaultBusinessProfile.business_name} - Official Lead & Quotation Report`)}`);
  lines.push(`${escapeCsvCell(`Generated on: ${generatedAt} (IST)`)}`);
  lines.push(`${escapeCsvCell(`Filter Applied: ${statusFilter.toUpperCase()} | Matching Records: ${enquiries.length}`)}`);
  lines.push(`${escapeCsvCell(`Summary: Total Leads: ${stats.total} | New: ${stats.new} | Contacted: ${stats.contacted} | Quoted: ${stats.quoted} | Closed: ${stats.closed}`)}`);
  lines.push(''); // Blank separator line

  // Column Headers
  const headers = [
    'Lead ID',
    'Date & Time (IST)',
    'Customer Name',
    'Phone Number',
    'WhatsApp Preferred',
    'WhatsApp Direct Link',
    'Service Requested',
    'Location / Area',
    'Lead Status',
    'Inquiry Source',
    'Customer Note / Message',
  ];
  lines.push(headers.map(escapeCsvCell).join(','));

  // Data Rows
  for (const e of enquiries) {
    const cleanDigits = (e.phone || '').replace(/\D/g, '');
    const cleanPhoneWithPlus = (e.phone || '').startsWith('+')
      ? e.phone
      : `+91${cleanDigits.slice(-10)}`;
    const waLink = cleanDigits ? `https://wa.me/${cleanDigits}` : 'N/A';

    const dateFormatted = new Date(e.created_at).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const row = [
      e.id,
      dateFormatted,
      e.name,
      `="${cleanPhoneWithPlus}"`, // Formatted as text formula so leading + / zeros are preserved
      e.whatsapp_preference ? 'YES' : 'NO',
      waLink,
      e.service_name || 'General Core Cutting',
      e.location,
      e.status.toUpperCase(),
      e.source === 'ai_assistant'
        ? 'Priya AI Voice/Chat'
        : e.source === 'admin_manual'
        ? 'Manual / Phone Entry'
        : 'Website Quote Form',
      e.message || 'No additional note provided',
    ];

    lines.push(row.map(escapeCsvCell).join(','));
  }

  const csvBody = BOM + lines.join('\r\n');

  return new NextResponse(csvBody, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="CoreCutting_Leads_Report_${fileDate}.csv"`,
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
