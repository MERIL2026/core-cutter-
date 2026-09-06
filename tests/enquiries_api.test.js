const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');

test('Phase 07 Enquiry & Lead Backend Verification', async (t) => {
  await t.test('enquiries API route and validation files exist', () => {
    const routePath = path.join(projectRoot, 'src/app/api/enquiries/route.ts');
    const validationPath = path.join(projectRoot, 'src/lib/validations/enquiry.ts');
    const rateLimitPath = path.join(projectRoot, 'src/lib/rateLimit.ts');

    assert.strictEqual(fs.existsSync(routePath), true, 'src/app/api/enquiries/route.ts must exist');
    assert.strictEqual(fs.existsSync(validationPath), true, 'src/lib/validations/enquiry.ts must exist');
    assert.strictEqual(fs.existsSync(rateLimitPath), true, 'src/lib/rateLimit.ts must exist');
  });

  await t.test('rate limiter implementation file exists and contains sliding window logic', () => {
    const rateLimitContent = fs.readFileSync(
      path.join(projectRoot, 'src/lib/rateLimit.ts'),
      'utf8'
    );

    assert.strictEqual(rateLimitContent.includes('checkRateLimit'), true);
    assert.strictEqual(rateLimitContent.includes('rateLimitStore'), true);
    assert.strictEqual(rateLimitContent.includes('maxRequests'), true);
    assert.strictEqual(rateLimitContent.includes('windowMs'), true);
    assert.strictEqual(rateLimitContent.includes('purgeStaleRecords'), true);
  });

  await t.test('validation schema file checks name, phone, service, location, and message bounds', () => {
    const validationContent = fs.readFileSync(
      path.join(projectRoot, 'src/lib/validations/enquiry.ts'),
      'utf8'
    );

    assert.strictEqual(validationContent.includes('createEnquirySchema'), true);
    assert.strictEqual(validationContent.includes('allowedServiceSlugs'), true);
    assert.strictEqual(validationContent.includes('phoneRegex'), true);
    assert.strictEqual(validationContent.includes('.min(2'), true);
    assert.strictEqual(validationContent.includes('.max(120'), true);
    assert.strictEqual(validationContent.includes('.max(2000'), true);
    assert.strictEqual(validationContent.includes('honeypot'), true);
  });

  await t.test('API route file enforces status=new and safe error handling', () => {
    const routeContent = fs.readFileSync(
      path.join(projectRoot, 'src/app/api/enquiries/route.ts'),
      'utf8'
    );

    assert.strictEqual(
      routeContent.includes("'new'"),
      true,
      "API route must strictly insert status as 'new'"
    );
    assert.strictEqual(
      routeContent.includes('checkRateLimit'),
      true,
      'API route must invoke checkRateLimit'
    );
    assert.strictEqual(
      routeContent.includes('honeypot'),
      true,
      'API route must inspect honeypot parameter'
    );
    assert.strictEqual(
      routeContent.includes('429'),
      true,
      'API route must support 429 rate limit response'
    );
    assert.strictEqual(
      routeContent.includes('201'),
      true,
      'API route must return 201 on success'
    );
    assert.strictEqual(
      routeContent.includes("from '@/lib/db'"),
      true,
      'API route must use database query helper from @/lib/db'
    );
    assert.strictEqual(
      routeContent.includes('NextResponse.json'),
      true,
      'API route must return standard Next.js JSON responses'
    );
  });

  await t.test('ContactFormUI connects to /api/enquiries and contains honeypot & fallback CTAs', () => {
    const formContent = fs.readFileSync(
      path.join(projectRoot, 'src/components/forms/ContactFormUI.tsx'),
      'utf8'
    );

    assert.strictEqual(
      formContent.includes('/api/enquiries'),
      true,
      'ContactFormUI must submit to /api/enquiries'
    );
    assert.strictEqual(
      formContent.includes('website_hp_field'),
      true,
      'ContactFormUI must include anti-bot honeypot field'
    );
    assert.strictEqual(
      formContent.includes('429'),
      true,
      'ContactFormUI must handle 429 rate limiting status'
    );
    assert.strictEqual(
      formContent.includes('role="alert"'),
      true,
      'ContactFormUI must maintain accessible alert roles'
    );
    assert.strictEqual(
      formContent.includes('isSubmitting'),
      true,
      'ContactFormUI must disable duplicate submit during in-flight submission'
    );
  });
});
