import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/adminAuth';
import { getAllEnquiries, updateEnquiryStatus, deleteEnquiry } from '@/lib/enquiryStore';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const search = url.searchParams.get('search');

    const result = await getAllEnquiries({ status, search });

    return NextResponse.json({
      success: true,
      enquiries: result.enquiries,
      stats: result.stats,
    });
  } catch (error: any) {
    console.error('Admin Enquiries Fetch Error:', error);
    return NextResponse.json(
      {
        success: true,
        enquiries: [],
        stats: { total: 0, new: 0, contacted: 0, quoted: 0, closed: 0, spam: 0, today: 0 },
        warning: 'Enquiries store temporarily unavailable.',
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

    const success = await updateEnquiryStatus(id, status);
    if (!success) {
      return NextResponse.json({ success: false, error: 'Enquiry not found or could not be updated' }, { status: 404 });
    }

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

    const success = await deleteEnquiry(id);
    return NextResponse.json({ success, message: success ? 'Enquiry deleted' : 'Enquiry not found' });
  } catch (error: any) {
    console.error('Admin Enquiry Delete Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

