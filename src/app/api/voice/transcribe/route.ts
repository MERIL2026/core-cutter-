import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rateLimit';
import { detectScriptLanguage } from '@/lib/languageDetector';

// Maximum audio upload size: 10 MB
const MAX_AUDIO_BYTES = 10 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';

    // 1. Rate Limiting Protection (20 transcriptions per minute per IP)
    const rateLimit = checkRateLimit(`voice_stt_${ip}`, {
      windowMs: 60 * 1000,
      maxRequests: 20,
    });

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded for voice transcription. Please wait a moment.',
          code: 'RATE_LIMIT_ERROR',
        },
        { status: 429 }
      );
    }

    const apiKey = process.env.SARVAM_API_KEY;
    if (!apiKey || apiKey.trim() === '') {
      return NextResponse.json(
        {
          error: 'Sarvam AI API key is not configured on the server.',
          code: 'STT_ERROR',
          fallback: true,
        },
        { status: 503 }
      );
    }

    const contentType = req.headers.get('content-type') || '';
    let audioBlob: Blob | null = null;
    let fileName = 'recording.webm';
    let mimeType = 'audio/webm';
    let clientLanguage = 'unknown';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      if (!file) {
        return NextResponse.json(
          { error: 'No audio file provided in request', code: 'INVALID_AUDIO' },
          { status: 400 }
        );
      }

      if (file.size > MAX_AUDIO_BYTES) {
        return NextResponse.json(
          { error: 'Audio file exceeds 10MB limit', code: 'INVALID_AUDIO' },
          { status: 413 }
        );
      }

      audioBlob = file;
      fileName = file.name || 'recording.webm';
      mimeType = file.type || 'audio/webm';
      clientLanguage = (formData.get('language_code') as string) || 'unknown';
    } else {
      const arrayBuffer = await req.arrayBuffer();
      if (arrayBuffer.byteLength === 0) {
        return NextResponse.json(
          { error: 'Empty audio buffer received', code: 'INVALID_AUDIO' },
          { status: 400 }
        );
      }

      if (arrayBuffer.byteLength > MAX_AUDIO_BYTES) {
        return NextResponse.json(
          { error: 'Audio file exceeds 10MB limit', code: 'INVALID_AUDIO' },
          { status: 413 }
        );
      }

      mimeType = contentType.split(';')[0] || 'audio/webm';
      audioBlob = new Blob([arrayBuffer], { type: mimeType });
    }

    // Clean and normalize MIME type for Sarvam API (removes ;codecs=opus or parameters)
    const rawMime = (audioBlob.type || mimeType || 'audio/webm').toLowerCase();
    let cleanMime = 'audio/webm';
    let fileExtension = 'webm';

    if (rawMime.includes('wav')) {
      cleanMime = 'audio/wav';
      fileExtension = 'wav';
    } else if (rawMime.includes('mp4') || rawMime.includes('m4a')) {
      cleanMime = 'audio/mp4';
      fileExtension = 'mp4';
    } else if (rawMime.includes('ogg') || rawMime.includes('opus')) {
      cleanMime = 'audio/ogg';
      fileExtension = 'ogg';
    } else if (rawMime.includes('mpeg') || rawMime.includes('mp3')) {
      cleanMime = 'audio/mp3';
      fileExtension = 'mp3';
    } else {
      cleanMime = 'audio/webm';
      fileExtension = 'webm';
    }

    const arrayBuffer = await audioBlob.arrayBuffer();
    const cleanBlob = new Blob([arrayBuffer], { type: cleanMime });
    const safeFileName = fileName.includes('.') ? fileName : `recording.${fileExtension}`;

    // 2. Prepare multipart request to Sarvam Speech-to-Text API
    // Supported models: 'saaras:v3', 'saarika:v2.5', 'saaras:v4'
    const requestedModel = (process.env.SARVAM_STT_MODEL || 'saaras:v3').trim();
    const primaryModel = requestedModel === 'saaras:v2' ? 'saaras:v3' : requestedModel;
    const candidateModels = [primaryModel, 'saaras:v3', 'saarika:v2.5', 'saaras:v4'].filter(
      (m, idx, arr) => arr.indexOf(m) === idx
    );

    const targetLangCode = ['hi-IN', 'gu-IN', 'en-IN'].includes(clientLanguage)
      ? clientLanguage
      : 'unknown';

    let sarvamData: any = null;
    let lastError = '';
    let lastStatus = 500;

    for (const model of candidateModels) {
      try {
        const sarvamFormData = new FormData();
        sarvamFormData.append('file', cleanBlob, safeFileName);
        sarvamFormData.append('model', model);
        sarvamFormData.append('language_code', targetLangCode);

        const sarvamResponse = await fetch('https://api.sarvam.ai/speech-to-text', {
          method: 'POST',
          headers: {
            'api-subscription-key': apiKey.trim(),
            'x-api-key': apiKey.trim(),
          },
          body: sarvamFormData,
        });

        if (sarvamResponse.ok) {
          sarvamData = await sarvamResponse.json();
          break;
        } else {
          lastStatus = sarvamResponse.status;
          lastError = await sarvamResponse.text();
          console.warn(`[Sarvam STT] Model ${model} failed (${lastStatus}):`, lastError);
        }
      } catch (err: any) {
        console.warn(`[Sarvam STT] Model ${model} error:`, err?.message);
      }
    }

    if (!sarvamData) {
      return NextResponse.json(
        {
          error: 'Voice transcription failed from speech provider',
          details: lastError,
          code: 'STT_ERROR',
          fallback: true,
        },
        { status: lastStatus }
      );
    }

    const transcript = (sarvamData?.transcript || '').trim();
    const detectedCode = sarvamData?.language_code || 'en-IN';

    // Map Sarvam language code to internal language format ('gu', 'hi', 'en')
    let internalLang: 'en' | 'gu' | 'hi' = 'en';
    if (detectedCode.startsWith('gu') || /[\u0A80-\u0AFF]/.test(transcript)) {
      internalLang = 'gu';
    } else if (detectedCode.startsWith('hi') || /[\u0900-\u097F]/.test(transcript)) {
      internalLang = 'hi';
    } else {
      internalLang = detectScriptLanguage(transcript, 'en');
    }

    return NextResponse.json({
      text: transcript,
      language: internalLang,
      language_code: detectedCode,
      confidence: sarvamData?.confidence ?? 1.0,
    });
  } catch (error: any) {
    console.error('[Sarvam STT Error]:', error?.message || error);
    return NextResponse.json(
      {
        error: 'An internal error occurred during voice transcription',
        code: 'NETWORK_ERROR',
        fallback: true,
      },
      { status: 500 }
    );
  }
}
