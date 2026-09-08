const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');

test('Multilingual Sarvam AI Voice Assistant Verification', async (t) => {
  await t.test('1. Server-side voice API routes and components exist', () => {
    const transcribeRoute = path.join(projectRoot, 'src/app/api/voice/transcribe/route.ts');
    const speakRoute = path.join(projectRoot, 'src/app/api/voice/speak/route.ts');
    const ttsRoute = path.join(projectRoot, 'src/app/api/tts/route.ts');
    const speechLib = path.join(projectRoot, 'src/lib/speechSynthesis.ts');
    const langDetector = path.join(projectRoot, 'src/lib/languageDetector.ts');
    const voiceButton = path.join(projectRoot, 'src/components/chatbot/VoiceInputButton.tsx');
    const chatWindow = path.join(projectRoot, 'src/components/chatbot/ChatWindow.tsx');

    assert.strictEqual(fs.existsSync(transcribeRoute), true, 'transcribe route must exist');
    assert.strictEqual(fs.existsSync(speakRoute), true, 'speak route must exist');
    assert.strictEqual(fs.existsSync(ttsRoute), true, 'tts route must exist');
    assert.strictEqual(fs.existsSync(speechLib), true, 'speechSynthesis.ts must exist');
    assert.strictEqual(fs.existsSync(langDetector), true, 'languageDetector.ts must exist');
    assert.strictEqual(fs.existsSync(voiceButton), true, 'VoiceInputButton.tsx must exist');
    assert.strictEqual(fs.existsSync(chatWindow), true, 'ChatWindow.tsx must exist');
  });

  await t.test('2. Voice Transcribe Route implements Sarvam STT with auto language detection', () => {
    const content = fs.readFileSync(
      path.join(projectRoot, 'src/app/api/voice/transcribe/route.ts'),
      'utf8'
    );

    assert.strictEqual(content.includes('https://api.sarvam.ai/speech-to-text'), true);
    assert.strictEqual(content.includes('SARVAM_API_KEY'), true);
    assert.strictEqual(content.includes('checkRateLimit'), true, 'Must enforce rate limiting');
    assert.strictEqual(content.includes('MAX_AUDIO_BYTES'), true, 'Must limit audio size');
    assert.strictEqual(content.includes("'gu'"), true, 'Must handle Gujarati');
    assert.strictEqual(content.includes("'hi'"), true, 'Must handle Hindi');
    assert.strictEqual(content.includes("'en'"), true, 'Must handle English');
  });

  await t.test('3. Voice Speak Route implements Sarvam Bulbul v3 TTS', () => {
    const content = fs.readFileSync(
      path.join(projectRoot, 'src/app/api/voice/speak/route.ts'),
      'utf8'
    );

    assert.strictEqual(content.includes('https://api.sarvam.ai/text-to-speech'), true);
    assert.strictEqual(content.includes('SARVAM_API_KEY'), true);
    assert.strictEqual(content.includes('SARVAM_TTS_MODEL'), true);
    assert.strictEqual(content.includes('SARVAM_TTS_SPEAKER'), true);
    assert.strictEqual(content.includes('gu-IN'), true, 'Must support Gujarati locale');
    assert.strictEqual(content.includes('hi-IN'), true, 'Must support Hindi locale');
    assert.strictEqual(content.includes('en-IN'), true, 'Must support English locale');
    assert.strictEqual(content.includes('checkRateLimit'), true, 'Must enforce rate limiting');
  });

  await t.test('4. Language and Script Inference Engine logic', () => {
    const detectorContent = fs.readFileSync(
      path.join(projectRoot, 'src/lib/languageDetector.ts'),
      'utf8'
    );

    assert.strictEqual(detectorContent.includes('inferMessageLanguage'), true, 'Must export inferMessageLanguage');
    assert.strictEqual(detectorContent.includes('0A80') || detectorContent.includes('0AFF'), true, 'Must check Gujarati Unicode block');
    assert.strictEqual(detectorContent.includes('0900') || detectorContent.includes('097F'), true, 'Must check Devanagari Unicode block');
    assert.strictEqual(detectorContent.includes('gujlishKeywords'), true, 'Must support Romanized Gujarati');
    assert.strictEqual(detectorContent.includes('hinglishKeywords'), true, 'Must support Romanized Hindi');
  });

  await t.test('5. Phonetic normalizer handles regional terms, numbers, and units', () => {
    const synthContent = fs.readFileSync(
      path.join(projectRoot, 'src/lib/speechSynthesis.ts'),
      'utf8'
    );

    assert.strictEqual(synthContent.includes('normalizeTextForSpeech'), true);
    assert.strictEqual(synthContent.includes('અઢી ઇંચ'), true, 'Must expand 2.5 inch in Gujarati');
    assert.strictEqual(synthContent.includes('ढाई इंच'), true, 'Must expand 2.5 inch in Hindi');
    assert.strictEqual(synthContent.includes('આર સી સી'), true, 'Must pronounce RCC in Gujarati');
    assert.strictEqual(synthContent.includes('आर सी सी'), true, 'Must pronounce RCC in Hindi');
    assert.strictEqual(synthContent.includes('ઝીરો ટકા'), true, 'Must pronounce 0% in Gujarati');
    assert.strictEqual(synthContent.includes('ज़ीरो परसेंट'), true, 'Must pronounce 0% in Hindi');
  });

  await t.test('6. Security verification: Sarvam API Key is never leaked to client source files', () => {
    const clientFiles = [
      'src/components/chatbot/ChatMessage.tsx',
      'src/components/chatbot/ChatWindow.tsx',
      'src/components/chatbot/VoiceInputButton.tsx',
      'src/components/chatbot/ChatbotWidget.tsx',
      'src/lib/speechSynthesis.ts',
      'src/lib/languageDetector.ts',
      'src/lib/analytics.ts',
    ];

    for (const relativePath of clientFiles) {
      const fullPath = path.join(projectRoot, relativePath);
      const content = fs.readFileSync(fullPath, 'utf8');
      assert.strictEqual(
        content.includes('NEXT_PUBLIC_SARVAM'),
        false,
        `Client file ${relativePath} must NOT contain NEXT_PUBLIC_SARVAM`
      );
      assert.strictEqual(
        content.includes('process.env.SARVAM_API_KEY'),
        false,
        `Client file ${relativePath} must NOT access SARVAM_API_KEY directly`
      );
    }
  });

  await t.test('7. ChatbotWidget is mounted and active', () => {
    const layout = fs.readFileSync(
      path.join(projectRoot, 'src/app/layout.tsx'),
      'utf8'
    );
    assert.strictEqual(layout.includes('ChatbotWidget'), true, 'ChatbotWidget must be in layout');
  });

  await t.test('8. AssistantBlob component implements 3D visual identity and dynamic states', () => {
    const blobPath = path.join(projectRoot, 'src/components/chatbot/AssistantBlob.tsx');
    assert.strictEqual(fs.existsSync(blobPath), true, 'AssistantBlob.tsx must exist');

    const content = fs.readFileSync(blobPath, 'utf8');
    assert.strictEqual(content.includes('idle'), true, 'Must support idle state');
    assert.strictEqual(content.includes('listening'), true, 'Must support listening state');
    assert.strictEqual(content.includes('thinking'), true, 'Must support thinking state');
    assert.strictEqual(content.includes('speaking'), true, 'Must support speaking state');
    assert.strictEqual(content.includes('audioAnalyser'), true, 'Must integrate with audioAnalyser');
    assert.strictEqual(content.includes('sizeConfig'), true, 'Must support multi-size scaling');
  });

  await t.test('9. AudioAnalyser Web Audio API service exists and is integrated', () => {
    const analyserPath = path.join(projectRoot, 'src/lib/audioAnalyser.ts');
    assert.strictEqual(fs.existsSync(analyserPath), true, 'audioAnalyser.ts must exist');

    const content = fs.readFileSync(analyserPath, 'utf8');
    assert.strictEqual(content.includes('AudioContext'), true, 'Must utilize Web Audio API AudioContext');
    assert.strictEqual(content.includes('createAnalyser'), true, 'Must utilize createAnalyser');
    assert.strictEqual(content.includes('attachAudioElement'), true, 'Must support attaching audio elements');
    assert.strictEqual(content.includes('attachMediaStream'), true, 'Must support attaching media streams');
  });

  await t.test('10. CSS Animation & Reduced Motion accessibility in globals.css', () => {
    const cssPath = path.join(projectRoot, 'src/styles/globals.css');
    const content = fs.readFileSync(cssPath, 'utf8');
    assert.strictEqual(content.includes('@keyframes blobBreathe'), true, 'Must define blob breathing animation');
    assert.strictEqual(content.includes('@keyframes blobSpeak'), true, 'Must define blob speaking animation');
    assert.strictEqual(content.includes('prefers-reduced-motion'), true, 'Must respect reduced motion preference');
  });
});

