const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

test('Phase 01 Foundation Verification', async (t) => {
  await t.test('required environment and configuration files exist', () => {
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../.env.example')), true);
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../.gitignore')), true);
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../tsconfig.json')), true);
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../tailwind.config.ts')), true);
  });

  await t.test('database migration script exists', () => {
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../db/migrations/001_initial_schema.sql')), true);
  });

  await t.test('src directories exist', () => {
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../src/app')), true);
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../src/components')), true);
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../src/content')), true);
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../src/lib')), true);
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../src/styles')), true);
    assert.strictEqual(fs.existsSync(path.join(__dirname, '../src/types')), true);
  });
});
