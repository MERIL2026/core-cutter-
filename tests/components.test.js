const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

test('Phase 02 Component System Verification', async (t) => {
  await t.test('required layout and navigation components exist', () => {
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../src/components/layout/Container.tsx')), true);
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../src/components/layout/Section.tsx')), true);
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../src/components/layout/Header.tsx')), true);
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../src/components/layout/Footer.tsx')), true);
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../src/components/navigation/DesktopNav.tsx')), true);
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../src/components/navigation/MobileNav.tsx')), true);
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../src/components/navigation/navData.ts')), true);
  });

  await t.test('required UI primitives and feature components exist', () => {
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../src/components/ui/Button.tsx')), true);
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../src/components/ui/ContactCTA.tsx')), true);
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../src/components/ui/SectionHeading.tsx')), true);
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../src/components/services/ServiceCard.tsx')), true);
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../src/components/reviews/ReviewCard.tsx')), true);
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../src/components/gallery/GalleryGrid.tsx')), true);
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../src/components/faq/FAQAccordion.tsx')), true);
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../src/components/forms/ContactFormUI.tsx')), true);
  });

  await t.test('development showcase page exists', () => {
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../src/app/showcase/page.tsx')), true);
  });
});
