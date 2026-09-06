const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

test('Phase 03 Content & Data Layer Verification', async (t) => {
  await t.test('required content modules exist in src/content', () => {
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../src/content/business.ts')), true);
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../src/content/services.ts')), true);
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../src/content/serviceAreas.ts')), true);
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../src/content/gallery.ts')), true);
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../src/content/reviews.ts')), true);
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../src/content/faqs.ts')), true);
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../src/content/settings.ts')), true);
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../src/content/index.ts')), true);
  });

  await t.test('required data access modules exist in src/lib/content', () => {
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../src/lib/content/business.ts')), true);
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../src/lib/content/services.ts')), true);
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../src/lib/content/serviceAreas.ts')), true);
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../src/lib/content/gallery.ts')), true);
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../src/lib/content/reviews.ts')), true);
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../src/lib/content/faqs.ts')), true);
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../src/lib/content/settings.ts')), true);
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../src/lib/content/index.ts')), true);
  });

  await t.test('content validation schema module exists', () => {
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../src/lib/validations/content.ts')), true);
  });

  await t.test('six canonical service categories are defined in services.ts', () => {
    const servicesContent = fs.readFileSync(
      path.join(__dirname, '../src/content/services.ts'),
      'utf8'
    );

    const expectedSlugs = [
      'ac-core-cutting',
      'rcc-core-cutting',
      'ac-drain-hole',
      'concrete-wall-drilling',
      'pipe-cable-passage',
      'other',
    ];

    expectedSlugs.forEach((slug) => {
      assert.strictEqual(
        servicesContent.includes(`slug: '${slug}'`),
        true,
        `Expected service slug '${slug}' to be present`
      );
    });
  });

  await t.test('FAQs address key customer themes and objection handling', () => {
    const faqsContent = fs.readFileSync(
      path.join(__dirname, '../src/content/faqs.ts'),
      'utf8'
    );

    assert.strictEqual(faqsContent.includes('What is AC core cutting?'), true);
    assert.strictEqual(faqsContent.includes('RCC (Reinforced Cement Concrete)'), true);
    assert.strictEqual(faqsContent.includes('diameters are possible?'), true);
    assert.strictEqual(faqsContent.includes('How long does a typical core cutting job take?'), true);
    assert.strictEqual(faqsContent.includes('Which areas do you serve?'), true);
  });

  await t.test('no fake customer reviews or fake photos are present in default content', () => {
    const reviewsContent = fs.readFileSync(
      path.join(__dirname, '../src/content/reviews.ts'),
      'utf8'
    );
    assert.strictEqual(
      reviewsContent.includes('export const defaultReviews: Review[] = [];'),
      true,
      'Default reviews must be an empty array until real reviews are supplied'
    );

    const galleryContent = fs.readFileSync(
      path.join(__dirname, '../src/content/gallery.ts'),
      'utf8'
    );
    assert.strictEqual(
      galleryContent.includes('export const defaultGalleryItems: GalleryItem[] ='),
      true,
      'Default gallery export must be defined'
    );
  });

  await t.test('database schema and domain types align', () => {
    const typesContent = fs.readFileSync(
      path.join(__dirname, '../src/types/index.ts'),
      'utf8'
    );

    assert.strictEqual(typesContent.includes('export interface BusinessProfile'), true);
    assert.strictEqual(typesContent.includes('export interface Service'), true);
    assert.strictEqual(typesContent.includes('export interface ServiceArea'), true);
    assert.strictEqual(typesContent.includes('export interface GalleryItem'), true);
    assert.strictEqual(typesContent.includes('export interface Review'), true);
    assert.strictEqual(typesContent.includes('export interface FAQ'), true);
    assert.strictEqual(typesContent.includes('export interface Enquiry'), true);
    assert.strictEqual(typesContent.includes('export interface AnalyticsEvent'), true);
    assert.strictEqual(typesContent.includes('export interface SiteSetting'), true);
  });
});
