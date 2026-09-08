import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rateLimit';
import { normalizeTextForSpeech, detectScriptLanguage } from '@/lib/languageDetector';
import { ChatLanguage, VoiceLanguageCode } from '@/types/chatbot';

const MAX_TTS_TEXT_LENGTH = 1000;
const DEFAULT_SPEAKER = process.env.SARVAM_TTS_SPEAKER || 'priya';
const DEFAULT_MODEL = process.env.SARVAM_TTS_MODEL || 'bulbul:v3';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';

    // 1. Rate Limiting Protection (30 TTS calls per minute per IP)
    const rateLimit = checkRateLimit(`voice_tts_${ip}`, {
      windowMs: 60 * 1000,
      maxRequests: 30,
    });

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded for voice synthesis. Please wait a moment.',
          code: 'RATE_LIMIT_ERROR',
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { text, language, language_code, speaker } = body;

    if (!text || typeof text !== 'string' || text.trim() === '') {
      return NextResponse.json(
        { error: 'Text parameter is required for voice generation', code: 'INVALID_REQUEST' },
        { status: 400 }
      );
    }

    if (text.length > MAX_TTS_TEXT_LENGTH) {
      return NextResponse.json(
        {
          error: `Text exceeds maximum length of ${MAX_TTS_TEXT_LENGTH} characters`,
          code: 'INVALID_REQUEST',
        },
        { status: 400 }
      );
    }

    // 2. Language & Script Detection
    const detectedLang: ChatLanguage = detectScriptLanguage(text, (language as ChatLanguage) || 'en');
    const cleanText = normalizeTextForSpeech(text, detectedLang);

    if (!cleanText) {
      return NextResponse.json(
        { error: 'Text became empty after phonetic normalization', code: 'INVALID_REQUEST' },
        { status: 400 }
      );
    }

    let targetLangCode: VoiceLanguageCode = 'en-IN';
    if (language_code === 'gu-IN' || detectedLang === 'gu') {
      targetLangCode = 'gu-IN';
    } else if (language_code === 'hi-IN' || detectedLang === 'hi') {
      targetLangCode = 'hi-IN';
    } else {
      targetLangCode = 'en-IN';
    }

    const apiKey = process.env.SARVAM_API_KEY;

    // 3. Primary: Sarvam AI Bulbul v3 Multilingual Text-to-Speech
    if (apiKey && apiKey.trim() !== '') {
      const selectedSpeaker = speaker || DEFAULT_SPEAKER;

      const sarvamResponse = await fetch('https://api.sarvam.ai/text-to-speech', {
        method: 'POST',
        headers: {
          'api-subscription-key': apiKey.trim(),
          'x-api-key': apiKey.trim(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: [cleanText],
          target_language_code: targetLangCode,
          speaker: selectedSpeaker,
          pitch: 0,
          pace: 1.0,
          loudness: 1.5,
          speech_sample_rate: 22050,
          enable_preprocessing: true,
          model: DEFAULT_MODEL,
        }),
      });

      if (sarvamResponse.ok) {
        const data = await sarvamResponse.json();
        const base64Audio = data?.audios?.[0];

        if (base64Audio) {
          const audioBuffer = Buffer.from(base64Audio, 'base64');
          return new NextResponse(audioBuffer, {
            status: 200,
            headers: {
              'Content-Type': 'audio/wav',
              'Cache-Control': 'public, max-age=3600',
            },
          });
        }
      } else {
        const errText = await sarvamResponse.text();
        console.warn(`[Sarvam TTS] Error (${sarvamResponse.status}):`, errText);
      }
    }

    // 4. Secondary: ElevenLabs Multilingual v2 (if configured in environment)
    const elevenKey = process.env.ELEVENLABS_API_KEY;
    if (elevenKey && elevenKey.trim() !== '') {
      const voiceId = process.env.ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL';
      const elevenResponse = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
        {
          method: 'POST',
          headers: {
            'xi-api-key': elevenKey.trim(),
            'Content-Type': 'application/json',
            Accept: 'audio/mpeg',
          },
          body: JSON.stringify({
            text: cleanText,
            model_id: 'eleven_multilingual_v2',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
              style: 0.2,
              use_speaker_boost: true,
            },
          }),
        }
      );

      if (elevenResponse.ok) {
        const audioBuffer = await elevenResponse.arrayBuffer();
        return new NextResponse(audioBuffer, {
          status: 200,
          headers: {
            'Content-Type': 'audio/mpeg',
            'Cache-Control': 'public, max-age=3600',
          },
        });
      }
    }

    // 5. Fallback Signal to Client (Client will seamlessly use enhanced browser SpeechSynthesis)
    return NextResponse.json(
      {
        message: 'No external TTS key active or provider temporarily unavailable. Using client browser engine.',
        code: 'TTS_FALLBACK',
        fallback: true,
        text: cleanText,
        language: detectedLang,
        language_code: targetLangCode,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Voice Speak Error]:', error?.message || error);
    return NextResponse.json(
      {
        error: 'An internal error occurred during voice synthesis',
        code: 'TTS_ERROR',
        fallback: true,
      },
      { status: 500 }
    );
  }
}
