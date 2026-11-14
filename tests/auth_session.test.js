import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { authenticate, isSessionValid, checkAccess, getMaskedSessionView, VIP_ACCOUNTS } from '../src/auth.js';
import { maskPII } from '../src/resilience.js';

describe('Client Authentication & Session Lifecycle (Topic 04, 05, 08)', () => {
  test('should authenticate pre-seeded VIP patron successfully', () => {
    const res = authenticate('elena.vance@atelier-luxe.com', 'password123');
    assert.equal(res.success, true);
    assert.ok(res.session);
    assert.equal(res.session.name, 'Elena Vance');
    assert.equal(res.session.role, 'VIP_PATRON');
    assert.ok(res.session.sessionId.startsWith('lec_tok_'));
    assert.ok(new Date(res.session.expiresAt) > new Date());
  });

  test('should reject incorrect password', () => {
    const res = authenticate('elena.vance@atelier-luxe.com', 'wrongpassword');
    assert.equal(res.success, false);
    assert.match(res.error, /Invalid client credentials/);
  });

  test('should reject non-existent user email', () => {
    const res = authenticate('intruder@unknown.com', 'password123');
    assert.equal(res.success, false);
    assert.match(res.error, /Invalid client credentials/);
  });

  test('should validate active unexpired session', () => {
    const authResult = authenticate('julian.thorne@atelier-luxe.com', 'password123');
    assert.equal(isSessionValid(authResult.session), true);

    const expiredSession = {
      ...authResult.session,
      expiresAt: new Date(Date.now() - 1000).toISOString()
    };
    assert.equal(isSessionValid(expiredSession), false);
  });

  test('should enforce role-based access control (Topic 05)', () => {
    const patron = authenticate('elena.vance@atelier-luxe.com', 'password123').session;
    const curator = authenticate('curator@atelier-luxe.com', 'password123').session;

    assert.equal(checkAccess(patron, 'VIP_PATRON'), true);
    assert.equal(checkAccess(patron, 'CURATOR_ADMIN'), false);

    assert.equal(checkAccess(curator, 'CURATOR_ADMIN'), true);
    assert.equal(checkAccess(curator, ['CURATOR_ADMIN', 'VIP_PATRON']), true);
  });

  test('should mask PII in email and session views (Topic 08)', () => {
    const rawEmail = 'elena.vance@atelier-luxe.com';
    const masked = maskPII(rawEmail);
    assert.equal(masked, 'el•••@atelier-luxe.com');
    assert.ok(!masked.includes('vance'));

    const authResult = authenticate('elena.vance@atelier-luxe.com', 'password123');
    const view = getMaskedSessionView(authResult.session);
    assert.equal(view.email, 'el•••@atelier-luxe.com');
    assert.ok(view.sessionId.includes('••••'));
  });
});
