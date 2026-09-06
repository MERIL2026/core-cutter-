const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

test('Phase 05 Services Module Verification', async (t) => {
  await t.test('services index and dynamic detail route files exist', () => {
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../src/app/services/page.tsx')), true);
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../src/app/services/[slug]/page.tsx')), true);
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../src/app/not-found.tsx')), true);
  });

  await t.test('reusable service detail components exist under src/components/services', () => {
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../src/components/services/ServiceDetailTemplate.tsx')), true);
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../src/components/services/ServiceHero.tsx')), true);
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../src/components/services/ServiceOverview.tsx')), true);
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../src/components/services/ServiceBenefits.tsx')), true);
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../src/components/services/ServiceProcess.tsx')), true);
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../src/components/services/RelatedServices.tsx')), true);
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../src/components/services/ServiceFAQ.tsx')), true);
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../src/components/services/ServiceCTA.tsx')), true);
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../src/components/services/index.ts')), true);
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../src/components/ui/Breadcrumbs.tsx')), true);
  });

  await t.test('all six canonical service slugs are present and generated in dynamic route', () => {
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

    const dynamicRouteContent = fs.readFileSync(
      path.join(__dirname, '../src/app/services/[slug]/page.tsx'),
      'utf8'
    );

    assert.strictEqual(dynamicRouteContent.includes('generateStaticParams'), true);
    assert.strictEqual(dynamicRouteContent.includes('generateMetadata'), true);
    assert.strictEqual(dynamicRouteContent.includes('notFound()'), true);
  });

  await t.test('ServiceHero component contains exactly one H1 and Breadcrumbs', () => {
    const heroContent = fs.readFileSync(
      path.join(__dirname, '../src/components/services/ServiceHero.tsx'),
      'utf8'
    );

    const h1Matches = heroContent.match(/<h1[\s\S]*?<\/h1>/g);
    assert.strictEqual(h1Matches && h1Matches.length === 1, true, 'ServiceHero must contain exactly one H1');
    assert.strictEqual(heroContent.includes('<Breadcrumbs'), true);
    assert.strictEqual(heroContent.includes('type="quote"'), true);
    assert.strictEqual(heroContent.includes('type="call"'), true);
    assert.strictEqual(heroContent.includes('type="whatsapp"'), true);
  });

  await t.test('Breadcrumbs component uses semantic navigation markup', () => {
    const breadcrumbsContent = fs.readFileSync(
      path.join(__dirname, '../src/components/ui/Breadcrumbs.tsx'),
      'utf8'
    );

    assert.strictEqual(breadcrumbsContent.includes('aria-label="Breadcrumb"'), true);
    assert.strictEqual(breadcrumbsContent.includes('<ol'), true);
    assert.strictEqual(breadcrumbsContent.includes('<li'), true);
  });

  await t.test('Services index page contains single H1, canonical services grid, and guidance', () => {
    const indexContent = fs.readFileSync(
      path.join(__dirname, '../src/app/services/page.tsx'),
      'utf8'
    );

    const h1Matches = indexContent.match(/<h1[\s\S]*?<\/h1>/g);
    assert.strictEqual(h1Matches && h1Matches.length === 1, true, 'Services index must contain exactly one H1');
    assert.strictEqual(indexContent.includes('<ServiceCard'), true);
    assert.strictEqual(indexContent.includes('Why Professional Core Cutting is Essential'), true);
    assert.strictEqual(indexContent.includes('Not Sure Which Service You Need?'), true);
  });
});
