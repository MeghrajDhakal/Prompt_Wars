import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { createLEC_Database } from '../src/db.js';
import { createDispatchedOrder, calculateCartTotals } from '../src/storefront.js';

describe('Checkout & Product Dispatch Flow (User Requirement & Topic 03)', () => {
  let db;

  beforeEach(() => {
    db = createLEC_Database();
    db.init();
  });

  test('should create dispatched order with status DISPATCHED upon Stripe checkout', () => {
    const products = db.getProducts();
    const activeCart = [
      { id: 'p1', quantity: 1 },
      { id: 'p2', quantity: 2 }
    ];
    const idempotencyKey = 'idem_checkout_test_abc123';

    const order = createDispatchedOrder(activeCart, products, idempotencyKey, '#LEC-2026-9999');

    assert.equal(order.status, 'DISPATCHED', 'Order status must be DISPATCHED');
    assert.equal(order.payment_provider, 'stripe');
    assert.equal(order.idempotency_key, idempotencyKey);
    assert.equal(order.items.length, 2);

    const item1 = order.items.find(i => i.product_id === 'p1');
    assert.equal(item1.sku, 'LEC-ACC-001');
    assert.equal(item1.unit_price, 613.77);

    // Save order in database
    db.createOrder(order);

    // Verify dispatched product tracking
    const dispatchedSet = db.getDispatchedProductIds();
    assert.ok(dispatchedSet.has('p1'), 'p1 must be in dispatched list');
    assert.ok(dispatchedSet.has('p2'), 'p2 must be in dispatched list');
  });

  test('should reject checkout on empty cart', () => {
    const products = db.getProducts();
    assert.throws(
      () => createDispatchedOrder([], products, 'idem_empty'),
      /Cannot checkout with an empty cart/
    );
  });

  test('should accurately calculate taxes and qualified free shipping on dispatched order', () => {
    const products = db.getProducts();
    // p1 ($613.77) exceeds free shipping threshold of $250
    const cart = [{ id: 'p1', quantity: 1 }];
    const totals = calculateCartTotals(cart, products);

    assert.equal(totals.subtotal, 613.77);
    assert.equal(totals.shipping, 0.00, 'Orders over $250 qualify for complimentary shipping');
    assert.equal(totals.tax, 49.10); // 613.77 * 0.08 = 49.1016 -> 49.10
    assert.equal(totals.total, 662.87);
  });

  test('should apply standard shipping if order subtotal is below $250 threshold', () => {
    const products = db.getProducts();
    // p5 ($61.50) is below $250
    const cart = [{ id: 'p5', quantity: 1 }];
    const totals = calculateCartTotals(cart, products);

    assert.equal(totals.subtotal, 61.50);
    assert.equal(totals.shipping, 25.00, 'Orders under $250 must incur $25 standard shipping');
    assert.equal(totals.tax, 4.92);
    assert.equal(totals.total, 91.42);
    assert.equal(totals.hasFreeShipping, false);
    assert.equal(totals.freeShippingDelta, 188.50);
  });
});
