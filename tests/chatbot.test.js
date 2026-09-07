const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');

test('Multilingual Voice & Gemini AI Chatbot Verification', async (t) => {
  await t.test('chatbot route and component files exist', () => {
    const routePath = path.join(projectRoot, 'src/app/api/chat/route.ts');
    const typesPath = path.join(projectRoot, 'src/types/chatbot.ts');
    const widgetPath = path.join(projectRoot, 'src/components/chatbot/ChatbotWidget.tsx');
    const windowPath = path.join(projectRoot, 'src/components/chatbot/ChatWindow.tsx');
    const messagePath = path.join(projectRoot, 'src/components/chatbot/ChatMessage.tsx');
    const voiceBtnPath = path.join(projectRoot, 'src/components/chatbot/VoiceInputButton.tsx');
    const indexPath = path.join(projectRoot, 'src/components/chatbot/index.ts');

    assert.strictEqual(fs.existsSync(routePath), true, 'src/app/api/chat/route.ts must exist');
    assert.strictEqual(fs.existsSync(typesPath), true, 'src/types/chatbot.ts must exist');
    assert.strictEqual(fs.existsSync(widgetPath), true, 'src/components/chatbot/ChatbotWidget.tsx must exist');
    assert.strictEqual(fs.existsSync(windowPath), true, 'src/components/chatbot/ChatWindow.tsx must exist');
    assert.strictEqual(fs.existsSync(messagePath), true, 'src/components/chatbot/ChatMessage.tsx must exist');
    assert.strictEqual(fs.existsSync(voiceBtnPath), true, 'src/components/chatbot/VoiceInputButton.tsx must exist');
    assert.strictEqual(fs.existsSync(indexPath), true, 'src/components/chatbot/index.ts must exist');
  });

  await t.test('chat API route contains Gemini Pro integration and multilingual fallback logic', () => {
    const routeContent = fs.readFileSync(
      path.join(projectRoot, 'src/app/api/chat/route.ts'),
      'utf8'
    );

    assert.strictEqual(routeContent.includes('GoogleGenerativeAI'), true, 'Must import GoogleGenerativeAI');
    assert.strictEqual(routeContent.includes('getSystemPrompt'), true, 'Must define system prompt');
    assert.strictEqual(routeContent.includes('getFallbackResponse'), true, 'Must define fallback response engine');
    assert.strictEqual(routeContent.includes("'gu'"), true, 'Must support Gujarati');
    assert.strictEqual(routeContent.includes("'hi'"), true, 'Must support Hindi');
    assert.strictEqual(routeContent.includes("'en'"), true, 'Must support English');
  });

  await t.test('voice button supports speech recognition for en-IN, gu-IN, and hi-IN', () => {
    const voiceContent = fs.readFileSync(
      path.join(projectRoot, 'src/components/chatbot/VoiceInputButton.tsx'),
      'utf8'
    );

    assert.strictEqual(voiceContent.includes('SpeechRecognition'), true, 'Must use SpeechRecognition');
    assert.strictEqual(voiceContent.includes('gu-IN'), true, 'Must support gu-IN');
    assert.strictEqual(voiceContent.includes('hi-IN'), true, 'Must support hi-IN');
    assert.strictEqual(voiceContent.includes('en-IN'), true, 'Must support en-IN');
  });

  await t.test('RootLayout mounts ChatbotWidget globally', () => {
    const layoutContent = fs.readFileSync(
      path.join(projectRoot, 'src/app/layout.tsx'),
      'utf8'
    );

    assert.strictEqual(layoutContent.includes('ChatbotWidget'), true, 'RootLayout must mount ChatbotWidget');
  });
});
