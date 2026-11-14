/**
 * @fileoverview Atelier Client Authentication & Session Management
 * Implements BreakingBreach Topic 04 (Authentication & Sessions), Topic 05 (Access Control),
 * and Topic 08 (Personal and Sensitive Data Protection).
 * @module auth
 */

import { maskPII } from './resilience.js';

/**
 * Pre-seeded VIP Client Demo Accounts
 */
export const VIP_ACCOUNTS = [
  {
    id: 'usr_vip_001',
    name: 'Elena Vance',
    email: 'elena.vance@atelier-luxe.com',
    password: 'password123',
    role: 'VIP_PATRON',
    tier: 'Platinum Tier Patron',
    memberSince: '2024-03-15'
  },
  {
    id: 'usr_vip_002',
    name: 'Julian Thorne',
    email: 'julian.thorne@atelier-luxe.com',
    password: 'password123',
    role: 'VIP_PATRON',
    tier: 'Gold Tier Patron',
    memberSince: '2024-08-20'
  },
  {
    id: 'usr_curator_003',
    name: 'Atelier Curator',
    email: 'curator@atelier-luxe.com',
    password: 'password123',
    role: 'CURATOR_ADMIN',
    tier: 'Atelier Director',
    memberSince: '2023-01-10'
  }
];

/**
 * Validates credentials and creates an authenticated session.
 *
 * @param {string} email
 * @param {string} password
 * @param {number} [sessionDurationMs=86400000] Default 24 hours
 * @returns {{ success: boolean, session?: Object, error?: string }}
 */
export function authenticate(email, password, sessionDurationMs = 86400000) {
  if (!email || !password) {
    return { success: false, error: 'Email and password are required.' };
  }

  const cleanEmail = email.trim().toLowerCase();
  const account = VIP_ACCOUNTS.find(acc => acc.email.toLowerCase() === cleanEmail);

  if (!account || account.password !== password) {
    return { success: false, error: 'Invalid client credentials. Use demo VIP credentials.' };
  }

  const now = Date.now();
  const sessionToken = 'lec_tok_' + Math.random().toString(36).substring(2, 14) + Date.now().toString(36);

  const session = {
    sessionId: sessionToken,
    id: sessionToken,
    userId: account.id,
    name: account.name,
    email: account.email,
    role: account.role,
    tier: account.tier,
    memberSince: account.memberSince,
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + sessionDurationMs).toISOString()
  };

  return { success: true, session };
}

/**
 * Validates if an existing session is still active and unexpired.
 *
 * @param {Object} session
 * @param {number} [now=Date.now()]
 * @returns {boolean}
 */
export function isSessionValid(session, now = Date.now()) {
  if (!session || !session.sessionId || !session.expiresAt) {
    return false;
  }
  const expiry = new Date(session.expiresAt).getTime();
  return expiry > now;
}

/**
 * Access control policy enforcement (BreakingBreach Topic 05).
 *
 * @param {Object} session
 * @param {string|string[]} allowedRoles
 * @returns {boolean}
 */
export function checkAccess(session, allowedRoles) {
  if (!session || !isSessionValid(session)) return false;
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return roles.includes(session.role);
}

/**
 * Sanitizes session details for client display or logging (Topic 08).
 *
 * @param {Object} session
 * @returns {Object}
 */
export function getMaskedSessionView(session) {
  if (!session) return null;
  return {
    name: session.name,
    email: maskPII(session.email),
    tier: session.tier,
    sessionId: maskPII(session.sessionId),
    role: session.role
  };
}
