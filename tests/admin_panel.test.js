const test = require('node:test');
const assert = require('node:assert');
const path = require('path');
const fs = require('fs');

const projectRoot = path.join(__dirname, '..');

test('Owner Admin Portal & Secret Login Verification', async (t) => {
  await t.test('1. Admin auth helper and API routes exist', () => {
    const authLib = path.join(projectRoot, 'src/lib/adminAuth.ts');
    const loginRoute = path.join(projectRoot, 'src/app/api/admin/login/route.ts');
    const logoutRoute = path.join(projectRoot, 'src/app/api/admin/logout/route.ts');
    const enquiriesRoute = path.join(projectRoot, 'src/app/api/admin/enquiries/route.ts');
    const loginPage = path.join(projectRoot, 'src/app/admin/login/page.tsx');
    const adminPage = path.join(projectRoot, 'src/app/admin/page.tsx');

    assert.strictEqual(fs.existsSync(authLib), true, 'src/lib/adminAuth.ts must exist');
    assert.strictEqual(fs.existsSync(loginRoute), true, 'src/app/api/admin/login/route.ts must exist');
    assert.strictEqual(fs.existsSync(logoutRoute), true, 'src/app/api/admin/logout/route.ts must exist');
    assert.strictEqual(fs.existsSync(enquiriesRoute), true, 'src/app/api/admin/enquiries/route.ts must exist');
    assert.strictEqual(fs.existsSync(loginPage), true, 'src/app/admin/login/page.tsx must exist');
    assert.strictEqual(fs.existsSync(adminPage), true, 'src/app/admin/page.tsx must exist');
  });

  await t.test('2. Admin auth module implements secure token generation and validation', () => {
    const authContent = fs.readFileSync(path.join(projectRoot, 'src/lib/adminAuth.ts'), 'utf8');

    assert.strictEqual(authContent.includes('generateAdminToken'), true);
    assert.strictEqual(authContent.includes('verifyAdminSession'), true);
    assert.strictEqual(authContent.includes('validateAdminPassword'), true);
    assert.strictEqual(authContent.includes('ADMIN_COOKIE_NAME'), true);
  });

  await t.test('3. Enquiries API protects routes with session verification', () => {
    const routeContent = fs.readFileSync(
      path.join(projectRoot, 'src/app/api/admin/enquiries/route.ts'),
      'utf8'
    );

    assert.strictEqual(routeContent.includes('verifyAdminSession'), true);
    assert.strictEqual(routeContent.includes('status: 401'), true);
    assert.strictEqual(routeContent.includes('status'), true);
  });

  await t.test('4. Footer component contains the discreet secret staff login button', () => {
    const footerContent = fs.readFileSync(
      path.join(projectRoot, 'src/components/layout/Footer.tsx'),
      'utf8'
    );

    assert.strictEqual(footerContent.includes('/admin/login'), true, 'Footer must link to /admin/login');
    assert.strictEqual(footerContent.includes('Staff'), true, 'Footer must include Staff label');
    assert.strictEqual(footerContent.includes('Lock'), true, 'Footer must use Lock icon');
  });

  await t.test('5. Admin dashboard UI includes filters, search, quick call and WhatsApp actions', () => {
    const pageContent = fs.readFileSync(
      path.join(projectRoot, 'src/app/admin/page.tsx'),
      'utf8'
    );

    assert.strictEqual(pageContent.includes('handleStatusChange'), true);
    assert.strictEqual(pageContent.includes('handleExportCSV'), true);
    assert.strictEqual(pageContent.includes('tel:'), true);
    assert.strictEqual(pageContent.includes('https://wa.me/'), true);
    assert.strictEqual(pageContent.includes('handleLogout'), true);
  });
});
