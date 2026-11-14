/**
 * @fileoverview BreakingBreach Resilience & Security Module
 * Implements Topic 02 (Timeouts & Circuit Breakers), Topic 03 (Idempotency),
 * Topic 06 (Input Sanitization/Injection Prevention), Topic 08 (PII Protection),
 * Topic 09 (Structured Correlated Logging), and Topic 12 (Capacity/Rate Limiting).
 * @module resilience
 */

/**
 * Mask Personally Identifiable Information (PII) such as emails and secret keys.
 * BreakingBreach Topic 08: Personal and Sensitive Data.
 *
 * @param {string} text - Raw input text or identifier.
 * @returns {string} Redacted string masking private characters.
 */
export function maskPII(text) {
  if (!text) return '';
  const str = typeof text !== 'string' ? String(text) : text;
  if (str.includes('@')) {
    const parts = str.split('@');
    const user = parts[0];
    const maskedUser = user.length > 2 ? user.slice(0, 2) + '•••' : user + '•••';
    return `${maskedUser}@${parts[1]}`;
  }
  if (str.length <= 4) {
    return '••••';
  }
  return `${str.slice(0, 2)}••••${str.slice(-2)}`;
}

/**
 * Escapes unsafe HTML characters to prevent Cross-Site Scripting (XSS).
 * BreakingBreach Topic 06: Input Handling and Injection.
 *
 * @param {string} str - Raw input string.
 * @returns {string} Sanitized string safe for HTML rendering.
 */
export function escapeHTML(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Truncates and strips dangerous control characters from user queries.
 * BreakingBreach Topic 06 & Topic 12: Input Limits and Capacity Protection.
 *
 * @param {string} str - Query string.
 * @param {number} [maxLength=80] - Maximum allowed character length.
 * @returns {string} Cleaned query string.
 */
export function sanitizeQuery(str, maxLength = 80) {
  if (!str || typeof str !== 'string') return '';
  // Strip null bytes and non-printable control characters
  return str.replace(/[\x00-\x1F\x7F]/g, '').slice(0, maxLength).trim();
}

/**
 * Circuit Breaker state machine protecting downstream external services.
 * BreakingBreach Topic 02: External Service Calls (Timeouts & Circuit Breakers).
 */
export class CircuitBreaker {
  /**
   * @param {Object} options
   * @param {number} [options.threshold=3] - Consecutive failures before opening breaker.
   * @param {number} [options.cooldownMs=15000] - Duration in ms to stay OPEN before HALF_OPEN.
   * @param {Function} [options.onStateChange] - Listener for state changes.
   */
  constructor({ threshold = 3, cooldownMs = 15000, onStateChange = null } = {}) {
    this.threshold = threshold;
    this.cooldownMs = cooldownMs;
    this.failureCount = 0;
    this.state = 'CLOSED'; // 'CLOSED' | 'OPEN' | 'HALF_OPEN'
    this.lastFailureTime = 0;
    this.onStateChange = onStateChange;
  }

  /**
   * Checks whether a request can be attempted.
   * @param {number} [now=Date.now()]
   * @returns {boolean} True if allowed to proceed.
   */
  canAttempt(now = Date.now()) {
    if (this.state === 'OPEN') {
      if (now - this.lastFailureTime > this.cooldownMs) {
        this.transitionTo('HALF_OPEN');
        return true;
      }
      return false;
    }
    return true;
  }

  /**
   * Records a successful operation, resetting counters to CLOSED.
   */
  recordSuccess() {
    this.failureCount = 0;
    if (this.state !== 'CLOSED') {
      this.transitionTo('CLOSED');
    }
  }

  /**
   * Records a failure, incrementing counters and potentially opening the circuit.
   * @param {number} [now=Date.now()]
   */
  recordFailure(now = Date.now()) {
    this.failureCount++;
    this.lastFailureTime = now;
    if (this.state === 'HALF_OPEN' || this.failureCount >= this.threshold) {
      this.transitionTo('OPEN');
    }
  }

  /**
   * Internal transition method.
   * @param {'CLOSED' | 'OPEN' | 'HALF_OPEN'} newState
   */
  transitionTo(newState) {
    const oldState = this.state;
    this.state = newState;
    if (this.onStateChange && oldState !== newState) {
      this.onStateChange(newState, oldState);
    }
  }
}

/**
 * Executes a network call with an AbortController timeout and Circuit Breaker guarding.
 *
 * @param {Function} fetchFn - Fetch implementation (window.fetch or node fetch).
 * @param {string} url - Target URL.
 * @param {Object} [options={}] - Request options.
 * @param {number} [timeoutMs=6000] - Timeout in milliseconds.
 * @param {CircuitBreaker} [breaker] - Optional circuit breaker instance.
 * @returns {Promise<Response>}
 */
export async function safeFetchWithTimeout(fetchFn, url, options = {}, timeoutMs = 6000, breaker = null) {
  if (breaker && !breaker.canAttempt()) {
    throw new Error('Circuit breaker is OPEN. Fast failing request.');
  }

  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const signal = controller ? controller.signal : undefined;
  const timeoutId = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;

  try {
    const res = await fetchFn(url, { ...options, signal });
    if (timeoutId) clearTimeout(timeoutId);
    if (breaker) breaker.recordSuccess();
    return res;
  } catch (err) {
    if (timeoutId) clearTimeout(timeoutId);
    if (breaker) breaker.recordFailure();
    throw err;
  }
}

/**
 * Token bucket rate limiter preventing abuse and capacity exhaustion.
 * BreakingBreach Topic 12: Load and Capacity.
 */
export class RateLimiter {
  /**
   * @param {number} maxTokens - Bucket capacity.
   * @param {number} refillRatePerSec - Tokens added per second.
   */
  constructor(maxTokens = 10, refillRatePerSec = 2) {
    this.maxTokens = maxTokens;
    this.refillRatePerSec = refillRatePerSec;
    this.tokens = maxTokens;
    this.lastRefill = Date.now();
  }

  /**
   * Consumes one token if available.
   * @param {number} [now=Date.now()]
   * @returns {boolean} True if consumed, false if rate limited.
   */
  tryConsume(now = Date.now()) {
    const elapsedSec = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(this.maxTokens, this.tokens + elapsedSec * this.refillRatePerSec);
    this.lastRefill = now;

    if (this.tokens >= 1) {
      this.tokens -= 1;
      return true;
    }
    return false;
  }
}

/**
 * Correlated Structured JSON Logger.
 * BreakingBreach Topic 09: Logging and Monitoring.
 *
 * @param {string} version - Semantic version of application.
 * @param {Function} [writer=console.log] - Log output writer.
 * @returns {Object} Structured logger instance.
 */
export function createAppLogger(version = '1.0.0', writer = console.log) {
  const sessionId = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : 'sess_' + Math.random().toString(36).substring(2, 10);

  return {
    sessionId,
    getRequestId() {
      return typeof crypto !== 'undefined' && crypto.randomUUID
        ? 'req_' + crypto.randomUUID().slice(0, 8)
        : 'req_' + Math.random().toString(36).substring(2, 10);
    },
    log(level, event, metadata = {}) {
      const sanitizedMeta = { ...metadata };
      if (sanitizedMeta.idempotencyKey) {
        sanitizedMeta.idempotencyKey = maskPII(sanitizedMeta.idempotencyKey);
      }
      if (sanitizedMeta.email) {
        sanitizedMeta.email = maskPII(sanitizedMeta.email);
      }
      const payload = {
        timestamp: new Date().toISOString(),
        version,
        sessionId: maskPII(this.sessionId),
        requestId: this.getRequestId(),
        level,
        event,
        ...sanitizedMeta
      };
      writer(`[BreakingBreach:${level}]`, JSON.stringify(payload));
      return payload;
    },
    info(event, meta) { return this.log('INFO', event, meta); },
    warn(event, meta) { return this.log('WARN', event, meta); },
    error(event, meta) { return this.log('ERROR', event, meta); }
  };
}
