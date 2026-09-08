const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');

test('EmailJS Lead Notification Integration Tests', async (t) => {
  await t.test('emailjs.ts utility exists and defines robust email dispatch logic', () => {
    const emailJsPath = path.join(projectRoot, 'src/lib/emailjs.ts');
    assert.strictEqual(fs.existsSync(emailJsPath), true, 'src/lib/emailjs.ts must exist');

    const content = fs.readFileSync(emailJsPath, 'utf8');
    assert.strictEqual(content.includes('export async function sendNewEnquiryEmail'), true);
    assert.strictEqual(content.includes('https://api.emailjs.com/api/v1.0/email/send'), true);
    assert.strictEqual(content.includes('EMAILJS_SERVICE_ID'), true);
    assert.strictEqual(content.includes('EMAILJS_TEMPLATE_ID'), true);
    assert.strictEqual(content.includes('EMAILJS_PUBLIC_KEY'), true);
    assert.strictEqual(content.includes('customer_name'), true);
    assert.strictEqual(content.includes('whatsapp_link'), true);
    assert.strictEqual(content.includes('phone_link'), true);
  });

  await t.test('API route calls sendNewEnquiryEmail on valid submissions', () => {
    const routePath = path.join(projectRoot, 'src/app/api/enquiries/route.ts');
    const content = fs.readFileSync(routePath, 'utf8');

    assert.strictEqual(content.includes('sendNewEnquiryEmail'), true, 'route.ts must import and call sendNewEnquiryEmail');
    assert.strictEqual(content.includes('if (!isBot)'), true, 'route.ts must skip spam honeypots from triggering emails');
  });

  await t.test('.env.example includes complete EmailJS configuration documentation', () => {
    const envExamplePath = path.join(projectRoot, '.env.example');
    const content = fs.readFileSync(envExamplePath, 'utf8');

    assert.strictEqual(content.includes('EMAILJS_SERVICE_ID'), true);
    assert.strictEqual(content.includes('EMAILJS_TEMPLATE_ID'), true);
    assert.strictEqual(content.includes('EMAILJS_PUBLIC_KEY'), true);
    assert.strictEqual(content.includes('EMAILJS_TO_EMAIL'), true);
  });
});
