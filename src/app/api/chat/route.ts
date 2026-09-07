import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';
import { defaultBusinessProfile } from '@/content/business';
import { ChatLanguage, ChatActionChip } from '@/types/chatbot';

const requestSchema = z.object({
  message: z.string().min(1, 'Message is required').max(1000, 'Message too long'),
  language: z.enum(['en', 'gu', 'hi']).default('en'),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'model']),
        parts: z.array(z.object({ text: z.string() })),
      })
    )
    .optional(),
});

// Comprehensive system prompt for Gemini Pro
const getSystemPrompt = (language: ChatLanguage) => {
  const langInstructions = {
    en: 'Respond in direct, helpful, professional English. Never just say a generic greeting. Always address the specific question with accurate technical core cutting information (hole diameters, RCC drilling, pricing factors, zero-vibration safety, clean execution). Keep responses clear and formatted (2-4 concise sentences or brief bullet points).',
    gu: 'તમે ગુજરાતી લિપિ (ગુજરાતી અક્ષરો) માં જ જવાબ આપો. સામાન્ય સ્વાગતને બદલે ગ્રાહકના ચોક્કસ પ્રશ્નનો વિગતવાર અને વ્યવહારુ જવાબ આપો (જેમ કે હોલ સાઇઝ 2.5″-3″, RCC સ્લેબ ડ્રિલિંગ, 0% વાઇબ્રેશન, ચાર્જની વિગત, ઝડપી બુકિંગ). વાક્યો નમ્ર અને સ્પષ્ટ રાખો.',
    hi: 'आप हमेशा देवनागरी हिंदी लिपि में सटीक उत्तर दें। केवल औपचारिक अभिवादन के बजाय ग्राहक के प्रश्न का सीधा और व्यावहारिक उत्तर दें (जैसे स्प्लिट एसी 2.5″-3″ होल, RCC बीम में बिना क्रैक ड्रिलिंग, खर्च का आकलन, तुरंत बुकिंग)। भाषा विनम्र, सरल और स्पष्ट रखें।',
  }[language];

  return `You are "Conoz Core AI", the senior technical assistant for "${defaultBusinessProfile.business_name}", a specialized contractor for diamond core cutting, RCC concrete drilling, and AC wall openings.

Business Profile:
- Company: ${defaultBusinessProfile.business_name}
- Phone: ${defaultBusinessProfile.phone}
- WhatsApp: ${defaultBusinessProfile.whatsapp || defaultBusinessProfile.phone}
- Service Coverage: ${defaultBusinessProfile.city} and all surrounding local areas
- Availability: Mon-Sat 8:00 AM - 8:00 PM (Same-day emergency technician dispatch available within 2 hours)

Technical Core Cutting Knowledge Base:
1. AC Hole Specifications:
   - 1 Ton to 2 Ton Split AC: 2.5 inches (65mm) or 3 inches (75mm) hole for copper lines + insulation + electrical wire + drain.
   - Standalone AC Drain Hole: 2 inches (50mm) drilled with downward gravity slope (5°-10°) to eliminate indoor water leakage.
   - Commercial VRV/VRF/Multi-split & Chimney: 4 inches (100mm) to 5 inches (125mm).
2. Vibration-Free Structural Safety:
   - High-precision rotary diamond barrel coring.
   - 0% vibration impact: NO hammer shockwaves, NO plaster cracking, NO damage to structural integrity.
   - Cuts effortlessly through brick masonry, AAC lightweight blocks, stone, tiles, and heavy-duty RCC (M20-M40+ concrete) with high-tensile steel rebar.
3. Cleanliness & Worksite Care:
   - Water lubrication for dust suppression and cool diamond cutting.
   - Slurry containment protection for furnished homes and occupied apartments.
4. Pricing & Booking:
   - Transparent pricing calculated by hole diameter (2" to 5"+), wall thickness (4", 9", 12"+), material (brick vs RCC), and job quantity.
   - Fast upfront quote by phone or WhatsApp.

Rules for Responses:
- Never answer with just a greeting. Always provide specific, actionable answers to what the user asked.
- Provide clear hole size recommendations, material advice, and safety guarantees.
- Include encouragement to call or WhatsApp for instant technician booking.
- ${langInstructions}`;
};

// Advanced Domain Intelligence & Intent Parser
function getFallbackResponse(
  rawMessage: string,
  language: ChatLanguage
): { reply: string; actionChips: ChatActionChip[] } {
  const msg = rawMessage.toLowerCase().trim();
  const phone = defaultBusinessProfile.phone;
  const whatsapp = (defaultBusinessProfile.whatsapp || defaultBusinessProfile.phone).replace(/\D/g, '');

  const defaultChips: ChatActionChip[] = [
    {
      label: language === 'gu' ? '📞 કોલ કરો' : language === 'hi' ? '📞 कॉल करें' : '📞 Call Now',
      type: 'call',
      value: phone,
    },
    {
      label: '💬 WhatsApp',
      type: 'whatsapp',
      value: whatsapp,
    },
    {
      label: language === 'gu' ? '📝 ભાવ અંદાજ' : language === 'hi' ? '📝 फ्री कोट' : '📝 Get Quote',
      type: 'link',
      value: '#quote-section',
    },
  ];

  // 1. Hole Size & Diameter Questions
  if (
    msg.includes('size') ||
    msg.includes('diameter') ||
    msg.includes('inch') ||
    msg.includes('ઇંચ') ||
    msg.includes('ઇન્ચ') ||
    msg.includes('કાણ') ||
    msg.includes('होल') ||
    msg.includes('इंच') ||
    msg.includes('साइज़') ||
    msg.includes('size required') ||
    msg.includes('how big') ||
    msg.includes('kitna')
  ) {
    if (language === 'gu') {
      return {
        reply: `સ્પ્લિટ AC કોપર પાઇપ અને ડ્રેઇન માટે સામાન્ય રીતે 2.5″ અથવા 3″ (65mm થી 75mm) નું ડાયમંડ કોર કટિંગ કરવામાં આવે છે.\n\n• 1 થી 2 ટન Split AC: 2.5″ થી 3″ હોલ\n• ફક્ત AC ડ્રેઇન પાઇપ: 2″ હોલ (પાણી નિકાલ માટે યોગ્ય ઢાળ સાથે)\n• ચિમની / VRV સિસ્ટમ: 4″ થી 5″ હોલ\n\nઅમારી રોટરી ડાયમંડ મશીનથી દીવાલ કે પ્લાસ્ટરમાં બિલકુલ ક્રેક પડતી નથી.`,
        actionChips: defaultChips,
      };
    }
    if (language === 'hi') {
      return {
        reply: `स्प्लिट एसी इंस्टॉलेशन के लिए आमतौर पर 2.5″ या 3″ (65mm - 75mm) डायमंड कोर कटिंग की आवश्यकता होती है:\n\n• 1 से 2 टन स्प्लिट एसी: 2.5″ से 3″ होल (कॉपर पाइप + इन्सुलेशन + ड्रेन)\n• केवल एसी ड्रेन पाइप: 2″ होल (पानी के सही निकास हेतु डाउनवर्ड स्लोप सहित)\n• किचन चिमनी / कमर्शियल VRV: 4″ से 5″ होल\n\nरोटरी डायमंड तकनीक से दीवार में बिना किसी वाइब्रेशन या क्रैक के एकदम गोल कटिंग होती है।`,
        actionChips: defaultChips,
      };
    }
    return {
      reply: `For split AC installations, the standard requirement is a 2.5″ to 3″ (65mm to 75mm) circular diamond core hole:\n\n• Standard 1 to 2 Ton Split AC: 2.5″ - 3″ hole (accommodates copper pipes, insulation, wire & drain)\n• Standalone AC Drain: 2″ hole with downward gravity slope to prevent indoor water leaking\n• Chimney / VRV / MEP sleeves: 4″ - 5″ hole\n\nOur rotary diamond drilling guarantees perfectly circular edges with 0% wall vibration damage.`,
      actionChips: defaultChips,
    };
  }

  // 2. Pricing, Cost, Rate & Estimation Questions
  if (
    msg.includes('price') ||
    msg.includes('cost') ||
    msg.includes('rate') ||
    msg.includes('charge') ||
    msg.includes('quote') ||
    msg.includes('ભાવ') ||
    msg.includes('ચાર્જ') ||
    msg.includes('રૂપિયા') ||
    msg.includes('કેટલા') ||
    msg.includes('रेट') ||
    msg.includes('खर्च') ||
    msg.includes('पैसा') ||
    msg.includes('कितना') ||
    msg.includes('budget')
  ) {
    if (language === 'gu') {
      return {
        reply: `કોર કટિંગનો ચાર્જ નીચેની બાબતો પર આધાર રાખે છે:\n\n1. હોલની સાઇઝ (2″, 2.5″, 3″, 4″ કે 5″)\n2. દીવાલનો પ્રકાર (ઈંટ, AAC બ્લોક કે હેવી RCC સ્લેબ/બીમ)\n3. દીવાલની જાડાઈ (4″, 9″ કે 12″+)\n\nચોક્કસ અને વ્યાજબી ભાવ માટે તમારા લોકેશન અને હોલની સંખ્યા સાથે અમને કૉલ અથવા WhatsApp કરો, અમે તરત જ બેસ્ટ એસ્ટીમેટ આપીશું.`,
        actionChips: defaultChips,
      };
    }
    if (language === 'hi') {
      return {
        reply: `कोर कटिंग का रेट मुख्य रूप से 3 बातों पर निर्भर करता है:\n\n1. होल का व्यास (2″, 2.5″, 3″, 4″ या 5″)\n2. दीवार का प्रकार (सामान्य ईंट, AAC ब्लॉक या सरिया युक्त RCC कंक्रीट)\n3. दीवार की मोटाई (4″, 9″ या 12″+)\n\nसटीक और किफायती रेट के लिए हमें अपनी आवश्यकता के साथ कॉल या व्हाट्सएप करें, हम तुरंत कोटेशन प्रदान करेंगे।`,
        actionChips: defaultChips,
      };
    }
    return {
      reply: `Our diamond core cutting pricing is transparent and depends on:\n\n1. Hole Diameter (2″, 2.5″, 3″, 4″, or 5″+)\n2. Wall Material (Standard Brick, AAC Block, or Heavy RCC Concrete with Steel Rebar)\n3. Wall Thickness (4″, 9″, 12″+) & Number of Holes\n\nContact us directly via Phone or WhatsApp with your location and hole requirements for an instant upfront quote.`,
      actionChips: defaultChips,
    };
  }

  // 3. RCC / Beam / Slab / Rebar & Vibration Safety
  if (
    msg.includes('rcc') ||
    msg.includes('beam') ||
    msg.includes('slab') ||
    msg.includes('concrete') ||
    msg.includes('rebar') ||
    msg.includes('steel') ||
    msg.includes('crack') ||
    msg.includes('vibration') ||
    msg.includes('damage') ||
    msg.includes('safety') ||
    msg.includes('તિરાડ') ||
    msg.includes('વાઇબ્રેશન') ||
    msg.includes('બીમ') ||
    msg.includes('સ્લેબ') ||
    msg.includes('સળિયા') ||
    msg.includes('क्रैक') ||
    msg.includes('वाइब्रेशन') ||
    msg.includes('सरिया') ||
    msg.includes('सुरक्षा')
  ) {
    if (language === 'gu') {
      return {
        reply: `હા, અમે હેવી RCC સ્લેબ, કોલમ અને બીમમાં સ્ટીલના સળિયા (rebar) સાથે સરળતાથી કટિંગ કરીએ છીએ.\n\n• 0% વાઇબ્રેશન: પરંપરાગત હથોડા-છીણી જેવી કોઈ ધ્રુજારી થતી નથી.\n• ઝીરો ક્રેક ગેરંટી: પ્લાસ્ટર કે આસપાસની દીવાલમાં તિરાડ પડતી નથી.\n• ડાયમંડ સેગમેન્ટ કટર: લોખંડના સળિયાને પણ અંદરથી ક્લીન કટ કરી લે છે.`,
        actionChips: defaultChips,
      };
    }
    if (language === 'hi') {
      return {
        reply: `जी हां, हमारी रोटरी डायमंड मशीन RCC बीम, कॉलम और फ्लोर स्लैब में स्टील सरिये (rebar) सहित बहुत आसानी से कटिंग करती है:\n\n• 0% वाइब्रेशन: हथौड़े या छेनी की तरह दीवार पर कोई झटका नहीं लगता।\n• 100% सुरक्षा: प्लास्टर या कंक्रीट में कोई क्रैक या डैमेज नहीं होता।\n• स्मूथ फिनिशिंग: स्टील रिबार अंदर से ही सटीक गोल कट जाता है।`,
        actionChips: defaultChips,
      };
    }
    return {
      reply: `Yes, we specialize in heavy-duty RCC beam, slab, and column core cutting:\n\n• 0% Vibration Impact: Unlike hammer chipping, rotary diamond coring produces zero shockwaves.\n• 100% Structural Safety: Prevents plaster chipping, wall cracks, and structural weakening.\n• Steel Rebar Penetration: Premium diamond segments slice smoothly through internal high-tensile steel rebar.`,
      actionChips: defaultChips,
    };
  }

  // 4. AC Drain Leakage / Slope & Water Drainage
  if (
    msg.includes('drain') ||
    msg.includes('water') ||
    msg.includes('leak') ||
    msg.includes('slope') ||
    msg.includes('ડ્રેઇન') ||
    msg.includes('પાણી') ||
    msg.includes('લીકેજ') ||
    msg.includes('ઢાળ') ||
    msg.includes('ड्रेन') ||
    msg.includes('पानी') ||
    msg.includes('लीकेज') ||
    msg.includes('ढाल')
  ) {
    if (language === 'gu') {
      return {
        reply: `AC માંથી અંદર પાણી ટપકવાનું મુખ્ય કારણ હોલમાં યોગ્ય ઢાળ (downward slope) ન હોવો તે છે.\n\nઅમે AC ડ્રેઇન પાઇપ માટે ખાસ 5° થી 10° નો બહારની તરફ ઢાળ આપીને 2″ અથવા 2.5″ હોલ ડ્રિલ કરીએ છીએ, જેથી પાણી અટકે નહીં અને સીધું બહાર નીકળી જાય.`,
        actionChips: defaultChips,
      };
    }
    if (language === 'hi') {
      return {
        reply: `कमरे के अंदर एसी से पानी टपकने का मुख्य कारण दीवार के होल में सही स्लोप (ढाल) न होना है।\n\nहम एसी ड्रेन पाइप के लिए 5° से 10° की डाउनवर्ड स्लोप के साथ 2″ या 2.5″ का सटीक होल ड्रिल करते हैं, जिससे पानी बिना किसी रुकावट के सीधे बाहर निकल जाता है।`,
        actionChips: defaultChips,
      };
    }
    return {
      reply: `Indoor AC water leakage occurs when the wall hole lacks a proper downward gravity slope.\n\nWe drill dedicated 2″ to 2.5″ AC drain passages with a precise 5°-10° downward exterior slope, ensuring uninterrupted drainage and eliminating water backup inside your room.`,
      actionChips: defaultChips,
    };
  }

  // 5. Booking, Technician Dispatch & Timing
  if (
    msg.includes('book') ||
    msg.includes('call') ||
    msg.includes('time') ||
    msg.includes('today') ||
    msg.includes('urgent') ||
    msg.includes('emergency') ||
    msg.includes('appointment') ||
    msg.includes('બુક') ||
    msg.includes('આજે') ||
    msg.includes('અત્યારે') ||
    msg.includes('સમય') ||
    msg.includes('બુકિંગ') ||
    msg.includes('बुक') ||
    msg.includes('आज') ||
    msg.includes('अभी') ||
    msg.includes('समय') ||
    msg.includes('बुकिंग')
  ) {
    if (language === 'gu') {
      return {
        reply: `તમે તાત્કાલિક અથવા તમારી અનુકૂળતા મુજબ ટેકનિશિયન બુક કરી શકો છો:\n\n• સેમ-ડે અર્જન્ટ ડિસ્પેચ: 2 કલાકમાં ટેકનિશિયન તમારા સ્થળે પહોંચી શકે છે.\n• કામનો સમય: સોમવાર થી શનિવાર, સવારે 8:00 થી રાત્રે 8:00.\n\nતાત્કાલિક બુકિંગ માટે નીચેના બટન પર ક્લિક કરીને કૉલ અથવા WhatsApp કરો.`,
        actionChips: defaultChips,
      };
    }
    if (language === 'hi') {
      return {
        reply: `आप अपनी सुविधानुसार या इमरजेंसी में तुरंत तकनीशियन बुक कर सकते हैं:\n\n• सेम-डे फ़ास्ट डिस्पैच: 2 घंटे के भीतर तकनीशियन आपके लोकेशन पर पहुँच सकते हैं।\n• समय: सोमवार से शनिवार, सुबह 8:00 से रात 8:00 तक।\n\nतत्काल स्लॉट बुक करने के लिए नीचे दिए गए बटन से कॉल या व्हाट्सएप करें।`,
        actionChips: defaultChips,
      };
    }
    return {
      reply: `You can schedule an appointment or request immediate same-day technician dispatch:\n\n• Fast Response: Technicians available on-site within 2 hours across ${defaultBusinessProfile.city}.\n• Working Hours: Mon – Sat, 8:00 AM – 8:00 PM.\n\nClick the buttons below to call our technician directly or chat on WhatsApp to confirm your slot.`,
      actionChips: defaultChips,
    };
  }

  // 6. Dust, Cleanliness & Water Slurry Control
  if (
    msg.includes('dust') ||
    msg.includes('clean') ||
    msg.includes('mess') ||
    msg.includes('धूल') ||
    msg.includes('सफाई') ||
    msg.includes('કચરો') ||
    msg.includes('ધૂળ')
  ) {
    if (language === 'gu') {
      return {
        reply: `ડાયમંડ કોર કટિંગમાં પાણીના કૂલિંગ સિસ્ટમનો ઉપયોગ થતો હોવાથી હવામાં સૂકી સિમેન્ટની ધૂળ ઊડતી નથી. ફર્નિચરવાળા મકાનો માટે અમે વોટર કલેક્શન પ્રોટેક્શન વાપરીએ છીએ જેથી દીવાલ અને ફ્લોરિંગ સુરક્ષિત રહે.`,
        actionChips: defaultChips,
      };
    }
    if (language === 'hi') {
      return {
        reply: `डायमंड कोर कटिंग में वेट-कटिंग तकनीक इस्तेमाल होती है, जिससे कमरे में धूल या डस्ट बिल्कुल नहीं उड़ती। सुसज्जित घरों के लिए हम स्लरी प्रोटेक्शन का उपयोग करते हैं जिससे दीवार और फर्श साफ रहते हैं।`,
        actionChips: defaultChips,
      };
    }
    return {
      reply: `Our diamond drilling uses controlled water suppression, which prevents airborne concrete silica dust from circulating in your home. We use containment rings to protect painted walls and finished floors.`,
      actionChips: defaultChips,
    };
  }

  // 7. Location & Service Areas
  if (
    msg.includes('location') ||
    msg.includes('city') ||
    msg.includes('area') ||
    msg.includes('where') ||
    msg.includes('near me') ||
    msg.includes('વિસ્તાર') ||
    msg.includes('ક્યાં') ||
    msg.includes('एरिया') ||
    msg.includes('कहाँ') ||
    msg.includes('कहा')
  ) {
    if (language === 'gu') {
      return {
        reply: `અમે ${defaultBusinessProfile.city} અને તેની આસપાસના તમામ રહેણાંક એપાર્ટમેન્ટ્સ, કોમર્શિયલ બિલ્ડિંગ્સ અને ઇન્ડસ્ટ્રીયલ સાઇટ્સ પર સ્થળ પર જઈને કોર કટિંગ સર્વિસ આપીએ છીએ. તમારા એરિયામાં ઉપલબ્ધતા જાણવા અમને WhatsApp પર લોકેશન મોકલો.`,
        actionChips: defaultChips,
      };
    }
    if (language === 'hi') {
      return {
        reply: `हम ${defaultBusinessProfile.city} और इसके आसपास के सभी रिहायशी, कमर्शियल और इंडस्ट्रियल क्षेत्रों में ऑन-साइट कोर ड्रिलिंग सेवा देते हैं। अपनी लोकेशन पर तुरंत सर्विस के लिए हमें व्हाट्सएप पर संपर्क करें।`,
        actionChips: defaultChips,
      };
    }
    return {
      reply: `We provide complete on-site diamond core drilling coverage across ${defaultBusinessProfile.city} and surrounding areas for residential, commercial, and renovation projects. Send us your location on WhatsApp to confirm technician arrival time.`,
      actionChips: defaultChips,
    };
  }

  // 8. General / Contextual Help
  if (language === 'gu') {
    return {
      reply: `નમસ્તે! અમે ${defaultBusinessProfile.city} માં સ્પેશિયાલાઇઝ્ડ ડાયમંડ કોર કટિંગ સર્વિસ આપીએ છીએ:\n\n• સ્પ્લિટ AC અને ડ્રેઇન માટે 2″ થી 5″ ક્લીન હોલ\n• RCC બીમ અને સ્લેબમાં 0% વાઇબ્રેશન કટિંગ\n• પ્લમ્બિંગ અને ઇલેક્ટ્રિકલ પાઇપ પેસેજ\n\nતમને કઈ સર્વિસ માટે વિગત જોઈએ છે? તમે બોલીને અથવા ટાઇપ કરીને પૂછી શકો છો.`,
      actionChips: defaultChips,
    };
  }

  if (language === 'hi') {
    return {
      reply: `नमस्ते! हम ${defaultBusinessProfile.city} में विशेषज्ञ डायमंड कोर कटिंग और ड्रिलिंग सेवाएं प्रदान करते हैं:\n\n• स्प्लिट एसी और ड्रेन पाइप के लिए 2″ से 5″ होल\n• RCC बीम व स्लैब में बिना क्रैक स्मूथ कटिंग\n• प्लंबिंग व इलेक्ट्रिकल पाइप पैसेज\n\nआपको किस काम के लिए जानकारी चाहिए? आप बोलकर या टाइप करके पूछ सकते हैं।`,
      actionChips: defaultChips,
    };
  }

  return {
    reply: `Hello! We provide professional rotary diamond core cutting services across ${defaultBusinessProfile.city}:\n\n• Split AC & Drain Pipe Openings (2″ to 5″)\n• RCC Beam & Slab Core Drilling with 0% Vibration Damage\n• Plumbing & Electrical Conduit Passages\n\nHow can we help with your core cutting requirements today?`,
    actionChips: defaultChips,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = requestSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const { message, language, history } = parseResult.data;
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    // If Gemini API Key is configured, attempt generation with fallback to domain engine
    if (apiKey && apiKey.trim() !== '') {
      const candidateModels = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash', 'gemini-pro'];
      const genAI = new GoogleGenerativeAI(apiKey);

      for (const modelName of candidateModels) {
        try {
          const model = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction: getSystemPrompt(language),
          });

          const chat = model.startChat({
            history: history && history.length > 0 ? history : undefined,
            generationConfig: {
              maxOutputTokens: 600,
              temperature: 0.3,
            },
          });

          const result = await chat.sendMessage(message);
          const responseText = result.response.text();

          if (responseText && responseText.trim().length > 0) {
            const phone = defaultBusinessProfile.phone;
            const whatsapp = (defaultBusinessProfile.whatsapp || defaultBusinessProfile.phone).replace(/\D/g, '');

            const actionChips: ChatActionChip[] = [
              {
                label: language === 'gu' ? '📞 કોલ કરો' : language === 'hi' ? '📞 कॉल करें' : '📞 Call Now',
                type: 'call',
                value: phone,
              },
              {
                label: '💬 WhatsApp',
                type: 'whatsapp',
                value: whatsapp,
              },
              {
                label: language === 'gu' ? '📝 ભાવ અંદાજ' : language === 'hi' ? '📝 फ्री कोट' : '📝 Get Quote',
                type: 'link',
                value: '#quote-section',
              },
            ];

            return NextResponse.json({
              reply: responseText,
              language,
              actionChips,
            });
          }
        } catch (modelError: any) {
          console.warn(`Attempt with ${modelName} failed, trying next:`, modelError?.message);
        }
      }
    }

    // Advanced domain intelligence fallback
    const fallback = getFallbackResponse(message, language);
    return NextResponse.json({
      reply: fallback.reply,
      language,
      actionChips: fallback.actionChips,
    });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    const fallback = getFallbackResponse('general', 'en');
    return NextResponse.json({
      reply: fallback.reply,
      language: 'en',
      actionChips: fallback.actionChips,
    });
  }
}
