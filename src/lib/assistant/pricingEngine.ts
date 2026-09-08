import { canonicalPricingConfig, ServicePricingConfig } from '@/content/pricing';
import { ExtractedEntities, PricingCalculationResult } from './types';
import { ChatLanguage } from '@/types/chatbot';

/**
 * Deterministic Pricing Engine
 * 
 * Performs exact arithmetic calculations in code.
 * Strict Anti-Hallucination: Returns isCalculated=false if configuration is missing.
 */
export class PricingEngine {
  /**
   * Calculate deterministic pricing estimate based on canonical rules
   */
  public static calculate(
    entities: ExtractedEntities,
    serviceSlug: string = 'ac-core-cutting'
  ): PricingCalculationResult {
    const config: ServicePricingConfig | undefined =
      canonicalPricingConfig.services[serviceSlug] ||
      canonicalPricingConfig.services['ac-core-cutting'];

    if (!canonicalPricingConfig.isGloballyConfigured || !config || !config.isConfigured) {
      return {
        isCalculated: false,
        isConfigured: false,
        reason: 'unconfigured',
        missingFields: ['service_pricing_configuration'],
      };
    }

    if (config.pricingMode === 'custom_quote') {
      return {
        isCalculated: false,
        isConfigured: true,
        reason: 'custom_quote_needed',
      };
    }

    // Determine diameter tier (default to standard 2.5"-3.0" AC diameter if not specified or ~3")
    const diameter = entities.diameter ?? 3.0;
    const tier =
      config.diameterTiers.find((t) => diameter >= t.minInch && diameter <= t.maxInch) ||
      config.diameterTiers[1] ||
      config.diameterTiers[0];

    if (!tier) {
      return {
        isCalculated: false,
        isConfigured: false,
        reason: 'unconfigured',
      };
    }

    // Material factor
    const materialKey = (entities.material || entities.wall_type || 'brick').toLowerCase();
    let matFactor = 1.0;
    if (materialKey.includes('rcc') || materialKey.includes('concrete')) {
      matFactor = config.materialFactors.find((m) => m.id === 'rcc')?.multiplier ?? 1.4;
    } else if (materialKey.includes('aac') || materialKey.includes('siporex')) {
      matFactor = config.materialFactors.find((m) => m.id === 'aac')?.multiplier ?? 0.85;
    } else {
      matFactor = config.materialFactors.find((m) => m.id === 'brick')?.multiplier ?? 1.0;
    }

    // Thickness factor
    const thickness = entities.wall_thickness ?? 9;
    let thickFactor = 1.0;
    if (thickness > 10) {
      thickFactor = config.thicknessFactors.find((t) => t.id === 'thick')?.multiplier ?? 1.45;
    } else if (thickness <= 5) {
      thickFactor = config.thicknessFactors.find((t) => t.id === 'thin')?.multiplier ?? 0.9;
    } else {
      thickFactor = config.thicknessFactors.find((t) => t.id === 'standard')?.multiplier ?? 1.0;
    }

    const calculatedUnitPrice = Math.round(tier.baseRatePerHole * matFactor * thickFactor);

    // Quantity check
    const quantity = entities.quantity;
    if (!quantity || quantity <= 0) {
      return {
        isCalculated: false,
        isConfigured: true,
        unitPrice: calculatedUnitPrice,
        currency: config.currency,
        pricingBasis: 'per hole',
        missingFields: ['quantity'],
        reason: 'missing_quantity',
        criteriaSummary: `${tier.name} (${tier.description})`,
      };
    }

    // Calculate volume discounts
    let discountPercent = 0;
    for (const vTier of config.volumeDiscounts) {
      if (quantity >= vTier.minQuantity) {
        discountPercent = Math.max(discountPercent, vTier.discountPercentage);
      }
    }

    const discountedUnitPrice = Math.round(calculatedUnitPrice * (1 - discountPercent / 100));
    let rawTotal = discountedUnitPrice * quantity;

    // Apply minimum charge if specified
    if (config.minimumBillingCharge && rawTotal < config.minimumBillingCharge) {
      rawTotal = config.minimumBillingCharge;
    }

    const discountAmount = (calculatedUnitPrice * quantity) - (discountedUnitPrice * quantity);

    return {
      isCalculated: true,
      isConfigured: true,
      unitPrice: discountedUnitPrice,
      quantity,
      subtotal: rawTotal,
      discountAmount: discountAmount > 0 ? discountAmount : undefined,
      discountPercent: discountPercent > 0 ? discountPercent : undefined,
      finalEstimatedTotal: rawTotal,
      currency: config.currency,
      pricingBasis: 'per hole',
      isEstimate: true,
      criteriaSummary: `${quantity} × ${tier.name}`,
      reason: 'success',
    };
  }

  /**
   * Format the calculated price into an approved, natural multilingual message snippet.
   */
  public static formatPriceSummary(
    result: PricingCalculationResult,
    lang: ChatLanguage,
    serviceName: string = 'AC Core Cutting'
  ): string {
    if (!result.isCalculated || !result.finalEstimatedTotal) {
      if (!result.isConfigured || result.reason === 'unconfigured') {
        if (lang === 'gu') {
          return `આ સેવા માટે હાલમાં કન્ફિગર્ડ ભાવ ઉપલબ્ધ નથી. હું તમારા માટે ફ્રી ક્વોટેશન તૈયાર કરી આપું છું.`;
        }
        if (lang === 'hi') {
          return `इस सेवा के लिए वर्तमान में निर्धारित रेट लिस्ट उपलब्ध नहीं है। मैं आपकी आवश्यकताओं के अनुसार कोटेशन तैयार करने में मदद कर सकती हूँ।`;
        }
        return `I can calculate the total once the business pricing for this service is configured. I can collect your requirements and prepare the quote request.`;
      }

      if (result.reason === 'missing_quantity' && result.unitPrice) {
        if (lang === 'gu') {
          return `અંદાજિત ભાવ આશરે ₹${result.unitPrice} પ્રતિ હોલ છે. તમને કેટલા હોલ કરાવવા છે?`;
        }
        if (lang === 'hi') {
          return `अनुमानित रेट लगभग ₹${result.unitPrice} प्रति होल है। आपको कुल कितने होल कराने हैं?`;
        }
        return `The estimated rate is approx ₹${result.unitPrice} per hole. How many holes do you need?`;
      }

      return '';
    }

    const { quantity, unitPrice, finalEstimatedTotal, discountPercent } = result;

    if (lang === 'gu') {
      const discountText = discountPercent ? ` (${discountPercent}% ડિસ્કાઉન્ટ સાથે)` : '';
      return `ચોક્કસ 👍\n\n${quantity} ${serviceName} હોલ માટે:${discountText}\n• ${quantity} × ₹${unitPrice} = ₹${finalEstimatedTotal}\n\nઅંદાજિત કુલ રકમ: ₹${finalEstimatedTotal}\n\n(આ કન્ફિગર્ડ સ્ટાન્ડર્ડ રેટ પર આધારિત અંદાજ છે. શું હું આનું ફાઇનલ ક્વોટેશન મોકલવામાં મદદ કરું?)`;
    }

    if (lang === 'hi') {
      const discountText = discountPercent ? ` (${discountPercent}% डिस्काउंट के साथ)` : '';
      return `ज़रूर 👍\n\n${quantity} ${serviceName} होल के लिए:${discountText}\n• ${quantity} × ₹${unitPrice} = ₹${finalEstimatedTotal}\n\nअनुमानित कुल राशि: ₹${finalEstimatedTotal}\n\n(यह निर्धारित स्टैंडर्ड रेट पर आधारित अनुमान है। क्या मैं आपकी फाइनल कोटेशन तैयार करने में मदद करूँ?)`;
    }

    const discountText = discountPercent ? ` (${discountPercent}% volume discount applied)` : '';
    return `Sure 👍\n\nFor ${quantity} ${serviceName} hole(s):${discountText}\n• ${quantity} × ₹${unitPrice} = ₹${finalEstimatedTotal}\n\nEstimated total: ₹${finalEstimatedTotal}\n\n(This is based on configured standard business pricing. Would you like me to help request the final quote?)`;
  }
}
