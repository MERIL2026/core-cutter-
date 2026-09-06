const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');

test('Phase 08 SEO, Analytics & Performance Verification', async (t) => {
  await t.test('sitemap, robots, and SEO files exist', () => {
    assert.strictEqual(fs.existsSync(path.join(projectRoot, 'src/app/sitemap.ts')), true);
    assert.strictEqual(fs.existsSync(path.join(projectRoot, 'src/app/robots.ts')), true);
    assert.strictEqual(fs.existsSync(path.join(projectRoot, 'src/lib/seo/structuredData.ts')), true);
    assert.strictEqual(fs.existsSync(path.join(projectRoot, 'src/components/seo/JsonLd.tsx')), true);
    assert.strictEqual(fs.existsSync(path.join(projectRoot, 'src/lib/analytics.ts')), true);
    assert.strictEqual(fs.existsSync(path.join(projectRoot, 'src/components/analytics/PageViewTracker.tsx')), true);
  });

  await t.test('sitemap.ts includes all canonical public routes and excludes api/showcase', () => {
    const sitemapContent = fs.readFileSync(
      path.join(projectRoot, 'src/app/sitemap.ts'),
      'utf8'
    );

    assert.strictEqual(sitemapContent.includes('getActiveServices'), true);
    assert.strictEqual(sitemapContent.includes("priority: 1.0"), true);
    assert.strictEqual(sitemapContent.includes('/services'), true);
    assert.strictEqual(sitemapContent.includes('/about'), true);
    assert.strictEqual(sitemapContent.includes('/service-areas'), true);
    assert.strictEqual(sitemapContent.includes('/gallery'), true);
    assert.strictEqual(sitemapContent.includes('/reviews'), true);
    assert.strictEqual(sitemapContent.includes('/faq'), true);
    assert.strictEqual(sitemapContent.includes('/contact'), true);
    assert.strictEqual(sitemapContent.includes('/showcase'), false);
    assert.strictEqual(sitemapContent.includes('/api/'), false);
  });

  await t.test('robots.ts disallows api and showcase while allowing public crawl', () => {
    const robotsContent = fs.readFileSync(
      path.join(projectRoot, 'src/app/robots.ts'),
      'utf8'
    );

    assert.strictEqual(robotsContent.includes("allow: '/'"), true);
    assert.strictEqual(robotsContent.includes("'/api/'"), true);
    assert.strictEqual(robotsContent.includes("'/showcase'"), true);
    assert.strictEqual(robotsContent.includes('sitemap.xml'), true);
  });

  await t.test('structuredData.ts generates schema from canonical data without fake ratings', () => {
    const schemaContent = fs.readFileSync(
      path.join(projectRoot, 'src/lib/seo/structuredData.ts'),
      'utf8'
    );

    assert.strictEqual(schemaContent.includes('LocalBusiness'), true);
    assert.strictEqual(schemaContent.includes('generateServiceSchema'), true);
    assert.strictEqual(schemaContent.includes('generateFAQSchema'), true);
    assert.strictEqual(schemaContent.includes('generateBreadcrumbSchema'), true);
    assert.strictEqual(schemaContent.includes('aggregateRating'), false, 'Must not fabricate fake aggregate ratings');
  });

  await t.test('analytics.ts defines allowlist and strictly sanitizes PII', () => {
    const analyticsContent = fs.readFileSync(
      path.join(projectRoot, 'src/lib/analytics.ts'),
      'utf8'
    );

    const expectedEvents = [
      'page_view',
      'phone_click',
      'whatsapp_click',
      'quote_start',
      'quote_submit',
      'map_click',
      'service_cta_click',
    ];

    expectedEvents.forEach((ev) => {
      assert.strictEqual(
        analyticsContent.includes(`'${ev}'`),
        true,
        `Analytics must support allowlisted event '${ev}'`
      );
    });

    assert.strictEqual(analyticsContent.includes('sanitizeMetadata'), true);
    assert.strictEqual(analyticsContent.includes('forbiddenKeys'), true);
    assert.strictEqual(analyticsContent.includes('phone'), true);
    assert.strictEqual(analyticsContent.includes('address'), true);
    assert.strictEqual(analyticsContent.includes('message'), true);
  });

  await t.test('all public pages export canonical URL alternates', () => {
    const pages = [
      { path: 'src/app/page.tsx', canonical: '/' },
      { path: 'src/app/services/page.tsx', canonical: '/services' },
      { path: 'src/app/services/[slug]/page.tsx', canonical: '/services/' },
      { path: 'src/app/about/page.tsx', canonical: '/about' },
      { path: 'src/app/gallery/page.tsx', canonical: '/gallery' },
      { path: 'src/app/reviews/page.tsx', canonical: '/reviews' },
      { path: 'src/app/faq/page.tsx', canonical: '/faq' },
      { path: 'src/app/service-areas/page.tsx', canonical: '/service-areas' },
      { path: 'src/app/contact/page.tsx', canonical: '/contact' },
    ];

    pages.forEach((p) => {
      const content = fs.readFileSync(path.join(projectRoot, p.path), 'utf8');
      assert.strictEqual(
        content.includes('canonical:'),
        true,
        `Page ${p.path} must specify a canonical URL`
      );
    });
  });

  await t.test('showcase page explicitly declares robots noindex', () => {
    const showcaseContent = fs.readFileSync(
      path.join(projectRoot, 'src/app/showcase/page.tsx'),
      'utf8'
    );
    assert.strictEqual(showcaseContent.includes('index: false'), true);
    assert.strictEqual(showcaseContent.includes('follow: false'), true);
  });

  await t.test('RootLayout embeds LocalBusiness JSON-LD and PageViewTracker', () => {
    const layoutContent = fs.readFileSync(
      path.join(projectRoot, 'src/app/layout.tsx'),
      'utf8'
    );
    assert.strictEqual(layoutContent.includes('LocalBusiness'), true);
    assert.strictEqual(layoutContent.includes('<JsonLd'), true);
    assert.strictEqual(layoutContent.includes('<PageViewTracker'), true);
  });

  await t.test('ContactFormUI only fires quote_submit after confirmed server 201 response', () => {
    const formContent = fs.readFileSync(
      path.join(projectRoot, 'src/components/forms/ContactFormUI.tsx'),
      'utf8'
    );
    assert.strictEqual(formContent.includes("event_name: 'quote_start'"), true);
    assert.strictEqual(formContent.includes("event_name: 'quote_submit'"), true);
    assert.strictEqual(formContent.includes('response.status === 201'), true);
  });
});
