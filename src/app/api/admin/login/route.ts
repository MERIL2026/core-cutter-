import { NextRequest, NextResponse } from 'next/server';
import { validateAdminPassword, generateAdminToken, ADMIN_COOKIE_NAME } from '@/lib/adminAuth';
import { checkRateLimit } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';

    // Rate Limiting Protection (10 login attempts per minute per IP)
    const rateLimit = checkRateLimit(`admin_login_${ip}`, {
      windowMs: 60 * 1000,
      maxRequests: 10,
    });

    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: 'Too many login attempts. Please wait 1 minute.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { password } = body;

    if (!password || !validateAdminPassword(password)) {
      return NextResponse.json(
        { success: false, error: 'Incorrect admin password.' },
        { status: 401 }
      );
    }

    const token = generateAdminToken();
    const response = NextResponse.json({
      success: true,
      message: 'Admin authentication successful.',
    });

    // Set secure HttpOnly cookie for 7 days
    response.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    console.error('Admin Login Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
