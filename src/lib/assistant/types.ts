import { ChatLanguage, VoiceLanguageCode, ChatActionChip } from '@/types/chatbot';

export type AssistantIntent =
  | 'greeting'
  | 'service_information'
  | 'service_recommendation'
  | 'price_request'
  | 'quote_request'
  | 'quantity_request'
  | 'availability_request'
  | 'service_area_request'
  | 'process_question'
  | 'technical_question'
  | 'faq_question'
  | 'contact_request'
  | 'whatsapp_request'
  | 'call_request'
  | 'booking_request'
  | 'unclear_request';

export interface ExtractedEntities {
  service?: string; // slug e.g. 'ac-core-cutting'
  serviceName?: string;
  quantity?: number;
  diameter?: number;
  diameter_unit?: 'inch' | 'mm' | 'cm';
  wall_type?: string;
  wall_thickness?: number;
  material?: 'brick' | 'rcc' | 'aac' | 'concrete';
  location?: string;
  urgency?: 'today' | 'urgent' | 'standard';
  date?: string;
  time?: string;
  name?: string;
  phone?: string;
  whatsapp_preference?: boolean;
}

export interface PricingCalculationResult {
  isCalculated: boolean;
  isConfigured: boolean;
  unitPrice?: number;
  quantity?: number;
  subtotal?: number;
  discountAmount?: number;
  discountPercent?: number;
  finalEstimatedTotal?: number;
  currency?: string;
  pricingBasis?: string;
  isEstimate?: boolean;
  criteriaSummary?: string;
  missingFields?: string[];
  reason?: 'unconfigured' | 'missing_quantity' | 'missing_diameter' | 'custom_quote_needed' | 'success';
}

export interface ConversationContext {
  entities: ExtractedEntities;
  lastIntent?: AssistantIntent;
  lastServiceSlug?: string;
  language: ChatLanguage;
  pendingQuestionField?: 'service' | 'quantity' | 'diameter' | 'material' | 'location' | 'phone';
}

export interface AssistantResponsePayload {
  reply: string;
  intent: AssistantIntent;
  language: ChatLanguage;
  voice_language_code: VoiceLanguageCode;
  entities: ExtractedEntities;
  pricing?: PricingCalculationResult;
  actionChips: ChatActionChip[];
  source: 'gemini' | 'deterministic';
}
