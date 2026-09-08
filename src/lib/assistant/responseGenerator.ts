import { GoogleGenerativeAI } from '@google/generative-ai';
import { ChatLanguage, VoiceLanguageCode, ChatActionChip } from '@/types/chatbot';
import { inferMessageLanguage } from '@/lib/languageDetector';
import { ContextManager, ChatHistoryItem } from './contextManager';
import { PricingEngine } from './pricingEngine';
import { BusinessKnowledge } from './knowledge';
import { AssistantResponsePayload } from './types';

/**
 * Master Business-Aware Assistant Pipeline
 * 
 * Coordinates:
 * Intent Extraction -> Context Memory -> Deterministic Pricing -> Business Grounding -> Response Synthesis.
 */
export class AssistantPipeline {
  public static async process(params: {
    message: string;
    language?: ChatLanguage;
    history?: ChatHistoryItem[];
    apiKey?: string;
  }): Promise<AssistantResponsePayload> {
    const { message, language: requestedLang = 'en', history = [], apiKey } = params;

    // 1. Language & Voice Code Inference
    const { language: effectiveLang, voiceLanguageCode } = inferMessageLanguage(
      message,
      requestedLang
    );

    // 2. Build multi-turn context and accumulated entities
    const context = ContextManager.buildContext(message, history, effectiveLang);
    const serviceSlug = context.entities.service || 'ac-core-cutting';
    const currentService = BusinessKnowledge.getServiceBySlug(serviceSlug);
    const serviceName = currentService ? currentService.name : 'AC Core Cutting';

    // 3. Deterministic Pricing Calculation
    const pricing = PricingEngine.calculate(context.entities, serviceSlug);

    // 4. Check for matched Service Area or FAQ
    const serviceAreaMatch = BusinessKnowledge.findMatchingServiceArea(message);
    const faqMatch = BusinessKnowledge.findMatchingFaq(message);
    const profile = BusinessKnowledge.getProfile();

    // 5. Generate action chips
    const phone = profile.phone;
    const whatsapp = (profile.whatsapp || profile.phone).replace(/\D/g, '');
    const actionChips: ChatActionChip[] = [
      {
        label: effectiveLang === 'gu' ? '📞 કોલ કરો' : effectiveLang === 'hi' ? '📞 कॉल करें' : '📞 Call Now',
        type: 'call',
        value: phone,
      },
      {
        label: '💬 WhatsApp',
        type: 'whatsapp',
        value: whatsapp,
      },
      {
        label: effectiveLang === 'gu' ? '📝 ભાવ અંદાજ' : effectiveLang === 'hi' ? '📝 फ्री कोट' : '📝 Get Quote',
        type: 'link',
        value: '#quote-section',
      },
    ];

    // 6. Attempt LLM synthesis if Gemini API key exists
    if (apiKey && apiKey.trim() !== '') {
      try {
        const systemPrompt = this.buildGroundedSystemPrompt({
          effectiveLang,
          pricing,
          serviceName,
          context,
          serviceAreaMatch,
          faqMatch,
        });

        const genAI = new GoogleGenerativeAI(apiKey);
        const candidateModels = [
          'gemini-2.5-flash',
          'gemini-1.5-flash-latest',
          'gemini-1.5-flash',
          'gemini-2.0-flash',
          'gemini-pro',
        ];

        for (const modelName of candidateModels) {
          try {
            const model = genAI.getGenerativeModel({
              model: modelName,
              systemInstruction: systemPrompt,
            });

            const chat = model.startChat({
              history: history && history.length > 0 ? history : undefined,
              generationConfig: {
                maxOutputTokens: 300,
                temperature: 0.2, // Low temperature for factual precision
              },
            });

            const result = await chat.sendMessage(message);
            const responseText = result.response.text();

            if (responseText && responseText.trim().length > 0) {
              return {
                reply: responseText.trim(),
                intent: context.lastIntent || 'unclear_request',
                language: effectiveLang,
                voice_language_code: voiceLanguageCode,
                entities: context.entities,
                pricing,
                actionChips,
                source: 'gemini',
              };
            }
          } catch (mErr: any) {
            console.warn(`[Assistant] Model ${modelName} failed:`, mErr?.message);
          }
        }
      } catch (err: any) {
        console.warn('[Assistant] LLM Pipeline failed, using deterministic fallback:', err?.message);
      }
    }

    // 7. Deterministic Domain Response Fallback (Failsafe & Zero Hallucination)
    const fallbackReply = this.generateDeterministicReply({
      message,
      effectiveLang,
      context,
      pricing,
      serviceName,
      serviceAreaMatch,
      faqMatch,
    });

    return {
      reply: fallbackReply,
      intent: context.lastIntent || 'unclear_request',
      language: effectiveLang,
      voice_language_code: voiceLanguageCode,
      entities: context.entities,
      pricing,
      actionChips,
      source: 'deterministic',
    };
  }

  /**
   * Constructs strict, grounded system prompt containing verified business facts and calculated prices
   */
  private static buildGroundedSystemPrompt(data: {
    effectiveLang: ChatLanguage;
    pricing: any;
    serviceName: string;
    context: any;
    serviceAreaMatch: any;
    faqMatch: any;
  }): string {
    const { effectiveLang, pricing, serviceName, context, serviceAreaMatch, faqMatch } = data;
    const profile = BusinessKnowledge.getProfile();

    let pricingSection = '';
    if (pricing.isCalculated) {
      pricingSection = `
APPROVED PRICING DATA:
- Quantity: ${pricing.quantity}
- Unit Price: ₹${pricing.unitPrice}
- Estimated Total: ₹${pricing.finalEstimatedTotal}
- Currency: INR
- Note: This is an estimated price based on configured standard business rules.
RULE: State this exact calculated total (₹${pricing.finalEstimatedTotal}). NEVER fabricate a different number or arithmetic!`;
    } else if (pricing.reason === 'missing_quantity' && pricing.unitPrice) {
      pricingSection = `
APPROVED PRICING DATA:
- Unit Price: approx ₹${pricing.unitPrice} per hole.
RULE: State ₹${pricing.unitPrice} per hole and ask the user how many holes they need.`;
    } else if (!pricing.isConfigured || pricing.reason === 'unconfigured') {
      pricingSection = `
APPROVED PRICING DATA:
- Business pricing for this criteria is currently not configured in the system.
RULE: Inform the user clearly that you do not have an approved price configured yet and offer to collect their requirements for a quote. NEVER invent or guess a price!`;
    }

    const langDirective = {
      en: 'Reply in natural, professional Indian English. Keep answers concise (1-3 sentences) suitable for voice.',
      hi: 'ग्राहक को स्वाभाविक, सरल और सम्मानजनक हिंदी/हिंग्लिश में 1 से 3 छोटे वाक्यों में उत्तर दें।',
      gu: 'ગ્રાહકને સ્પષ્ટ, કુદરતી ગુજરાતીમાં 1 થી 3 ટૂંકા વાક્યોમાં ઉત્તર આપો.',
    }[effectiveLang];

    return `You are "Priya", the AI Technical Specialist for "${profile.business_name}", a diamond core cutting contractor.

CRITICAL ZERO-HALLUCINATION RULES:
1. NEVER invent prices, discounts, technician arrival promises, or unapproved certifications.
2. ${pricingSection}
3. If the user asks about service areas: Verified City is ${profile.city}. ${
      serviceAreaMatch.found
        ? 'Confirmed service is available in this area.'
        : 'If the location is outside or unconfirmed, ask for their exact address to check technician availability.'
    }
4. If technical information is unknown, say: "I don't want to give you an incorrect technical answer. I can help you send the requirement to our technical team for confirmation."
5. Follow the Anti-Frustration Rule: If information is missing, ask for only ONE missing detail at a time.
6. Language: ${langDirective}`;
  }

  /**
   * Pure Deterministic Multilingual Fallback Engine
   */
  private static generateDeterministicReply(data: {
    message: string;
    effectiveLang: ChatLanguage;
    context: any;
    pricing: any;
    serviceName: string;
    serviceAreaMatch: any;
    faqMatch: any;
  }): string {
    const { effectiveLang: lang, context, pricing, serviceName, serviceAreaMatch, faqMatch } = data;
    const profile = BusinessKnowledge.getProfile();
    const intent = context.lastIntent;

    // 1. Greeting
    if (intent === 'greeting') {
      if (lang === 'gu') {
        return `નમસ્તે! હું ${profile.business_name} માંથી પ્રિયા છું. અમે સ્પેશિયાલાઇઝ્ડ ડાયમંડ કોર કટિંગ (AC હોલ, RCC સ્લેબ ડ્રિલિંગ) કરીએ છીએ. હું તમને કેવી રીતે મદદ કરી શકું?`;
      }
      if (lang === 'hi') {
        return `नमस्ते! मैं ${profile.business_name} से प्रिया हूँ। हम विशेषज्ञ डायमंड कोर कटिंग (एसी होल, RCC स्लैब ड्रिलिंग) सेवाएं प्रदान करते हैं। मैं आपकी क्या मदद कर सकती हूँ?`;
      }
      return `Hello! I'm Priya from ${profile.business_name}. We provide professional rotary diamond core cutting (AC holes, RCC drilling). How can I assist you today?`;
    }

    // 2. Price or Quote Request with Calculated Price
    if (pricing.isCalculated) {
      return PricingEngine.formatPriceSummary(pricing, lang, serviceName);
    }

    // 3. Price Request with Missing Quantity
    if (intent === 'price_request' || intent === 'quote_request') {
      if (pricing.reason === 'missing_quantity') {
        return PricingEngine.formatPriceSummary(pricing, lang, serviceName);
      }
      if (!pricing.isConfigured || pricing.reason === 'unconfigured') {
        return PricingEngine.formatPriceSummary(pricing, lang, serviceName);
      }
    }

    // 4. Service Area Query
    if (intent === 'service_area_request') {
      if (serviceAreaMatch.found) {
        if (lang === 'gu') {
          return `હા, અમે ${profile.city} અને આજુબાજુના વિસ્તારોમાં ડાયમંડ કોર કટિંગ સર્વિસ આપીએ છીએ. તમે સેમ-ડે સર્વિસ માટે કોલ અથવા WhatsApp કરી શકો છો.`;
        }
        if (lang === 'hi') {
          return `जी हाँ, हम ${profile.city} और इसके सभी नजदीकी क्षेत्रों में डायमंड कोर कटिंग सेवाएं प्रदान करते हैं। आप बुकिंग के लिए हमें कॉल या व्हाट्सएप कर सकते हैं।`;
        }
        return `Yes, we provide diamond core cutting services across ${profile.city} and surrounding local areas. You can call or chat on WhatsApp to schedule.`;
      } else {
        if (lang === 'gu') {
          return `અમે મુખ્યત્વે ${profile.city} વિસ્તારમાં સેવા આપીએ છીએ. તમારા ચોક્કસ વિસ્તારમાં ઉપલબ્ધતા તપાસવા માટે તમારું લોકેશન શેર કરો.`;
        }
        if (lang === 'hi') {
          return `हम मुख्य रूप से ${profile.city} क्षेत्र में सेवा प्रदान करते हैं। आपके सटीक क्षेत्र में उपलब्धता की पुष्टि के लिए कृपया अपनी लोकेशन शेयर करें।`;
        }
        return `We primarily serve ${profile.city}. Please share your exact location and I can help check whether technician dispatch is available there.`;
      }
    }

    // 5. FAQ / Technical / Safety match
    if (faqMatch) {
      if (faqMatch.id === 'faq-rcc-cutting-capable') {
        if (lang === 'gu') {
          return `હા, અમારી ડાયમંડ મશીન હેવી RCC સ્લેબ અને બીમમાં સ્ટીલના સળિયા (rebar) સાથે સરળતાથી ઝીરો વાઇબ્રેશનથી કટિંગ કરે છે.`;
        }
        if (lang === 'hi') {
          return `जी हाँ, हमारी रोटरी डायमंड मशीन RCC बीम और स्लैब में स्टील सरिये (rebar) के साथ बिना किसी वाइब्रेशन के आसानी से कटिंग करती है।`;
        }
        return `Yes, our diamond core rigs cut smoothly through reinforced concrete (RCC) and heavy embedded steel rebar without transferring shock waves or cracks.`;
      }

      if (faqMatch.id === 'faq-wall-damage-vibration') {
        if (lang === 'gu') {
          return `ના, ડાયમંડ કોર કટિંગમાં હેમરિંગ ન હોવાથી દીવાલ કે પ્લાસ્ટરમાં બિલકુલ તિરાડ પડતી નથી અને ધૂળ પણ ઊડતી નથી.`;
        }
        if (lang === 'hi') {
          return `नहीं, डायमंड कोर कटिंग में हैमरिंग नहीं होती, इसलिए दीवार या प्लास्टर में कोई क्रैक नहीं आता और धूल भी नहीं उड़ती।`;
        }
        return `No, diamond core drilling operates with smooth rotary diamond friction (zero hammer vibration), ensuring no wall cracks and clean dust-free operation.`;
      }

      if (faqMatch.id === 'faq-hole-sizes-available') {
        if (lang === 'gu') {
          return `અમે સ્પ્લિટ AC માટે 2.5 થી 3 ઇંચ અને ચિમની/ડ્રેઇન માટે 2 થી 5+ ઇંચ સુધીના તમામ હોલ સાઇઝ કરીએ છીએ.`;
        }
        if (lang === 'hi') {
          return `हम स्प्लिट एसी के लिए 2.5 से 3 इंच और ड्रेन/चिमनी के लिए 2 से 5+ इंच तक के सभी साइज़ में डायमंड कोर कटिंग करते हैं।`;
        }
        return `We drill standard 2.5 to 3 inch holes for Split ACs, and 2 to 5+ inch holes for drainage, chimneys, and plumbing passages.`;
      }
    }

    // 6. Unknown technical question safe fallback
    if (intent === 'technical_question') {
      if (lang === 'gu') {
        return `હું તમને અચોક્કસ ટેકનિકલ માહિતી આપવા નથી માંગતી. હું તમારી જરૂરિયાત અમારી એન્જિનિયરિંગ ટીમને મોકલવામાં મદદ કરી શકું છું.`;
      }
      if (lang === 'hi') {
        return `मैं आपको कोई गलत तकनीकी जानकारी नहीं देना चाहती। मैं आपकी आवश्यकता हमारी तकनीकी टीम को भेजने में मदद कर सकती हूँ।`;
      }
      return `I don't want to give you an incorrect technical answer. I can help you send the requirement to our technical team for confirmation.`;
    }

    // 7. General Contextual Helper
    if (lang === 'gu') {
      return `નમસ્તે! અમે ${profile.city} માં સ્પેશિયાલાઇઝ્ડ ડાયમંડ કોર કટિંગ (AC હોલ, RCC સ્લેબ ડ્રિલિંગ) સર્વિસ આપીએ છીએ. તમને કેટલા હોલ અને કઈ સાઇઝના કરાવવા છે?`;
    }
    if (lang === 'hi') {
      return `नमस्ते! हम ${profile.city} में डायमंड कोर कटिंग सेवाएं प्रदान करते हैं। आपको कितने होल और किस साइज़ में करवाने हैं?`;
    }
    return `Hello! We provide professional rotary diamond core cutting across ${profile.city}. How many holes and what diameter do you require?`;
  }
}
