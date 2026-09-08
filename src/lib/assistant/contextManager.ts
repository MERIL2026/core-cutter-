import { ExtractedEntities, ConversationContext, AssistantIntent } from './types';
import { IntentExtractor } from './intentExtractor';
import { ChatLanguage } from '@/types/chatbot';

export interface ChatHistoryItem {
  role: 'user' | 'model';
  parts: { text: string }[];
}

/**
 * Multi-Turn Conversation Memory and Context Manager
 * Accumulates entities, handles corrections, and identifies missing requirements.
 */
export class ContextManager {
  /**
   * Build aggregated context from historical messages and current message
   */
  public static buildContext(
    currentMessage: string,
    history: ChatHistoryItem[] = [],
    language: ChatLanguage = 'en'
  ): ConversationContext {
    const aggregatedEntities: ExtractedEntities = {};
    let lastDetectedIntent: AssistantIntent | undefined;

    // 1. Process historical user messages sequentially to build memory
    for (const item of history) {
      if (item.role === 'user') {
        const text = item.parts.map((p) => p.text).join(' ');
        const { intent, entities } = IntentExtractor.extract(text);

        this.mergeEntities(aggregatedEntities, entities, text);
        lastDetectedIntent = intent;
      }
    }

    // 2. Process current user message
    const { intent: currentIntent, entities: currentEntities } = IntentExtractor.extract(currentMessage);
    this.mergeEntities(aggregatedEntities, currentEntities, currentMessage);

    // If current intent is unclear but we have a strong previous intent or current is follow-up
    let effectiveIntent = currentIntent;
    if (currentIntent === 'unclear_request' && lastDetectedIntent) {
      // If user provided an entity (like "3 inch" or "5") in response to a question
      if (currentEntities.quantity || currentEntities.diameter || currentEntities.material) {
        effectiveIntent = lastDetectedIntent === 'greeting' ? 'service_information' : lastDetectedIntent;
      }
    }

    // Determine the next single missing field for the anti-frustration rule
    const pendingField = this.determineMissingField(aggregatedEntities, effectiveIntent);

    return {
      entities: aggregatedEntities,
      lastIntent: effectiveIntent,
      lastServiceSlug: aggregatedEntities.service,
      language,
      pendingQuestionField: pendingField,
    };
  }

  /**
   * Merges newly extracted entities into accumulator, handling user corrections
   */
  private static mergeEntities(
    target: ExtractedEntities,
    incoming: ExtractedEntities,
    rawText: string
  ): void {
    const lower = rawText.toLowerCase();
    const isCorrection =
      lower.includes('no') ||
      lower.includes('sorry') ||
      lower.includes('not') ||
      lower.includes('nahi') ||
      lower.includes('નહીં') ||
      lower.includes('ના') ||
      lower.includes('instead');

    // Service update
    if (incoming.service) {
      target.service = incoming.service;
      target.serviceName = incoming.serviceName;
    }

    // Quantity update (with correction support)
    if (incoming.quantity !== undefined) {
      target.quantity = incoming.quantity;
    }

    // Diameter update
    if (incoming.diameter !== undefined) {
      target.diameter = incoming.diameter;
      target.diameter_unit = incoming.diameter_unit;
    }

    // Material update
    if (incoming.material) {
      target.material = incoming.material;
      target.wall_type = incoming.wall_type;
    }

    // Location update
    if (incoming.location) {
      target.location = incoming.location;
    }

    // Urgency update
    if (incoming.urgency) {
      target.urgency = incoming.urgency;
    }
  }

  /**
   * Determine the single most important missing field (Anti-Frustration Rule)
   */
  private static determineMissingField(
    entities: ExtractedEntities,
    intent: AssistantIntent
  ): 'service' | 'quantity' | 'diameter' | 'material' | 'location' | undefined {
    if (intent === 'price_request' || intent === 'quote_request' || intent === 'booking_request') {
      if (!entities.service) return 'service';
      if (!entities.quantity) return 'quantity';
      if (!entities.diameter) return 'diameter';
      if (!entities.location) return 'location';
    }
    return undefined;
  }
}
