import { AssistantIntent, ExtractedEntities } from './types';
import { BusinessKnowledge } from './knowledge';

/**
 * Multi-lingual Intent Detector and Entity Extractor
 * Handles English, Hindi, Gujarati, Hinglish, and Gujlish naturally.
 */

// Number maps for word/script normalization
const NUMBER_WORD_MAP: Record<string, number> = {
  // English words
  one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  
  // Hindi transliterated
  ek: 1, do: 2, teen: 3, char: 4, chaar: 4, paanch: 5, panch: 5,
  chhe: 6, che: 6, saat: 7, aath: 8, ath: 8, nau: 9, no: 9, das: 10,
  dhai: 2.5, dedh: 1.5,
  
  // Hindi Devanagari words
  एक: 1, दो: 2, तीन: 3, चार: 4, पांच: 5, पाँच: 5,
  छह: 6, सात: 7, आठ: 8, नौ: 9, दस: 10,
  ढाई: 2.5, डेढ़: 1.5,
  
  // Gujarati words
  એક: 1, બે: 2, ત્રણ: 3, ચાર: 4, પાંચ: 5,
  છ: 6, સાત: 7, આઠ: 8, નવ: 9, દસ: 10,
  અઢી: 2.5, દોઢ: 1.5,
  
  // Devanagari numerals
  '१': 1, '२': 2, '३': 3, '४': 4, '५': 5,
  '६': 6, '७': 7, '८': 8, '९': 9, '१०': 10,
  
  // Gujarati numerals
  '૧': 1, '૨': 2, '૩': 3, '૪': 4, '૫': 5,
  '૬': 6, '૭': 7, '૮': 8, '૯': 9, '૧૦': 10,
};

export class IntentExtractor {
  /**
   * Extract intent and entities from a raw user message
   */
  public static extract(message: string): { intent: AssistantIntent; entities: ExtractedEntities } {
    const raw = message.trim();
    const lower = raw.toLowerCase();

    const entities: ExtractedEntities = this.extractEntities(raw);
    const intent: AssistantIntent = this.detectIntent(lower, entities);

    return { intent, entities };
  }

  /**
   * Detect intent based on linguistic patterns and extracted entities
   */
  private static detectIntent(lower: string, entities: ExtractedEntities): AssistantIntent {
    // 1. Greetings
    if (/^(hi|hello|hey|namaste|kem cho|kemcho|pranam|ram ram|halo|good (morning|afternoon|evening))\b/i.test(lower)) {
      if (lower.length < 25 && !entities.quantity && !entities.diameter) {
        return 'greeting';
      }
    }

    // 2. Direct Contact / Call / WhatsApp requests
    if (lower.includes('call') || lower.includes('phone') || lower.includes('number') || lower.includes('नंबर') || lower.includes('કોલ') || lower.includes('નંબર')) {
      return 'call_request';
    }
    if (lower.includes('whatsapp') || lower.includes('વોટ્સએપ') || lower.includes('व्हाट्सएप')) {
      return 'whatsapp_request';
    }

    // 3. Price Request (How much, rate, cost, kitna padega, etc.)
    const isPricePattern =
      lower.includes('price') ||
      lower.includes('cost') ||
      lower.includes('rate') ||
      lower.includes('charge') ||
      lower.includes('kitna') ||
      lower.includes('kitne') ||
      lower.includes('kitna hoga') ||
      lower.includes('kitne ka') ||
      lower.includes('kitna padega') ||
      lower.includes('કેટલા') ||
      lower.includes('કેટલું') ||
      lower.includes('કેટલું થશે') ||
      lower.includes('ભાવ') ||
      lower.includes('ચાર્જ') ||
      lower.includes('રૂપિયા') ||
      lower.includes('खर्च') ||
      lower.includes('पैसा') ||
      lower.includes('how much') ||
      lower.includes('what is the cost');

    if (isPricePattern) {
      return 'price_request';
    }

    // 4. Booking Request
    if (
      lower.includes('book') ||
      lower.includes('appointment') ||
      lower.includes('karwana hai') ||
      lower.includes('karvana che') ||
      lower.includes('kar do') ||
      lower.includes('આજે આવો') ||
      lower.includes('બુક') ||
      lower.includes('बुक') ||
      lower.includes('schedule')
    ) {
      if (entities.quantity || entities.service) {
        return 'booking_request';
      }
    }

    // 5. Service Area / Location queries
    if (
      lower.includes('work in') ||
      lower.includes('service in') ||
      lower.includes('available in') ||
      lower.includes('area') ||
      lower.includes('city') ||
      lower.includes('location') ||
      lower.includes('આવો છો') ||
      lower.includes('ક્યાં') ||
      lower.includes('कहाँ') ||
      lower.includes('सर्विस है')
    ) {
      return 'service_area_request';
    }

    // 6. Quote Request
    if (
      lower.includes('quote') ||
      lower.includes('quotation') ||
      lower.includes('estimate') ||
      lower.includes('ક્વોટેશન') ||
      lower.includes('कोटेशन')
    ) {
      return 'quote_request';
    }

    // 7. Technical / Safety / Capability questions
    if (
      lower.includes('rcc') ||
      lower.includes('beam') ||
      lower.includes('slab') ||
      lower.includes('crack') ||
      lower.includes('vibration') ||
      lower.includes('rebar') ||
      lower.includes('dust') ||
      lower.includes('water') ||
      lower.includes('damage') ||
      lower.includes('धूल') ||
      lower.includes('વાઇબ્રેશન') ||
      lower.includes('તિરાડ')
    ) {
      return 'technical_question';
    }

    // 8. Service recommendation (e.g. "I want to install AC and need hole")
    if (
      lower.includes('which service') ||
      lower.includes('kya service') ||
      lower.includes('kયું કરવું') ||
      (lower.includes('ac') && lower.includes('install') && !entities.quantity)
    ) {
      return 'service_recommendation';
    }

    // 9. If quantity or service specified, treat as service_information or quote request
    if (entities.quantity || entities.service) {
      return 'service_information';
    }

    return 'unclear_request';
  }

  /**
   * Extract structured entities (quantity, diameter, unit, service, material, etc.)
   */
  public static extractEntities(raw: string): ExtractedEntities {
    const entities: ExtractedEntities = {};
    const lower = raw.toLowerCase();

    // 1. Service Identification
    const matchedService = BusinessKnowledge.findMatchingService(raw);
    if (matchedService) {
      entities.service = matchedService.slug;
      entities.serviceName = matchedService.name;
    }

    // 2. Quantity Extraction (e.g. "5 holes", "5 hole", "5 હોલ", "पांच होल", "five holes", "5")
    const quantity = this.extractQuantity(raw);
    if (quantity !== undefined) {
      entities.quantity = quantity;
    }

    // 3. Diameter & Unit Extraction (e.g. "3 inch", "3\"", "3.0 inch", "3 ઇંચ", "3 इंच", "75mm", "2.5 inch")
    const diameter = this.extractDiameter(raw);
    if (diameter) {
      entities.diameter = diameter.value;
      entities.diameter_unit = diameter.unit;
    }

    // 4. Material / Wall Type Extraction
    if (lower.includes('rcc') || lower.includes('concrete') || lower.includes('rebar') || lower.includes('સળિયા') || lower.includes('सरिया')) {
      entities.material = 'rcc';
      entities.wall_type = 'RCC Concrete with Rebar';
    } else if (lower.includes('aac') || lower.includes('siporex') || lower.includes('block')) {
      entities.material = 'aac';
      entities.wall_type = 'AAC Block';
    } else if (lower.includes('brick') || lower.includes('ईंट') || lower.includes('ઈંટ')) {
      entities.material = 'brick';
      entities.wall_type = 'Red Clay Brick';
    }

    // 5. Location Extraction
    const location = this.extractLocation(raw);
    if (location) {
      entities.location = location;
    }

    // 6. Urgency / Timing Extraction
    if (lower.includes('today') || lower.includes('urgent') || lower.includes('emergency') || lower.includes('आज') || lower.includes('આજે') || lower.includes('jaldi')) {
      entities.urgency = 'urgent';
    }

    return entities;
  }

  /**
   * Extract Quantity from digits or regional words
   */
  private static extractQuantity(text: string): number | undefined {
    // Pattern A: Match digits before hole/holes/होલ/होल/holes
    // e.g. "5 holes", "5 hole", "5होલ", "5 હોલ", "5 होल"
    const digitHoleMatch = text.match(/(\d+)\s*(?:holes?|होલ|હૉલ|होल|હોલ|কাણ)/i);
    if (digitHoleMatch && digitHoleMatch[1]) {
      return parseInt(digitHoleMatch[1], 10);
    }

    // Pattern B: Match isolated number in short reply like "5" or "5 nos"
    if (/^\s*(\d+)\s*(?:nos|pcs)?\s*$/i.test(text)) {
      const match = text.match(/\d+/);
      if (match) return parseInt(match[0], 10);
    }

    // Pattern C: Word numbers before holes
    // e.g. "five holes", "paanch hole", "પાંચ હોલ", "पांच होल"
    for (const [word, val] of Object.entries(NUMBER_WORD_MAP)) {
      // Regex boundary or exact word match
      const escaped = word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`(?:^|\\s)(${escaped})\\s*(?:holes?|होલ|હૉલ|होल|હોલ)?(?:\\s|$)`, 'i');
      if (regex.test(text)) {
        // If it's attached to "inch", it's a diameter, not quantity
        const inchCheck = new RegExp(`(${escaped})\\s*(?:inch|in|"|ઇંચ|इंच)`, 'i');
        if (!inchCheck.test(text)) {
          return val;
        }
      }
    }

    // Pattern D: "X ke liye Y hole" or "X ke Y holes"
    const relMatch = text.match(/(?:ke liye|mate|માટે|के लिए)\s*(\d+)\s*(?:holes?|होલ|होल|હોલ)/i);
    if (relMatch && relMatch[1]) {
      return parseInt(relMatch[1], 10);
    }

    // Pattern E: "3 inch ke 5 hole"
    const multiMatch = text.match(/(?:\d+(?:\.\d+)?)\s*(?:inch|in|"|ઇંચ|इंच)[^\d]*(\d+)\s*(?:holes?|होલ|होल|હોલ)?/i);
    if (multiMatch && multiMatch[1]) {
      return parseInt(multiMatch[1], 10);
    }

    // Pattern F: Gujarati "3 ઇંચના 5 હોલ"
    const gujMultiMatch = text.match(/(?:\d+(?:\.\d+)?)\s*(?:ઇંચના|ઇંચ ના|ઇન્ચના)\s*(\d+)\s*(?:હોલ|કાણ)?/i);
    if (gujMultiMatch && gujMultiMatch[1]) {
      return parseInt(gujMultiMatch[1], 10);
    }

    return undefined;
  }

  /**
   * Extract Diameter and Unit
   */
  private static extractDiameter(text: string): { value: number; unit: 'inch' | 'mm' } | undefined {
    // Pattern A: "3 inch", "2.5 inch", "3.0\"", "3\"", "3.5 in", "3 ઇંચ", "3 इंच"
    const inchMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:inch(?:es)?|in|"|ઇંચ|ઇન્ચ|इंच)/i);
    if (inchMatch && inchMatch[1]) {
      return { value: parseFloat(inchMatch[1]), unit: 'inch' };
    }

    // Pattern B: MM notation: "75mm", "50 mm", "100 mm"
    const mmMatch = text.match(/(\d+)\s*(?:mm|મીમી|मिमी)/i);
    if (mmMatch && mmMatch[1]) {
      const mmVal = parseInt(mmMatch[1], 10);
      return { value: Math.round((mmVal / 25.4) * 10) / 10, unit: 'inch' };
    }

    // Pattern C: Regional words before inch
    // e.g. "teen inch", "ત્રણ ઇંચ", "तीन इंच", "dhai inch", "અઢી ઇંચ"
    for (const [word, val] of Object.entries(NUMBER_WORD_MAP)) {
      const escaped = word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`(?:^|\\s)(${escaped})\\s*(?:inch|in|"|ઇંચ|ઇન્ચ|इंच)`, 'i');
      if (regex.test(text)) {
        return { value: val, unit: 'inch' };
      }
    }

    return undefined;
  }

  /**
   * Extract Location from query
   */
  private static extractLocation(text: string): string | undefined {
    // Look for matching registered service area
    const areaLookup = BusinessKnowledge.findMatchingServiceArea(text);
    if (areaLookup.found && areaLookup.area) {
      return areaLookup.area.name;
    }

    // Regex for "in [Location]" or "at [Location]"
    const locMatch = text.match(/(?:in|at|near|mein|ma|માટે|में|માં)\s+([A-Za-z0-9\s]{3,20})(?:\s|$|\?|\.)/i);
    if (locMatch && locMatch[1]) {
      const candidate = locMatch[1].trim();
      // Filter out non-location words
      if (!['hole', 'holes', 'ac', 'rcc', 'drilling', 'cutting', 'wall', 'pipe'].includes(candidate.toLowerCase())) {
        return candidate;
      }
    }

    return undefined;
  }
}
