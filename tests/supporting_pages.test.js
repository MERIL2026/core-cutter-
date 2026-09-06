const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

test('Phase 06 Supporting Pages Verification', async (t) => {
  const routes = [
    { name: 'about', file: 'src/app/about/page.tsx' },
    { name: 'gallery', file: 'src/app/gallery/page.tsx' },
    { name: 'reviews', file: 'src/app/reviews/page.tsx' },
    { name: 'faq', file: 'src/app/faq/page.tsx' },
    { name: 'service-areas', file: 'src/app/service-areas/page.tsx' },
    { name: 'contact', file: 'src/app/contact/page.tsx' },
  ];

  await t.test('all six supporting page route files exist', () => {
    routes.forEach((route) => {
      assert.strictEqual(
        fs.existsSync(path.join(__dirname, '../', route.file)),
        true,
        `Expected ${route.file} to exist`
      );
    });
  });

  await t.test('each supporting page contains exactly one H1 element', () => {
    routes.forEach((route) => {
      const content = fs.readFileSync(path.join(__dirname, '../', route.file), 'utf8');
      const h1Matches = content.match(/<h1[\s\S]*?<\/h1>/g);
      assert.strictEqual(
        h1Matches && h1Matches.length === 1,
        true,
        `Expected ${route.name} page to have exactly one H1 tag`
      );
    });
  });

  await t.test('all supporting pages include Breadcrumbs navigation component', () => {
    routes.forEach((route) => {
      const content = fs.readFileSync(path.join(__dirname, '../', route.file), 'utf8');
      assert.strictEqual(
        content.includes('<Breadcrumbs'),
        true,
        `Expected ${route.name} page to include Breadcrumbs component`
      );
    });
  });

  await t.test('Gallery page uses GalleryGrid and does not introduce fake photos', () => {
    const galleryContent = fs.readFileSync(
      path.join(__dirname, '../src/app/gallery/page.tsx'),
      'utf8'
    );
    assert.strictEqual(galleryContent.includes('<GalleryGrid'), true);
    assert.strictEqual(galleryContent.includes('getActiveGalleryItems'), true);
  });

  await t.test('Reviews page handles reviews and does not introduce fake testimonials', () => {
    const reviewsContent = fs.readFileSync(
      path.join(__dirname, '../src/app/reviews/page.tsx'),
      'utf8'
    );
    assert.strictEqual(reviewsContent.includes('getApprovedReviews'), true);
    assert.strictEqual(reviewsContent.includes('Rahul Sharma'), false);
    assert.strictEqual(reviewsContent.includes('Priya Patel'), false);
  });

  await t.test('FAQ page renders FAQAccordion and canonical questions', () => {
    const faqContent = fs.readFileSync(
      path.join(__dirname, '../src/app/faq/page.tsx'),
      'utf8'
    );
    assert.strictEqual(faqContent.includes('<FAQAccordion'), true);
    assert.strictEqual(faqContent.includes('getActiveFAQs'), true);
  });

  await t.test('Service Areas page displays configured coverage zones', () => {
    const serviceAreasContent = fs.readFileSync(
      path.join(__dirname, '../src/app/service-areas/page.tsx'),
      'utf8'
    );
    assert.strictEqual(serviceAreasContent.includes('getActiveServiceAreas'), true);
    assert.strictEqual(serviceAreasContent.includes('Service Zone'), true);
  });

  await t.test('Contact page contains ContactFormUI and direct contact buttons', () => {
    const contactContent = fs.readFileSync(
      path.join(__dirname, '../src/app/contact/page.tsx'),
      'utf8'
    );
    assert.strictEqual(contactContent.includes('<ContactFormUI'), true);
    assert.strictEqual(contactContent.includes('type="call"'), true);
    assert.strictEqual(contactContent.includes('type="whatsapp"'), true);
  });
});
