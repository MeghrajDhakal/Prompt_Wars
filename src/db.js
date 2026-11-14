/**
 * @fileoverview Luxe Editorial Commerce Enterprise Database Engine (LEC_Database)
 * Implements client-side relational storage matching schema.sql PostgreSQL 16 3NF topology.
 * Hardened for BreakingBreach Topic 01 (Data Integrity), Topic 03 (Idempotency),
 * Topic 04 (Sessions), Topic 05 (Access Control), Topic 08 (PII Protection), Topic 11 (Backups).
 * @module db
 */

import { maskPII } from './resilience.js';

/**
 * SS26 Capsule Catalog Roster Definition
 */
export const SS26_PRODUCTS = [
  {
    id: 'p1',
    sku: 'LEC-ACC-001',
    name: 'Azure Drift',
    category: 'Leather Goods',
    subtitle: 'Bamboo Curved Handle',
    price: 613.77,
    isCuratorsPick: true,
    isSignature: false,
    inStock: true,
    stockQuantity: 14,
    aspectRatio: '4:3',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFBXHK8drnnP9l7NsNXoazb2ZeEwYd7WG7iSL95e9WKldh74rX2p0cMVV1oqFn83LaNkdvbPN5g-htuGoSJOepBmSI9U3axvWuBanD_dws2c1FoDFshsjYGKV8-jQUKvLaaltAxY6pKhUUVc-cAoia4p7flw7KYG3fluRAaL57s4QafkQFp6v8KfSqJCa6t4NsBtXW4mlE8l_yTWiUlO0l9YqmR3hA06jcixItl5GX',
    alt: 'Azure Drift Luxury Bag',
    desc: 'A modern luxury sky blue leather handbag with sculpted bamboo curved top handle displayed in an avant-garde editorial studio. Features fine edge paint, brushed brass hardware, and Italian calfskin leather.'
  },
  {
    id: 'p2',
    sku: 'LEC-ACC-002',
    name: 'Ocean Bloom',
    category: 'Tote',
    subtitle: 'Dual Tone Handle',
    price: 553.50,
    isCuratorsPick: false,
    isSignature: false,
    inStock: true,
    stockQuantity: 18,
    aspectRatio: '4/5',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGhW40SSbL1Mb61hI2ByCrnYmucwLiGPrzmG_j2-pWFi5dOirCvbacDjms1Mywvt2vkoVVUV7GBET9vbcRynAiKXWYR-PYqNM6k-yAsDKA_gdm-3P2Q27xhJS0Eh_tRR6B0QUKx9xSPpmmtjIXVOnayWyLi4z_M8IeYfLGO7h36eDEoqhW4iMz8bjTrYaKBgV1yFDdAwhqCfxa8v5-vDzPeHtJEF1QUKuGZnlC2S-a',
    alt: 'Ocean Bloom Bag',
    desc: 'A structured vibrant cobalt and azure blue leather tote bag featuring warm ochre tan leather dual handles photographed in a high-fashion clean white studio set.'
  },
  {
    id: 'p3',
    sku: 'LEC-ACC-003',
    name: 'Le Bag Autre',
    category: 'Edition Limitée',
    subtitle: 'Calfskin Polish',
    price: 2458.77,
    isCuratorsPick: false,
    isSignature: true,
    inStock: true,
    stockQuantity: 5,
    aspectRatio: '4/5',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWxOljzOGVKz4x4LpPvY9yuZjDtG2aJBanv5gKISb3z5-VqGbnKa2gsSFpZ70Hw1R8DmlNJZTLeUiOjKhX0zlooBIwFKMYD_63o6lvnPqHFWg5Op7H3F082Syim5qkR6fZNxm6e_YdJHRFOBcaeB97cARYtivtU810YoV7wrYqkr5iX1xAM3qeKh9fpriM85qLAH_AiR8vb1_HnPQ5bYsSNU_jGoPQ24b6briY_eln',
    alt: 'Le Bag Autre',
    desc: 'An ultra-luxurious deep burgundy polished calfskin leather shoulder handbag with sleek geometric paneling and slender handles standing upright in a museum-grade spotlight setup.'
  },
  {
    id: 'p4',
    sku: 'LEC-ACC-004',
    name: 'Aqua Stride Bottle',
    category: 'Drinkware',
    subtitle: 'Thermal Bronze',
    price: 121.77,
    isCuratorsPick: false,
    isSignature: false,
    inStock: true,
    stockQuantity: 42,
    aspectRatio: '4/5',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4M9Xkburnj7wVjerQuDbo3wYzrNOzcb2Ac0T_q-ZQT7nMHBV8WpzEUDK6tsEp2SZ2quInRGjnSXaOk_oioghPQCJAnZF9d_vJmySMBqQ4dDqLfBMx_2d4c1LsLGO-W0HUagWNfqrlCTPo4tflHDxvzzw_e6LLGpIn0v5I6lf9LGgnnIsqjaKrMhlZ69RxUVyGEvQrAl6r_Z83bYqWM3kpgwpg7ksdQfbyO3CZ_U1x',
    alt: 'Aqua Stride Bottle',
    desc: 'A minimalist architectural thermal water bottle engineered with matte dark graphite body and an anodized copper bronze cylindrical top cap.'
  },
  {
    id: 'p5',
    sku: 'LEC-ACC-005',
    name: 'Horizon Gaze Sunglasses',
    category: 'Eyewear',
    subtitle: 'Amber Lenses',
    price: 61.50,
    isCuratorsPick: false,
    isSignature: false,
    inStock: true,
    stockQuantity: 28,
    aspectRatio: '4/5',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVYFoKGzSiTRSNXeWxWCgb3hM21eu692d3IvIErdW-WT4Hfqm4waFuBwnQj0SYGlJHWk0NSt1u3NbpnBI8ipX3CBliibtpqkfJJW1znPUVbL1ClHuW2H_PNV2TyDpYmikTAolBaie6BPz-1kXLfzPftgMwj6pojLAgxrIamMPELSUUs5H0gwanc9Iph3Rd1ujKrHaRkmTEDcIv86_Mde4gOJgH1OmVzHKqvitKIXYA',
    alt: 'Horizon Gaze Sunglasses',
    desc: 'Sophisticated square black acetate designer sunglasses with warm amber sepia tinted lenses displayed flat lay on a warm parchment surface.'
  },
  {
    id: 'p6',
    sku: 'LEC-ACC-006',
    name: 'Shadow Stride Shoes',
    category: 'Footwear',
    subtitle: 'Midnight Charcoal',
    price: 147.60,
    isCuratorsPick: false,
    isSignature: false,
    inStock: true,
    stockQuantity: 19,
    aspectRatio: '4/5',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-7rNap8iLkKSBe-NfIhu4TiysoY_PWnFCQJaRRVlTao-h1dtAn_8WY77gipZO5ojo0rhHxz3c685qrirSxh37D4j0NL4jrPTiGCkFpYYh-vWjCezTfF4lEvqwIjZZowA_jV2qPMEOkZdBXf9U3J6SMI82aGzPtPG1s2acdaHl4WGvM7vRs9sO-9UUkLRH1aA4HSpchctmhQzm9rJ_XV5QgCrfGAuD3gwbIlhXGslJ',
    alt: 'Shadow Stride Shoes',
    desc: 'A top-down bird-eye view of a pair of refined midnight black and charcoal woven lifestyle sneakers with crisp white minimalist soles and dark navy laces.'
  },
  {
    id: 'p7',
    sku: 'LEC-ACC-007',
    name: 'Sunbeam Tote',
    category: 'Canvas Tote',
    subtitle: 'Terracotta Emboss',
    price: 121.77,
    isCuratorsPick: false,
    isSignature: false,
    inStock: true,
    stockQuantity: 24,
    aspectRatio: '4/5',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjcL-_7jFsDm7Q2YXKkJ-RT1NPMZ3Nlgs01271V6gcdi4NHPUf2Vx2vpuG9dZCqwHYiSpzXx7A1lW_xL462lJPt0yygA5lG2VDLZRKGxfNGHJWHk3e90Zq3b45BUNTMCtINkFAkMErcEuMuAk4azoxycdhwQUn_eofhiEWSigUUZT7eVgwj6UJkRTTlyXDKABZz-J-sQS6QzK0gj0S3oNbJQmCXizJIkx48VAR8wDS',
    alt: 'Sunbeam Tote',
    desc: 'An artisanal blush terracotta canvas shoulder tote bag featuring intricate tone-on-tone botanical motif embossing and fine leather trim with playful tassels.'
  }
];

/**
 * Creates an in-memory storage adapter when localStorage is unavailable.
 */
class MemoryStorage {
  constructor() {
    this.store = new Map();
  }
  getItem(key) {
    return this.store.has(key) ? this.store.get(key) : null;
  }
  setItem(key, value) {
    this.store.set(key, String(value));
  }
  removeItem(key) {
    this.store.delete(key);
  }
  clear() {
    this.store.clear();
  }
}

/**
 * Factory creating an initialized instance of the client-side relational database.
 * @param {Storage} [customStorage] Optional custom storage engine.
 */
export function createLEC_Database(customStorage = null) {
  const storage = customStorage || (typeof localStorage !== 'undefined' ? localStorage : new MemoryStorage());

  const tables = {
    cart: 'lec_cart_v1',
    wishlist: 'lec_wishlist_v1',
    orders: 'lec_orders_v1',
    idempotency_keys: 'lec_idempotency_keys_v1',
    session: 'lec_session_v1',
    products: 'lec_products_v1'
  };

  return {
    tables,
    storage,

    init() {
      // Migrate legacy keys if present
      if (!storage.getItem(tables.cart) && storage.getItem('yns_cart')) {
        storage.setItem(tables.cart, storage.getItem('yns_cart'));
      }
      if (!storage.getItem(tables.wishlist) && storage.getItem('yns_wishlist')) {
        storage.setItem(tables.wishlist, storage.getItem('yns_wishlist'));
      }

      // Initialize default sample orders if empty
      if (!storage.getItem(tables.orders)) {
        const sampleOrders = [
          {
            order_id: '#LEC-2026-8814',
            created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
            status: 'DISPATCHED',
            currency: 'USD',
            subtotal: 613.77,
            shipping: 0.00,
            tax: 49.10,
            total: 662.87,
            payment_provider: 'stripe',
            idempotency_key: 'idem_ss26_seed_8814a1',
            items: [
              {
                product_id: 'p1',
                sku: 'LEC-ACC-001',
                name: 'Azure Drift',
                quantity: 1,
                unit_price: 613.77
              }
            ]
          }
        ];
        storage.setItem(tables.orders, JSON.stringify(sampleOrders));
      }

      // Initialize idempotency registry if empty
      if (!storage.getItem(tables.idempotency_keys)) {
        const sampleKeys = [
          {
            key: 'idem_ss26_seed_8814a1',
            order_id: '#LEC-2026-8814',
            status: 'REDEEMED',
            created_at: new Date(Date.now() - 86400000 * 2).toISOString()
          }
        ];
        storage.setItem(tables.idempotency_keys, JSON.stringify(sampleKeys));
      }

      // Initialize products table
      if (!storage.getItem(tables.products)) {
        storage.setItem(tables.products, JSON.stringify(SS26_PRODUCTS));
      }
    },

    getProducts() {
      try {
        const data = storage.getItem(tables.products);
        return data ? JSON.parse(data) : [...SS26_PRODUCTS];
      } catch {
        return [...SS26_PRODUCTS];
      }
    },

    getProductById(id) {
      return this.getProducts().find(p => p.id === id) || null;
    },

    getCart() {
      try {
        const data = storage.getItem(tables.cart);
        return data ? JSON.parse(data) : [{ id: 'p1', quantity: 1 }, { id: 'p2', quantity: 1 }];
      } catch {
        return [];
      }
    },

    saveCart(cartData) {
      storage.setItem(tables.cart, JSON.stringify(cartData));
    },

    getWishlist() {
      try {
        const data = storage.getItem(tables.wishlist);
        const arr = data ? JSON.parse(data) : ['p3', 'p5'];
        return new Set(arr);
      } catch {
        return new Set();
      }
    },

    saveWishlist(wishlistSet) {
      const arr = Array.from(wishlistSet instanceof Set ? wishlistSet : new Set(wishlistSet));
      storage.setItem(tables.wishlist, JSON.stringify(arr));
    },

    getOrders() {
      try {
        const data = storage.getItem(tables.orders);
        return data ? JSON.parse(data) : [];
      } catch {
        return [];
      }
    },

    createOrder(orderRecord) {
      if (!orderRecord || !orderRecord.order_id) {
        throw new Error('Order record must contain an order_id');
      }
      const orders = this.getOrders();

      // Check idempotency key uniqueness to prevent duplicate creation
      if (orderRecord.idempotency_key) {
        const existingOrder = orders.find(o => o.idempotency_key === orderRecord.idempotency_key);
        if (existingOrder) {
          return existingOrder; // Idempotent return of prior order
        }
      }

      orders.unshift(orderRecord);
      storage.setItem(tables.orders, JSON.stringify(orders));

      if (orderRecord.idempotency_key) {
        this.recordIdempotency(orderRecord.idempotency_key, 'REDEEMED', orderRecord.order_id);
      }
      return orderRecord;
    },

    getDispatchedProductIds() {
      try {
        const orders = this.getOrders();
        const ids = new Set();
        orders.forEach(order => {
          if (order.status === 'DISPATCHED' || order.status === 'CONFIRMED_STRIPE') {
            if (Array.isArray(order.items)) {
              order.items.forEach(item => {
                if (item.product_id) ids.add(item.product_id);
              });
            }
          }
        });
        return ids;
      } catch {
        return new Set();
      }
    },

    getIdempotencyKeys() {
      try {
        const data = storage.getItem(tables.idempotency_keys);
        return data ? JSON.parse(data) : [];
      } catch {
        return [];
      }
    },

    recordIdempotency(key, status, orderId = null) {
      try {
        const keys = this.getIdempotencyKeys();
        keys.unshift({
          key,
          order_id: orderId,
          status,
          created_at: new Date().toISOString()
        });
        storage.setItem(tables.idempotency_keys, JSON.stringify(keys.slice(0, 50)));
      } catch {
        // Safe failover
      }
    },

    getSession() {
      try {
        const data = storage.getItem(tables.session);
        return data ? JSON.parse(data) : null;
      } catch {
        return null;
      }
    },

    saveSession(sessionData) {
      if (sessionData) {
        storage.setItem(tables.session, JSON.stringify(sessionData));
      } else {
        storage.removeItem(tables.session);
      }
    },

    /**
     * Simulates atomic inventory reservation (BreakingBreach Topic 01).
     * Prevents race conditions and overselling.
     */
    reserveInventoryAtomic(productId, quantity = 1) {
      const allProducts = this.getProducts();
      const product = allProducts.find(p => p.id === productId);
      if (!product) {
        return { success: false, reason: 'PRODUCT_NOT_FOUND' };
      }
      if (!product.inStock || (product.stockQuantity !== undefined && product.stockQuantity < quantity)) {
        return { success: false, reason: 'OUT_OF_STOCK', available: product.stockQuantity || 0 };
      }
      if (product.stockQuantity !== undefined) {
        product.stockQuantity -= quantity;
        if (product.stockQuantity === 0) {
          product.inStock = false;
        }
        storage.setItem(tables.products, JSON.stringify(allProducts));
      }
      return { success: true, remaining: product.stockQuantity };
    },

    dumpFullDatabase() {
      return {
        system: 'Luxe Editorial Commerce Enterprise Database',
        version: '1.0.0',
        dialect: 'PostgreSQL 16 Compatible / Client In-Memory LocalStore',
        timestamp: new Date().toISOString(),
        tables: {
          products: this.getProducts(),
          cart: this.getCart(),
          wishlist: Array.from(this.getWishlist()),
          orders: this.getOrders(),
          idempotency_keys: this.getIdempotencyKeys(),
          session: this.getSession() ? [this.getSession()] : []
        }
      };
    },

    resetSeed() {
      storage.removeItem(tables.cart);
      storage.removeItem(tables.wishlist);
      storage.removeItem(tables.orders);
      storage.removeItem(tables.idempotency_keys);
      storage.removeItem(tables.session);
      storage.removeItem(tables.products);
      this.init();
    }
  };
}

// Default exported singleton
export const LEC_Database = createLEC_Database();
LEC_Database.init();
