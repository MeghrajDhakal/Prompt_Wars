import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { createLEC_Database, SS26_PRODUCTS } from '../src/db.js';

describe('LEC_Database Relational Client Engine (BreakingBreach Topic 01, 03, 11)', () => {
  let db;

  beforeEach(() => {
    db = createLEC_Database();
    db.init();
  });

  test('should initialize with standard SS26 Capsule catalog', () => {
    const products = db.getProducts();
    assert.equal(products.length, 7, 'Catalog should contain all 7 SS26 items');
    assert.equal(products[0].sku, 'LEC-ACC-001');
    assert.equal(products[0].isCuratorsPick, true);
  });

  test('should retrieve product by specific ID', () => {
    const p1 = db.getProductById('p1');
    assert.ok(p1, 'Product p1 should be found');
    assert.equal(p1.name, 'Azure Drift');
    assert.equal(p1.price, 613.77);

    const nonExistent = db.getProductById('p999');
    assert.equal(nonExistent, null);
  });

  test('should persist and retrieve cart items', () => {
    const initialCart = db.getCart();
    assert.ok(Array.isArray(initialCart));

    const testCart = [{ id: 'p1', quantity: 2 }, { id: 'p3', quantity: 1 }];
    db.saveCart(testCart);

    const updatedCart = db.getCart();
    assert.equal(updatedCart.length, 2);
    assert.equal(updatedCart[0].id, 'p1');
    assert.equal(updatedCart[0].quantity, 2);
  });

  test('should persist and retrieve wishlist items as a Set', () => {
    const testWishlist = new Set(['p2', 'p4', 'p6']);
    db.saveWishlist(testWishlist);

    const retrievedWishlist = db.getWishlist();
    assert.ok(retrievedWishlist instanceof Set);
    assert.equal(retrievedWishlist.size, 3);
    assert.ok(retrievedWishlist.has('p2'));
    assert.ok(retrievedWishlist.has('p4'));
    assert.ok(!retrievedWishlist.has('p1'));
  });

  test('should insert and query orders ledger', () => {
    const order = {
      order_id: '#LEC-TEST-001',
      created_at: new Date().toISOString(),
      status: 'DISPATCHED',
      currency: 'USD',
      subtotal: 553.50,
      shipping: 0,
      tax: 44.28,
      total: 597.78,
      payment_provider: 'stripe',
      idempotency_key: 'idem_test_key_001',
      items: [{ product_id: 'p2', sku: 'LEC-ACC-002', name: 'Ocean Bloom', quantity: 1, unit_price: 553.50 }]
    };

    const inserted = db.createOrder(order);
    assert.equal(inserted.order_id, '#LEC-TEST-001');

    const orders = db.getOrders();
    assert.ok(orders.some(o => o.order_id === '#LEC-TEST-001'));
  });

  test('should enforce idempotency on duplicate order creation (Topic 03)', () => {
    const order = {
      order_id: '#LEC-TEST-IDEM',
      created_at: new Date().toISOString(),
      status: 'DISPATCHED',
      currency: 'USD',
      subtotal: 121.77,
      shipping: 0,
      tax: 9.74,
      total: 131.51,
      payment_provider: 'stripe',
      idempotency_key: 'idem_unique_token_999',
      items: [{ product_id: 'p4', sku: 'LEC-ACC-004', name: 'Aqua Stride Bottle', quantity: 1, unit_price: 121.77 }]
    };

    const first = db.createOrder(order);
    const second = db.createOrder(order);

    assert.equal(first.order_id, second.order_id);
    const allOrders = db.getOrders().filter(o => o.idempotency_key === 'idem_unique_token_999');
    assert.equal(allOrders.length, 1, 'Duplicate idempotency key must not create multiple orders');
  });

  test('should extract dispatched product IDs correctly', () => {
    const order = {
      order_id: '#LEC-DISPATCH-99',
      created_at: new Date().toISOString(),
      status: 'DISPATCHED',
      items: [{ product_id: 'p6' }, { product_id: 'p7' }]
    };
    db.createOrder(order);

    const dispatchedIds = db.getDispatchedProductIds();
    assert.ok(dispatchedIds.has('p6'));
    assert.ok(dispatchedIds.has('p7'));
  });

  test('should atomically reserve inventory and prevent overselling (Topic 01)', () => {
    const p3 = db.getProductById('p3'); // stock is 5
    const initialStock = p3.stockQuantity;

    const res1 = db.reserveInventoryAtomic('p3', 3);
    assert.equal(res1.success, true);
    assert.equal(res1.remaining, initialStock - 3);

    const res2 = db.reserveInventoryAtomic('p3', 3); // only 2 left
    assert.equal(res2.success, false);
    assert.equal(res2.reason, 'OUT_OF_STOCK');
  });

  test('should dump full database and reset seed (Topic 11)', () => {
    const dump = db.dumpFullDatabase();
    assert.equal(dump.system, 'Luxe Editorial Commerce Enterprise Database');
    assert.ok(Array.isArray(dump.tables.products));
    assert.ok(Array.isArray(dump.tables.orders));

    db.resetSeed();
    const freshProducts = db.getProducts();
    assert.equal(freshProducts.length, 7);
  });
});
