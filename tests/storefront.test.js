import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { SS26_PRODUCTS } from '../src/db.js';
import {
  calculateCartTotals,
  filterProducts,
  sortProducts,
  moveWishlistToCart
} from '../src/storefront.js';

describe('Storefront Commerce & Presentation Logic', () => {
  test('should filter products correctly by category filters', () => {
    const all = filterProducts(SS26_PRODUCTS, 'all');
    assert.equal(all.length, 7);

    const lifestyle = filterProducts(SS26_PRODUCTS, 'lifestyle');
    assert.equal(lifestyle.length, 3);
    assert.deepEqual(lifestyle.map(p => p.id), ['p1', 'p2', 'p3']);

    const leather = filterProducts(SS26_PRODUCTS, 'leather');
    assert.ok(leather.length >= 3);
    assert.ok(leather.every(p => p.category.includes('Leather') || p.category.includes('Tote') || p.category.includes('Limitée')));

    const drink = filterProducts(SS26_PRODUCTS, 'drink');
    assert.equal(drink.length, 2);
    assert.ok(drink.some(p => p.id === 'p4'));
    assert.ok(drink.some(p => p.id === 'p5'));
  });

  test('should sort products by price ascending, price descending, and alphabetical', () => {
    const asc = sortProducts(SS26_PRODUCTS, 'price-asc');
    assert.equal(asc[0].id, 'p5'); // Horizon Gaze ($61.50)
    assert.equal(asc[asc.length - 1].id, 'p3'); // Le Bag Autre ($2458.77)

    const desc = sortProducts(SS26_PRODUCTS, 'price-desc');
    assert.equal(desc[0].id, 'p3');
    assert.equal(desc[desc.length - 1].id, 'p5');

    const nameSort = sortProducts(SS26_PRODUCTS, 'name');
    assert.equal(nameSort[0].name, 'Aqua Stride Bottle');
  });

  test('should compute multi-item cart totals with tax and free shipping threshold', () => {
    // 2x Aqua Stride ($121.77 * 2 = 243.54) - just below $250
    const cart = [{ id: 'p4', quantity: 2 }];
    const totals = calculateCartTotals(cart, SS26_PRODUCTS);

    assert.equal(totals.subtotal, 243.54);
    assert.equal(totals.shipping, 25.00);
    assert.equal(totals.hasFreeShipping, false);
    assert.equal(totals.freeShippingDelta, 6.46);
    assert.equal(totals.freeShippingPercent, 97);
    assert.equal(totals.tax, 19.48);
    assert.equal(totals.total, 288.02);
  });

  test('should batch transfer wishlist items into cart', () => {
    const initialCart = [{ id: 'p1', quantity: 1 }];
    const wishlist = new Set(['p1', 'p4', 'p6']);

    const { newCart, transferredCount } = moveWishlistToCart(wishlist, initialCart);

    assert.equal(transferredCount, 3);
    const p1Item = newCart.find(i => i.id === 'p1');
    assert.equal(p1Item.quantity, 2, 'Existing item quantity must be incremented');

    const p4Item = newCart.find(i => i.id === 'p4');
    assert.equal(p4Item.quantity, 1);

    const p6Item = newCart.find(i => i.id === 'p6');
    assert.equal(p6Item.quantity, 1);
  });
});
