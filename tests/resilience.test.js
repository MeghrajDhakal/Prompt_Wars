import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  CircuitBreaker,
  escapeHTML,
  sanitizeQuery,
  RateLimiter,
  createAppLogger,
  maskPII
} from '../src/resilience.js';

describe('BreakingBreach Resilience & Security Engine (Topics 02, 06, 08, 09, 12)', () => {
  test('CircuitBreaker starts CLOSED and records successes', () => {
    const cb = new CircuitBreaker({ threshold: 3 });
    assert.equal(cb.state, 'CLOSED');
    assert.equal(cb.canAttempt(), true);

    cb.recordSuccess();
    assert.equal(cb.failureCount, 0);
    assert.equal(cb.state, 'CLOSED');
  });

  test('CircuitBreaker trips to OPEN after threshold failures', () => {
    let stateChangeLogged = null;
    const cb = new CircuitBreaker({
      threshold: 3,
      cooldownMs: 500,
      onStateChange: (newState) => { stateChangeLogged = newState; }
    });

    cb.recordFailure();
    assert.equal(cb.state, 'CLOSED');
    cb.recordFailure();
    assert.equal(cb.state, 'CLOSED');

    cb.recordFailure();
    assert.equal(cb.state, 'OPEN', 'Breaker must be OPEN after 3 failures');
    assert.equal(stateChangeLogged, 'OPEN');
    assert.equal(cb.canAttempt(), false, 'Must reject attempts while OPEN during cooldown');
  });

  test('CircuitBreaker recovers to HALF_OPEN after cooldown expires', () => {
    const cooldown = 50;
    const cb = new CircuitBreaker({ threshold: 2, cooldownMs: cooldown });
    const t0 = 1000000;

    cb.recordFailure(t0);
    cb.recordFailure(t0);
    assert.equal(cb.state, 'OPEN');

    // Attempt before cooldown
    assert.equal(cb.canAttempt(t0 + 20), false);

    // Attempt after cooldown
    assert.equal(cb.canAttempt(t0 + cooldown + 1), true);
    assert.equal(cb.state, 'HALF_OPEN');

    // On success in HALF_OPEN, reset to CLOSED
    cb.recordSuccess();
    assert.equal(cb.state, 'CLOSED');
    assert.equal(cb.failureCount, 0);
  });

  test('escapeHTML prevents Cross-Site Scripting (Topic 06)', () => {
    const dangerousInput = '<script>alert("hacked")</script>&<img src=x onerror=alert(1)>';
    const escaped = escapeHTML(dangerousInput);
    assert.ok(!escaped.includes('<script>'));
    assert.ok(escaped.includes('&lt;script&gt;'));
    assert.ok(escaped.includes('&amp;'));
    assert.ok(escaped.includes('&quot;hacked&quot;'));
  });

  test('sanitizeQuery strips control characters and enforces length limits', () => {
    const nastyQuery = 'Luxury Tote \x00\x1F Bag \n with injection ';
    const clean = sanitizeQuery(nastyQuery, 20);
    assert.ok(!clean.includes('\x00'));
    assert.ok(!clean.includes('\x1F'));
    assert.ok(clean.length <= 20);
  });

  test('RateLimiter enforces token limits under bursts (Topic 12)', () => {
    const limiter = new RateLimiter(3, 1); // 3 capacity, 1 per sec
    assert.equal(limiter.tryConsume(), true);
    assert.equal(limiter.tryConsume(), true);
    assert.equal(limiter.tryConsume(), true);
    assert.equal(limiter.tryConsume(), false, 'Burst limit exceeded');
  });

  test('Structured JSON logger outputs correlated telemetry with masked PII (Topic 09, 08)', () => {
    const logs = [];
    const logger = createAppLogger('1.0.0', (_prefix, jsonStr) => {
      logs.push(JSON.parse(jsonStr));
    });

    logger.info('CHECKOUT_COMPLETED', {
      email: 'client@example.com',
      idempotencyKey: 'idem_secret_key_12345',
      orderId: '#LEC-1001'
    });

    assert.equal(logs.length, 1);
    const entry = logs[0];
    assert.equal(entry.level, 'INFO');
    assert.equal(entry.event, 'CHECKOUT_COMPLETED');
    assert.ok(entry.requestId.startsWith('req_'));
    assert.ok(entry.timestamp);
    assert.equal(entry.email, 'cl•••@example.com');
    assert.ok(!entry.email.includes('client'));
    assert.ok(entry.idempotencyKey.includes('••••'));
  });
});
