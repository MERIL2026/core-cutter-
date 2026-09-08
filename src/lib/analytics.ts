import { AllowlistedAnalyticsEvent } from '@/types';

export interface AnalyticsEventPayload {
  event_name: AllowlistedAnalyticsEvent;
  page_path?: string;
  service_id?: string;
  metadata?: Record<string, string | number | boolean | null | undefined>;
}

const ALLOWLISTED_EVENTS: Set<AllowlistedAnalyticsEvent> = new Set([
  'page_view',
  'phone_click',
  'whatsapp_click',
  'quote_start',
  'quote_submit',
  'map_click',
  'service_cta_click',
  'voice_start',
  'voice_transcription_success',
  'voice_transcription_error',
  'voice_response_started',
  'voice_response_completed',
  'voice_error',
]);

/**
 * Sanitizes metadata to strictly strip any unintended PII before dispatching.
 */
function sanitizeMetadata(
  meta?: Record<string, string | number | boolean | null | undefined>
): Record<string, string | number | boolean | null | undefined> {
  if (!meta) return {};
  const cleaned: Record<string, string | number | boolean | null | undefined> = {};

  const forbiddenKeys = ['name', 'phone', 'mobile', 'whatsapp', 'email', 'address', 'message', 'password', 'token'];

  for (const [key, value] of Object.entries(meta)) {
    if (!forbiddenKeys.includes(key.toLowerCase())) {
      cleaned[key] = value;
    }
  }

  return cleaned;
}

/**
 * Tracks a privacy-safe analytics event. Non-blocking and never throws.
 */
export function trackEvent(payload: AnalyticsEventPayload): void {
  try {
    if (typeof window === 'undefined') return;

    if (!ALLOWLISTED_EVENTS.has(payload.event_name)) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[Analytics] Ignored non-allowlisted event: ${payload.event_name}`);
      }
      return;
    }

    const sanitized = {
      event_name: payload.event_name,
      page_path: payload.page_path || window.location.pathname,
      service_id: payload.service_id || undefined,
      metadata: sanitizeMetadata(payload.metadata),
      occurred_at: new Date().toISOString(),
    };

    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics Event]', sanitized);
    }

    // Dispatch DOM CustomEvent for extensible listener integration
    window.dispatchEvent(
      new CustomEvent('ac_core_analytics', {
        detail: sanitized,
      })
    );
  } catch {
    // Fail silently to never disrupt customer workflow
  }
}
