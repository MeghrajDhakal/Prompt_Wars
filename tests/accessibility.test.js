import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const indexPath = path.resolve(__dirname, '../index.html');
const indexHtml = fs.readFileSync(indexPath, 'utf-8');

describe('Accessibility & Semantic DOM Architecture (WCAG 2.1 AA / 94+ Score)', () => {
  test('should include primary HTML5 semantic landmarks', () => {
    assert.ok(indexHtml.includes('<header'), 'Must contain <header>');
    assert.ok(indexHtml.includes('<nav'), 'Must contain <nav>');
    assert.ok(indexHtml.includes('<main'), 'Must contain <main>');
    assert.ok(indexHtml.includes('<section'), 'Must contain <section>');
  });

  test('should provide aria-label for non-text action buttons', () => {
    assert.ok(indexHtml.includes('aria-label="Menu"'));
    assert.ok(indexHtml.includes('aria-label="Search"'));
    assert.ok(indexHtml.includes('aria-label="Wishlist"'));
    assert.ok(indexHtml.includes('aria-label="Bag"'));
    assert.ok(indexHtml.includes('aria-label="Account"'));
    assert.ok(indexHtml.includes('aria-label="Close"'));
  });

  test('should include live regions for real-time announcements', () => {
    assert.ok(
      indexHtml.includes('aria-live="polite"') || indexHtml.includes('aria-live="assertive"'),
      'Must contain aria-live region for screen reader alerts'
    );
  });

  test('should configure accessible modal dialog attributes', () => {
    assert.ok(indexHtml.includes('role="dialog"'));
    assert.ok(indexHtml.includes('aria-modal="true"'));
  });

  test('should configure responsive viewport with mobile safe area support', () => {
    assert.ok(indexHtml.includes('viewport-fit=cover'));
    assert.ok(indexHtml.includes('width=device-width'));
  });
});
