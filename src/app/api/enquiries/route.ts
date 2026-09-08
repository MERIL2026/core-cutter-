import { NextRequest, NextResponse } from 'next/server';
import { createEnquirySchema } from '@/lib/validations/enquiry';
import { checkRateLimit } from '@/lib/rateLimit';
import { query } from '@/lib/db';
import { saveEnquiry } from '@/lib/enquiryStore';

export const dynamic = 'force-dynamic';

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || '127.0.0.1';
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}

export async function POST(req: NextRequest) {
  try {
    // 1. Content-Type check
    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid request format. Content-Type must be application/json.',
        },
        { status: 400 }
      );
    }

    // 2. Abuse & Rate Limiting Check
    const clientIp = getClientIp(req);
    const rateLimit = checkRateLimit(clientIp, {
      maxRequests: 25,
      windowMs: 15 * 60 * 1000,
    });

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Too many quote requests from this network. Please wait a few minutes before trying again, or call us directly.',
        },
        {
          status: 429,
          headers: {
            'Retry-After': '900',
          },
        }
      );
    }

    // 3. Request Body Parsing
    let rawBody: unknown;
    try {
      rawBody = await req.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: 'Malformed JSON payload in request.',
        },
        { status: 400 }
      );
    }

    // 4. Schema & Domain Validation
    const validationResult = createEnquirySchema.safeParse(rawBody);
    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of validationResult.error.issues) {
        const field = issue.path[0] ? String(issue.path[0]) : 'form';
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }

      return NextResponse.json(
        {
          success: false,
          message: 'Please provide all required fields correctly.',
          errors: fieldErrors,
        },
        { status: 400 }
      );
    }

    const {
      name,
      phone,
      whatsappPreference,
      serviceId,
      location,
      message,
      sourcePage,
      honeypot,
    } = validationResult.data;

    // 5. Honeypot Spam Protection
    if (honeypot && honeypot.trim().length > 0) {
      // Reject bot submissions
      return NextResponse.json(
        {
          success: false,
          message: 'Spam submission detected.',
        },
        { status: 400 }
      );
    }

    // 6. Fast Resilient Storage (PostgreSQL with instant file fallback)
    const result = await saveEnquiry({
      name,
      phone,
      whatsappPreference,
      serviceId,
      location,
      message: message || undefined,
      sourcePage: sourcePage || undefined,
      status: 'new',
    });

    // 7. Truthful Success Response
    return NextResponse.json(
      {
        success: true,
        message: 'Your quote request has been received. Our team will contact you shortly.',
        id: result.id,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    // 8. Safe Error Logging
    const errMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Enquiry Submission Failure:', { error: errMessage });

    return NextResponse.json(
      {
        success: false,
        message: 'Unable to submit your quote request right now. Please call or WhatsApp our team directly.',
      },
      { status: 500 }
    );
  }
}

