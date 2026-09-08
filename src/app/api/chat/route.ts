import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';
import { ChatLanguage } from '@/types/chatbot';
import { checkRateLimit } from '@/lib/rateLimit';
import { AssistantPipeline } from '@/lib/assistant';

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

// Helper aliases for system prompt & fallback compatibility ('en', 'hi', 'gu')
const getSystemPrompt = (effectiveLang: ChatLanguage) => {
  return `Priya AI Technical Specialist - Language: ${effectiveLang} ('en', 'hi', 'gu')`;
};

const getFallbackResponse = (message: string, language: ChatLanguage) => {
  return AssistantPipeline.process({ message, language });
};

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';

    // Rate Limiting (40 chat messages per minute per IP)
    const rateLimit = checkRateLimit(`chat_msg_${ip}`, {
      windowMs: 60 * 1000,
      maxRequests: 40,
    });

    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Too many messages sent. Please wait a moment.', code: 'RATE_LIMIT_ERROR' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parseResult = requestSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const { message, language: requestedLanguage, history } = parseResult.data;
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    // Process through the Business-Aware Assistant Pipeline
    const assistantResult = await AssistantPipeline.process({
      message,
      language: requestedLanguage,
      history,
      apiKey,
    });

    return NextResponse.json({
      reply: assistantResult.reply,
      language: assistantResult.language,
      voice_language_code: assistantResult.voice_language_code,
      actionChips: assistantResult.actionChips,
      intent: assistantResult.intent,
      entities: assistantResult.entities,
      pricing: assistantResult.pricing,
    });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    const fallback = await getFallbackResponse('general', 'en');

    return NextResponse.json({
      reply: fallback.reply,
      language: fallback.language,
      voice_language_code: fallback.voice_language_code,
      actionChips: fallback.actionChips,
    });
  }
}
