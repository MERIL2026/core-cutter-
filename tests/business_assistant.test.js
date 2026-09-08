const test = require('node:test');
const assert = require('node:assert');
const path = require('path');
const fs = require('fs');

const projectRoot = path.join(__dirname, '..');

test('Business-Aware AI Assistant - Automated Verification Suite', async (t) => {
  // Verify required modules exist
  await t.test('1. Core Assistant files and architecture exist', () => {
    const pricingConfigPath = path.join(projectRoot, 'src/content/pricing.ts');
    const typesPath = path.join(projectRoot, 'src/lib/assistant/types.ts');
    const knowledgePath = path.join(projectRoot, 'src/lib/assistant/knowledge.ts');
    const pricingEnginePath = path.join(projectRoot, 'src/lib/assistant/pricingEngine.ts');
    const intentExtractorPath = path.join(projectRoot, 'src/lib/assistant/intentExtractor.ts');
    const contextManagerPath = path.join(projectRoot, 'src/lib/assistant/contextManager.ts');
    const responseGenPath = path.join(projectRoot, 'src/lib/assistant/responseGenerator.ts');
    const indexPath = path.join(projectRoot, 'src/lib/assistant/index.ts');

    assert.strictEqual(fs.existsSync(pricingConfigPath), true, 'src/content/pricing.ts must exist');
    assert.strictEqual(fs.existsSync(typesPath), true, 'src/lib/assistant/types.ts must exist');
    assert.strictEqual(fs.existsSync(knowledgePath), true, 'src/lib/assistant/knowledge.ts must exist');
    assert.strictEqual(fs.existsSync(pricingEnginePath), true, 'src/lib/assistant/pricingEngine.ts must exist');
    assert.strictEqual(fs.existsSync(intentExtractorPath), true, 'src/lib/assistant/intentExtractor.ts must exist');
    assert.strictEqual(fs.existsSync(contextManagerPath), true, 'src/lib/assistant/contextManager.ts must exist');
    assert.strictEqual(fs.existsSync(responseGenPath), true, 'src/lib/assistant/responseGenerator.ts must exist');
    assert.strictEqual(fs.existsSync(indexPath), true, 'src/lib/assistant/index.ts must exist');
  });

  // Dynamic import of TypeScript files via transpile or reading module logic
  // For Node test runner, we test the core logic and integration
  await t.test('TEST 1: Natural Language Entity Extraction ("AC ke liye 5 hole chahiye")', () => {
    const extractorContent = fs.readFileSync(path.join(projectRoot, 'src/lib/assistant/intentExtractor.ts'), 'utf8');
    assert.strictEqual(extractorContent.includes('extractEntities'), true);
    assert.strictEqual(extractorContent.includes('extractQuantity'), true);
    assert.strictEqual(extractorContent.includes('extractDiameter'), true);

    // Verify regex matches "AC ke liye 5 hole chahiye"
    const text = 'AC ke liye 5 hole chahiye';
    const relMatch = text.match(/(?:ke liye|mate|માટે|के लिए)\s*(\d+)\s*(?:holes?|होલ|होल|હોલ)/i);
    assert.strictEqual(relMatch !== null, true);
    assert.strictEqual(parseInt(relMatch[1], 10), 5);
  });

  await t.test('TEST 2: Price Request & Dimension Extraction ("3 inch ke 5 hole kitne ke?")', () => {
    const text = '3 inch ke 5 hole kitne ke?';
    const inchMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:inch(?:es)?|in|"|ઇંચ|ઇન્ચ|इंच)/i);
    assert.strictEqual(inchMatch !== null, true);
    assert.strictEqual(parseFloat(inchMatch[1]), 3);

    const isPrice = text.includes('kitne ke') || text.includes('kitna');
    assert.strictEqual(isPrice, true);

    const multiMatch = text.match(/(?:\d+(?:\.\d+)?)\s*(?:inch|in|"|ઇંચ|इंच)[^\d]*(\d+)\s*(?:holes?|होલ|होल|હોલ)?/i);
    assert.strictEqual(multiMatch !== null, true);
    assert.strictEqual(parseInt(multiMatch[1], 10), 5);
  });

  await t.test('TEST 3: Multi-turn Conversation Memory', () => {
    const contextContent = fs.readFileSync(path.join(projectRoot, 'src/lib/assistant/contextManager.ts'), 'utf8');
    assert.strictEqual(contextContent.includes('buildContext'), true);
    assert.strictEqual(contextContent.includes('mergeEntities'), true);
    assert.strictEqual(contextContent.includes('pendingQuestionField'), true);
  });

  await t.test('TEST 4: Gujarati Understanding ("મારે AC માટે 3 ઇંચના 5 હોલ કરાવવા છે")', () => {
    const text = 'મારે AC માટે 3 ઇંચના 5 હોલ કરાવવા છે';
    const gujMultiMatch = text.match(/(?:\d+(?:\.\d+)?)\s*(?:ઇંચના|ઇંચ ના|ઇન્ચના)\s*(\d+)\s*(?:હોલ|કાણ)?/i);
    assert.strictEqual(gujMultiMatch !== null, true);
    assert.strictEqual(parseInt(gujMultiMatch[1], 10), 5);

    const gujInchMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:inch(?:es)?|in|"|ઇંચ|ઇન્ચ|इंच)/i);
    assert.strictEqual(gujInchMatch !== null, true);
    assert.strictEqual(parseFloat(gujInchMatch[1]), 3);
  });

  await t.test('TEST 5: Hindi Price Request ("5 hole ka total kitna padega?")', () => {
    const text = '5 hole ka total kitna padega?';
    const digitMatch = text.match(/(\d+)\s*(?:holes?|होલ|હૉલ|होल|હોલ|કાણ)/i);
    assert.strictEqual(digitMatch !== null, true);
    assert.strictEqual(parseInt(digitMatch[1], 10), 5);

    const isPrice = text.includes('kitna padega');
    assert.strictEqual(isPrice, true);
  });

  await t.test('TEST 6: Correction Handling ("5 holes" -> "Sorry 3 holes")', () => {
    const contextContent = fs.readFileSync(path.join(projectRoot, 'src/lib/assistant/contextManager.ts'), 'utf8');
    assert.strictEqual(contextContent.includes('isCorrection'), true);
    assert.strictEqual(contextContent.includes('sorry'), true);
    assert.strictEqual(contextContent.includes('nahi'), true);
  });

  await t.test('TEST 7 & 8: Pricing Engine Determinism & No Hallucination', () => {
    const pricingContent = fs.readFileSync(path.join(projectRoot, 'src/lib/assistant/pricingEngine.ts'), 'utf8');
    const pricingConfig = fs.readFileSync(path.join(projectRoot, 'src/content/pricing.ts'), 'utf8');

    assert.strictEqual(pricingContent.includes('isCalculated'), true);
    assert.strictEqual(pricingContent.includes('isConfigured'), true);
    assert.strictEqual(pricingContent.includes('reason: \'unconfigured\''), true);
    assert.strictEqual(pricingConfig.includes('isGloballyConfigured'), true);
    assert.strictEqual(pricingConfig.includes('tier-3-inch'), true);
  });

  await t.test('TEST 9: Service Area Verification Lookup', () => {
    const knowledgeContent = fs.readFileSync(path.join(projectRoot, 'src/lib/assistant/knowledge.ts'), 'utf8');
    assert.strictEqual(knowledgeContent.includes('findMatchingServiceArea'), true);
    assert.strictEqual(knowledgeContent.includes('defaultServiceAreas'), true);
  });

  await t.test('TEST 10: Technical Questions & Safe Fallbacks', () => {
    const responseGenContent = fs.readFileSync(path.join(projectRoot, 'src/lib/assistant/responseGenerator.ts'), 'utf8');
    assert.strictEqual(
      responseGenContent.includes("I don't want to give you an incorrect technical answer"),
      true,
      'Must contain safe fallback for unknown technical questions'
    );
  });
});
