# AC Core Cutting Business Website & Multilingual AI Voice Assistant

A production-ready, mobile-first website for a local professional AC core cutting, RCC drilling, and concrete wall drilling contractor with an India-focused conversational AI Voice Assistant.

---

## 🎙️ Multilingual AI Voice Assistant (English + Hindi + Gujarati)

The assistant features an end-to-end voice pipeline powered by **Sarvam AI** for natural, human-like speech recognition and synthesis across India's regional languages.

### Capabilities:
- **Speech-to-Text (STT)**: Sarvam AI `saaras:v2` with automatic language detection across `en-IN`, `hi-IN`, `gu-IN`, and code-mixed speech (Hinglish / Gujlish).
- **Text-to-Speech (TTS)**: Sarvam AI `bulbul:v3` with natural multilingual Indian voices (e.g., `priya`, `ishita`, `suhani`, `ratan`, `anand`, `shubh`).
- **Zero-Friction Language Switching**: The user does not need to manually toggle a language selector before speaking. The system automatically detects the language and responds naturally in the same language.
- **Graceful Fallbacks**: If microphone access is denied or external AI voice services are unavailable, the assistant falls back to browser-level speech and text chat without disrupting the user experience.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14+ (App Router, TypeScript)
- **Voice Stack**: Sarvam AI (`saaras:v2` STT, `bulbul:v3` TTS), HTML5 MediaRecorder Audio Pipeline
- **AI Intelligence**: Google Gemini Pro + Domain-Specific Technical Fallback Engine
- **Styling**: Tailwind CSS + PostCSS
- **Database**: PostgreSQL (relational baseline schema with pg driver)
- **Validation**: Zod schema validation
- **Icons**: Lucide React
- **Code Quality**: ESLint, TypeScript Strict Mode, Node.js Native Test Runner

---

## 🚀 Environment Setup

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Configure your environment variables in `.env.local`:

```env
# Sarvam AI Voice Suite (Server-Side Only)
SARVAM_API_KEY="your_sarvam_api_key_here"
SARVAM_STT_MODEL="saaras:v2"
SARVAM_TTS_MODEL="bulbul:v3"
SARVAM_TTS_SPEAKER="priya"

# Google Gemini API Key (Server-Side Only)
GEMINI_API_KEY="your_gemini_api_key_here"

# Database Connection (Server-Side Only)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/core_cutting_db?sslmode=disable"

# Application Public Variables
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_BUSINESS_PHONE="+919876543210"
NEXT_PUBLIC_WHATSAPP_NUMBER="919876543210"
```

> [!IMPORTANT]
> All AI keys (`SARVAM_API_KEY`, `GEMINI_API_KEY`) and database credentials remain strictly server-side. They are NEVER exposed to client-side bundles or `NEXT_PUBLIC_*` variables.

---

## 🔒 Security & Rate Limiting

The voice endpoints are guarded by a sliding-window rate limiter (`src/lib/rateLimit.ts`):
- `POST /api/voice/transcribe`: Max 20 requests/minute per IP, max 10MB audio size limit.
- `POST /api/voice/speak`: Max 30 requests/minute per IP, max 1000 characters text length limit.
- `POST /api/chat`: Max 40 messages/minute per IP.

---

## 💻 Development Commands

```bash
# Start local development server
npm run dev

# Run TypeScript type checking
npm run typecheck

# Run ESLint check
npm run lint

# Run automated tests
npm run test

# Build production bundle
npm run build
```

---

## 🧪 Testing Voice & Chat Capabilities

Automated tests cover:
- Multilingual voice transcription & synthesis routes
- Language inference (English, Hindi, Gujarati, Hinglish, Gujlish)
- Rate limiting protection
- Voice interruption & audio cleanup
- Error handling & graceful browser fallbacks
- Server-side secret isolation
