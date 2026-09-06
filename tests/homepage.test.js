const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

test('Phase 04 Homepage & Conversion System Verification', async (t) => {
  await t.test('homepage entry file exists and is assembled with all required sections', () => {
    const pagePath = path.join(__dirname, '../src/app/page.tsx');
    assert.strictEqual(fs.existsSync(pagePath), true);

    const pageContent = fs.readFileSync(pagePath, 'utf8');
    assert.strictEqual(pageContent.includes('<Hero'), true);
    assert.strictEqual(pageContent.includes('<TrustSection'), true);
    assert.strictEqual(pageContent.includes('<ServicesOverview'), true);
    assert.strictEqual(pageContent.includes('<ProcessSection'), true);
    assert.strictEqual(pageContent.includes('<RecentWorkSection'), true);
    assert.strictEqual(pageContent.includes('<ReviewsSection'), true);
    assert.strictEqual(pageContent.includes('<FAQPreview'), true);
    assert.strictEqual(pageContent.includes('<FinalCTASection'), true);
    assert.strictEqual(pageContent.includes('<Header'), true);
    assert.strictEqual(pageContent.includes('<Footer'), true);
  });

  await t.test('all home section components exist under src/components/home', () => {
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../src/components/home/Hero.tsx')), true);
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../src/components/home/TrustSection.tsx')), true);
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../src/components/home/ServicesOverview.tsx')), true);
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../src/components/home/ProcessSection.tsx')), true);
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../src/components/home/RecentWorkSection.tsx')), true);
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../src/components/home/ReviewsSection.tsx')), true);
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../src/components/home/FAQPreview.tsx')), true);
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../src/components/home/FinalCTASection.tsx')), true);
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../src/components/home/index.ts')), true);
  });

  await t.test('Hero component contains exactly one H1 and primary conversion CTAs', () => {
    const heroContent = fs.readFileSync(
      path.join(__dirname, '../src/components/home/Hero.tsx'),
      'utf8'
    );

    const h1Matches = heroContent.match(/<h1[\s\S]*?<\/h1>/g);
    assert.strictEqual(h1Matches && h1Matches.length === 1, true, 'Hero must contain exactly one H1');
    assert.strictEqual(heroContent.includes('type="quote"'), true);
    assert.strictEqual(heroContent.includes('type="call"'), true);
    assert.strictEqual(heroContent.includes('type="whatsapp"'), true);
  });

  await t.test('ProcessSection contains the approved 5-step workflow', () => {
    const processContent = fs.readFileSync(
      path.join(__dirname, '../src/components/home/ProcessSection.tsx'),
      'utf8'
    );

    assert.strictEqual(processContent.includes('Contact & Requirement'), true);
    assert.strictEqual(processContent.includes('Assessment & Quote'), true);
    assert.strictEqual(processContent.includes('Technician Arrival & Setup'), true);
    assert.strictEqual(processContent.includes('Precision Diamond Coring'), true);
    assert.strictEqual(processContent.includes('Inspection & Cleanup'), true);
  });

  await t.test('FinalCTASection connects to #quote-section with direct contact methods', () => {
    const finalCTAContent = fs.readFileSync(
      path.join(__dirname, '../src/components/home/FinalCTASection.tsx'),
      'utf8'
    );

    assert.strictEqual(finalCTAContent.includes('id="quote-section"'), true);
    assert.strictEqual(finalCTAContent.includes('<ContactFormUI'), true);
    assert.strictEqual(finalCTAContent.includes('type="call"'), true);
    assert.strictEqual(finalCTAContent.includes('type="whatsapp"'), true);
  });
});
