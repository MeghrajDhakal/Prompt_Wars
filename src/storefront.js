/**
 * @fileoverview Luxe Editorial Storefront & Commerce Domain Logic
 * Handles cart math, tiered shipping thresholds, catalog filtering/sorting,
 * and order dispatch lifecycle.
 * @module storefront
 */

/**
 * Calculates cart monetary totals including subtotal, tiered shipping, and tax.
 *
 * @param {Array<{id: string, quantity: number}>} cart - Line items in cart.
 * @param {Array<Object>} products - Product catalog.
 * @param {Object} [options]
 * @param {number} [options.freeShippingThreshold=250.00] - Order value for free shipping.
 * @param {number} [options.standardShippingFee=25.00] - Flat standard shipping fee.
 * @param {number} [options.taxRate=0.08] - Sales tax rate (8%).
 * @returns {Object} Calculated monetary summary.
 */
export function calculateCartTotals(cart, products, {
  freeShippingThreshold = 250.00,
  standardShippingFee = 25.00,
  taxRate = 0.08
} = {}) {
  const subtotalRaw = (cart || []).reduce((sum, item) => {
    const p = products.find(prod => prod.id === item.id);
    return sum + (p ? p.price * (item.quantity || 1) : 0);
  }, 0);

  const subtotal = Number(subtotalRaw.toFixed(2));
  const hasFreeShipping = subtotal >= freeShippingThreshold || subtotal === 0;
  const shipping = hasFreeShipping ? 0.00 : standardShippingFee;
  const freeShippingDelta = Math.max(0, Number((freeShippingThreshold - subtotal).toFixed(2)));
  const freeShippingPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const tax = Number((subtotal * taxRate).toFixed(2));
  const total = Number((subtotal + shipping + tax).toFixed(2));

  return {
    subtotal,
    shipping,
    tax,
    total,
    freeShippingThreshold,
    hasFreeShipping,
    freeShippingDelta,
    freeShippingPercent,
    itemCount: (cart || []).reduce((sum, i) => sum + (i.quantity || 1), 0)
  };
}

/**
 * Filters catalog products based on category criteria.
 *
 * @param {Array<Object>} products - Full catalog.
 * @param {string} filter - 'all' | 'lifestyle' | 'leather' | 'drink'.
 * @returns {Array<Object>} Filtered list.
 */
export function filterProducts(products, filter = 'all') {
  if (!Array.isArray(products)) return [];
  switch (filter) {
    case 'lifestyle':
      return products.filter(p => ['p1', 'p2', 'p3'].includes(p.id));
    case 'leather':
      return products.filter(p =>
        p.category.includes('Leather') ||
        p.category.includes('Tote') ||
        p.category.includes('Limitée')
      );
    case 'drink':
      return products.filter(p => p.category === 'Drinkware' || p.category === 'Eyewear');
    case 'all':
    default:
      return [...products];
  }
}

/**
 * Sorts catalog products by price or name.
 *
 * @param {Array<Object>} products
 * @param {string} sortKey - 'featured' | 'price-asc' | 'price-desc' | 'name'.
 * @returns {Array<Object>} Sorted list copy.
 */
export function sortProducts(products, sortKey = 'featured') {
  if (!Array.isArray(products)) return [];
  const copy = [...products];
  switch (sortKey) {
    case 'price-asc':
      return copy.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return copy.sort((a, b) => b.price - a.price);
    case 'name':
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    case 'featured':
    default:
      return copy;
  }
}

/**
 * Creates an order record transitioning cart items to DISPATCHED status.
 *
 * @param {Array<{id: string, quantity: number}>} cart
 * @param {Array<Object>} products
 * @param {string} idempotencyKey
 * @param {string} [orderId]
 * @returns {Object} Created order record.
 */
export function createDispatchedOrder(cart, products, idempotencyKey, orderId = null) {
  if (!cart || cart.length === 0) {
    throw new Error('Cannot checkout with an empty cart.');
  }

  const totals = calculateCartTotals(cart, products);
  const generatedId = orderId || `#LEC-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  return {
    order_id: generatedId,
    created_at: new Date().toISOString(),
    status: 'DISPATCHED',
    currency: 'USD',
    subtotal: totals.subtotal,
    shipping: totals.shipping,
    tax: totals.tax,
    total: totals.total,
    payment_provider: 'stripe',
    idempotency_key: idempotencyKey,
    items: cart.map(item => {
      const p = products.find(prod => prod.id === item.id);
      return {
        product_id: item.id,
        sku: p ? p.sku : 'UNKNOWN',
        name: p ? p.name : 'Unknown Product',
        quantity: item.quantity,
        unit_price: p ? p.price : 0
      };
    })
  };
}

/**
 * Batch transfers wishlist items to cart.
 *
 * @param {Set<string>|Array<string>} wishlist
 * @param {Array<{id: string, quantity: number}>} currentCart
 * @returns {{ newCart: Array<{id: string, quantity: number}>, transferredCount: number }}
 */
export function moveWishlistToCart(wishlist, currentCart) {
  const wishlistArray = Array.from(wishlist || []);
  const cartMap = new Map((currentCart || []).map(item => [item.id, item.quantity]));
  let transferredCount = 0;

  wishlistArray.forEach(id => {
    if (cartMap.has(id)) {
      cartMap.set(id, cartMap.get(id) + 1);
    } else {
      cartMap.set(id, 1);
    }
    transferredCount++;
  });

  const newCart = Array.from(cartMap.entries()).map(([id, quantity]) => ({ id, quantity }));
  return { newCart, transferredCount };
}
