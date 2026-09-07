import { NextRequest, NextResponse } from 'next/server';
import { createEnquirySchema } from '@/lib/validations/enquiry';
import { checkRateLimit } from '@/lib/rateLimit';
import { query } from '@/lib/db';

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
      maxRequests: 5,
      windowMs: 15 * 60 * 1000, // 5 requests per 15 mins
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

    // 6. Attempt Database Storage with File-Based Fallback
    let savedToDb = false;

    try {
      // Resolve Service UUID from Database (if available)
      let serviceUuid: string | null = null;
      try {
        const serviceLookup = await query<{ id: string }>(
          'SELECT id FROM services WHERE slug = $1 LIMIT 1',
          [serviceId]
        );
        if (serviceLookup.rows && serviceLookup.rows.length > 0 && serviceLookup.rows[0]) {
          serviceUuid = serviceLookup.rows[0].id;
        }
      } catch {
        // If services table is not populated, foreign key remains null
        serviceUuid = null;
      }

      // Parameterized Database Insertion (Status is strictly forced to 'new')
      const insertQuery = `
        INSERT INTO enquiries (
          name,
          phone,
          whatsapp_preference,
          service_id,
          location,
          message,
          status,
          source_page
        )
        VALUES ($1, $2, $3, $4, $5, $6, 'new', $7)
        RETURNING id, created_at;
      `;

      const insertParams = [
        name,
        phone,
        whatsappPreference,
        serviceUuid,
        location,
        message ? message.trim() : null,
        sourcePage ? sourcePage.trim() : null,
      ];

      await query(insertQuery, insertParams);
      savedToDb = true;
    } catch (dbError: unknown) {
      // Database is unavailable — save to local file fallback so no data is lost
      const dbErrMsg = dbError instanceof Error ? dbError.message : 'Unknown DB error';
      console.warn('Database unavailable, saving enquiry to file fallback:', dbErrMsg);

      try {
        const fs = await import('fs');
        const path = await import('path');
        const fallbackDir = path.join(process.cwd(), 'db');
        const fallbackPath = path.join(fallbackDir, 'enquiries_fallback.json');

        // Ensure db directory exists
        if (!fs.existsSync(fallbackDir)) {
          fs.mkdirSync(fallbackDir, { recursive: true });
        }

        const fallbackEntry = {
          name,
          phone,
          whatsappPreference,
          serviceId,
          location,
          message: message ? message.trim() : null,
          sourcePage: sourcePage ? sourcePage.trim() : null,
          created_at: new Date().toISOString(),
          status: 'new',
          source: 'file_fallback',
        };

        let existingData: unknown[] = [];
        if (fs.existsSync(fallbackPath)) {
          try {
            const raw = fs.readFileSync(fallbackPath, 'utf-8');
            existingData = JSON.parse(raw);
          } catch {
            existingData = [];
          }
        }

        existingData.push(fallbackEntry);
        fs.writeFileSync(fallbackPath, JSON.stringify(existingData, null, 2), 'utf-8');
        console.log('Enquiry saved to file fallback:', fallbackPath);
      } catch (fileError: unknown) {
        const fileErrMsg = fileError instanceof Error ? fileError.message : 'File write error';
        console.error('File fallback also failed:', fileErrMsg);

        return NextResponse.json(
          {
            success: false,
            message: 'Unable to submit your quote request right now. Please call or WhatsApp our team directly.',
          },
          { status: 500 }
        );
      }
    }

    // 7. Truthful Success Response
    return NextResponse.json(
      {
        success: true,
        message: savedToDb
          ? 'Your quote request has been received. Our team will contact you shortly.'
          : 'Your quote request has been saved. Our team will contact you shortly.',
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    // 8. Safe Error Logging (No credentials, no stack traces leaked to client)
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
