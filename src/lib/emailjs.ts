/**
 * EmailJS Automatic Notification Dispatcher
 * 
 * Automatically dispatches structured email alerts to business owners / technicians
 * whenever a customer submits an inquiry or quote request on the website.
 * 
 * Uses EmailJS REST API (POST https://api.emailjs.com/api/v1.0/email/send).
 */

export interface EnquiryEmailData {
  id?: string;
  name: string;
  phone: string;
  whatsappPreference?: boolean;
  serviceId: string;
  location: string;
  message?: string;
  sourcePage?: string;
}

export interface SendEmailResult {
  success: boolean;
  skipped?: boolean;
  reason?: string;
  error?: string;
  status?: number;
}

const SERVICE_NAME_MAP: Record<string, string> = {
  'ac-core-cutting': 'AC Core Cutting',
  'rcc-core-cutting': 'RCC Core Cutting (Reinforced Concrete)',
  'ac-drain-hole': 'AC Drain Hole Drilling',
  'concrete-wall-drilling': 'Concrete Wall Drilling & Coring',
  'pipe-cable-passage': 'Pipe & Electrical Cable Passage',
  'slab-beam-coring': 'Slab & Beam Coring',
  'other': 'Other Diamond Coring Services',
};

/**
 * Format a phone number into a clean international WhatsApp URL
 */
function getWhatsAppLink(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `https://wa.me/91${digits}`;
  }
  return `https://wa.me/${digits}`;
}

/**
 * Clean phone number for tel: link
 */
function getPhoneLink(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

/**
 * Automatically send an email notification for a new quote inquiry via EmailJS
 */
export async function sendNewEnquiryEmail(
  enquiry: EnquiryEmailData
): Promise<SendEmailResult> {
  const serviceId =
    process.env.EMAILJS_SERVICE_ID || process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const templateId =
    process.env.EMAILJS_TEMPLATE_ID || process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
  const publicKey =
    process.env.EMAILJS_PUBLIC_KEY || process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;
  const toEmail = process.env.EMAILJS_TO_EMAIL;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // 1. Verify Configuration
  if (!serviceId || !templateId || !publicKey) {
    console.warn(
      '[EmailJS] Email notification skipped: EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, or EMAILJS_PUBLIC_KEY is not configured in environment variables.'
    );
    return {
      success: false,
      skipped: true,
      reason: 'Missing EmailJS configuration in environment variables',
    };
  }

  const humanServiceName =
    SERVICE_NAME_MAP[enquiry.serviceId] || enquiry.serviceId || 'General Core Cutting';
  const whatsappUrl = getWhatsAppLink(enquiry.phone);
  const phoneUrl = getPhoneLink(enquiry.phone);
  const nowIst = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  // 2. Prepare Template Parameters
  const templateParams: Record<string, string> = {
    customer_name: enquiry.name,
    customer_phone: enquiry.phone,
    whatsapp_preference: enquiry.whatsappPreference
      ? 'Yes (Customer prefers WhatsApp)'
      : 'No (Direct Phone Calls preferred)',
    service_name: humanServiceName,
    location: enquiry.location,
    message: enquiry.message && enquiry.message.trim().length > 0
      ? enquiry.message.trim()
      : 'No additional notes specified',
    source_page: enquiry.sourcePage || '/',
    enquiry_id: enquiry.id || 'N/A',
    submitted_at: nowIst,
    whatsapp_link: whatsappUrl,
    phone_link: phoneUrl,
    admin_url: `${siteUrl}/admin`,
    to_email: toEmail || '',
  };

  const payload: Record<string, unknown> = {
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey,
    template_params: templateParams,
  };

  // Include private accessToken if configured in strict mode
  if (privateKey) {
    payload.accessToken = privateKey;
  }

  // 3. Dispatch to EmailJS API with an 8-second timeout
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      console.log(`[EmailJS] Notification email sent successfully for enquiry ${enquiry.id || enquiry.name}`);
      return { success: true };
    }

    const errorText = await response.text().catch(() => 'Unknown error response');
    console.error(`[EmailJS] API Error (Status ${response.status}):`, errorText);
    return {
      success: false,
      status: response.status,
      error: `EmailJS responded with status ${response.status}: ${errorText}`,
    };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Network failure';
    console.error('[EmailJS] Failed to send email notification:', errMessage);
    return {
      success: false,
      error: errMessage,
    };
  }
}
