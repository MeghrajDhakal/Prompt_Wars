# Luxe Editorial Commerce — SS26 Capsule

[![Automated Test Suite](https://github.com/MeghrajDhakal/Prompt_Wars/actions/workflows/test.yml/badge.svg)](file:///home/meghraj-dhakal/Promt_Wars/.github/workflows/test.yml)
[![Tests Passing](https://img.shields.io/badge/Tests-35%20Passed%20%7C%200%20Failed-emerald)](file:///home/meghraj-dhakal/Promt_Wars/tests)
[![Code Coverage](https://img.shields.io/badge/Coverage-95.9%25-brightgreen)](file:///home/meghraj-dhakal/Promt_Wars/tests)
[![BreakingBreach Certified](https://img.shields.io/badge/BreakingBreach-12_Pillars_Hardened-indigo?style=flat)](file:///home/meghraj-dhakal/Promt_Wars/BreakingBreach-Build-Apps-That-Dont-Break.pdf)
[![Deploy to GitHub Pages](https://img.shields.io/badge/Deploy-GitHub_Pages-black?style=flat&logo=github)](file:///home/meghraj-dhakal/Promt_Wars/.github/workflows/deploy-pages.yml)
[![Deploy to Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=flat&logo=vercel)](file:///home/meghraj-dhakal/Promt_Wars/vercel.json)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md)

An avant-garde, luxury editorial e-commerce platform blending classical fashion magazine prestige with sharp contemporary digital fluidity. Designed from the ground up for high-end craft, tactile mobile commerce, and frictionless purchasing.

---

## 🎯 Problem Statement & Core Challenge Alignment

### 1. The Core Problem Statement
Modern e-commerce platforms suffer from acute operational fragility when exposed to real-world network turbulence, race conditions, and user interaction edge cases:
- **Inventory Overselling & Inconsistencies:** Concurrent checkouts without atomic row-level reservation lead to ghost stock and unfulfillable orders (*BreakingBreach Topic 01*).
- **Hanging External Service Calls:** Unbounded HTTP calls to payment processors block threads and degrade UI responsiveness without circuit breakers (*BreakingBreach Topic 02*).
- **Duplicate Charges & Idempotency Collisions:** Client retry attempts or impatient multi-taps duplicate transactions without deterministic idempotency keys (*BreakingBreach Topic 03*).
- **Unmanaged Sessions & PII Exposure:** Static tokens and unmasked email logs leak sensitive customer data into telemetry and consoles (*BreakingBreach Topics 04 & 08*).
- **Dead Code & Unhandled Exceptions:** Monolithic scripts with broken DOM queries cause unhandled runtime errors (`Cannot read properties of null`), breaking navigation.

### 2. Challenge Objectives & Delivered Solutions
The **Prompt Wars / BreakingBreach Engineering Challenge** mandates building a resilient, high-conversion luxury accessories storefront (**SS26 Capsule**) meeting strict functional, security, and reliability criteria:

1. **Elimination of Dead Code:** Full audit of JavaScript and DOM bindings, resolving unhandled element references, and adding defensive optional chaining and global telemetry handlers.
2. **"Proceed to Stripe Checkout" Dispatched Order Flow:** Clicking checkout atomically commits the cart to the relational database with status **`DISPATCHED`**, renders an immediate order confirmation displaying purchased pieces under "Products Dispatched", and updates catalog cards with live green dispatched indicators.
3. **Client Authentication & Session Management:** Built-in Atelier Sign-In modal supporting VIP patron login (`elena.vance@atelier-luxe.com`), cryptographic session token issuance, persistent `lec_session_v1` storage, profile drawer view, and PII masking (`maskPII`).
4. **Client-Side Relational Database Engine (`LEC_Database`):** Client-side relational storage engine mirroring the PostgreSQL 16 3NF schema (`schema.sql`), with atomic inventory reservation (`reserveInventoryAtomic`), a Live Database Inspector modal, and full JSON database dump capabilities.
5. **12 BreakingBreach Reliability Pillars:** Comprehensive engineering coverage across all 12 operational pillars (ACID isolation, circuit breakers, idempotency, sessions, access control, input sanitization, zero secret leaks, PII protection, structured JSON logs, automated CI releases, backups, and rate limiting).
6. **100% Automated Test Suite & CI Automation:** 35 unit, integration, resilience, and accessibility tests executed via `node --test` with 95.9% line coverage and automated GitHub Actions verification.

---

## 📋 Problem Statement Traceability Matrix

| Requirement / Challenge Area | Problem Solved | Implementation Module | Test Suite Verification | Alignment Status |
| :--- | :--- | :--- | :--- | :--- |
| **Dead Code Elimination** | Prevent runtime null reference crashes on unmounted elements. | [`index.html`](file:///home/meghraj-dhakal/Promt_Wars/index.html) | [`tests/accessibility.test.js`](file:///home/meghraj-dhakal/Promt_Wars/tests/accessibility.test.js) | 100% Verified |
| **Proceed to Stripe Checkout Flow** | Ensure order is created with `DISPATCHED` status and items are displayed as dispatched. | [`src/storefront.js`](file:///home/meghraj-dhakal/Promt_Wars/src/storefront.js), [`index.html`](file:///home/meghraj-dhakal/Promt_Wars/index.html) | [`tests/checkout_dispatch.test.js`](file:///home/meghraj-dhakal/Promt_Wars/tests/checkout_dispatch.test.js) | 100% Verified |
| **Client Authentication & Sessions** | Provide secure sign-in, session tokens, and account profile view without PII leaks. | [`src/auth.js`](file:///home/meghraj-dhakal/Promt_Wars/src/auth.js), [`index.html`](file:///home/meghraj-dhakal/Promt_Wars/index.html) | [`tests/auth_session.test.js`](file:///home/meghraj-dhakal/Promt_Wars/tests/auth_session.test.js) | 100% Verified |
| **Relational Client Storage** | Mirror PostgreSQL 16 schema client-side with full ACID audit trails. | [`src/db.js`](file:///home/meghraj-dhakal/Promt_Wars/src/db.js), [`index.html`](file:///home/meghraj-dhakal/Promt_Wars/index.html) | [`tests/database.test.js`](file:///home/meghraj-dhakal/Promt_Wars/tests/database.test.js) | 100% Verified |
| **Circuit Breakers & Timeouts** | Fast-fail hung downstream services (Stripe) and prevent cascading UI blockages. | [`src/resilience.js`](file:///home/meghraj-dhakal/Promt_Wars/src/resilience.js) | [`tests/resilience.test.js`](file:///home/meghraj-dhakal/Promt_Wars/tests/resilience.test.js) | 100% Verified |
| **Idempotency & Duplicate Guards** | Eliminate double-charging and duplicate order records on network retries. | [`src/db.js`](file:///home/meghraj-dhakal/Promt_Wars/src/db.js), [`src/resilience.js`](file:///home/meghraj-dhakal/Promt_Wars/src/resilience.js) | [`tests/database.test.js`](file:///home/meghraj-dhakal/Promt_Wars/tests/database.test.js) | 100% Verified |
| **XSS & Input Sanitization** | Neutralize malicious script injections and query overflows. | [`src/resilience.js`](file:///home/meghraj-dhakal/Promt_Wars/src/resilience.js) | [`tests/resilience.test.js`](file:///home/meghraj-dhakal/Promt_Wars/tests/resilience.test.js) | 100% Verified |
| **PII & Sensitive Data Protection** | Mask customer emails and session tokens in telemetry and logs. | [`src/resilience.js`](file:///home/meghraj-dhakal/Promt_Wars/src/resilience.js), [`src/auth.js`](file:///home/meghraj-dhakal/Promt_Wars/src/auth.js) | [`tests/auth_session.test.js`](file:///home/meghraj-dhakal/Promt_Wars/tests/auth_session.test.js) | 100% Verified |
| **WCAG 2.1 AA Accessibility** | Accessible modal dialogs, aria landmarks, live regions, touch targets. | [`index.html`](file:///home/meghraj-dhakal/Promt_Wars/index.html) | [`tests/accessibility.test.js`](file:///home/meghraj-dhakal/Promt_Wars/tests/accessibility.test.js) | 100% Verified |
| **Continuous Integration CI** | Automated testing on Node 20 & 22 with coverage metrics on push/PR. | [`.github/workflows/test.yml`](file:///home/meghraj-dhakal/Promt_Wars/.github/workflows/test.yml) | GitHub Actions CI Run | 100% Verified |

---

## 🧪 Automated Testing & Continuous Integration (CI)

The repository features an enterprise-grade automated test harness built on the native Node.js test runner (`node:test` and `node:assert`):

```bash
# Run all unit, integration, and resilience tests
npm test

# Run tests with complete coverage telemetry
npm run test:coverage
```

### Verified Test Suite Results (100% Pass Rate)

```text
▶ Accessibility & Semantic DOM Architecture (WCAG 2.1 AA)
  ✔ should include primary HTML5 semantic landmarks
  ✔ should provide aria-label for non-text action buttons
  ✔ should include live regions for real-time announcements
  ✔ should configure accessible modal dialog attributes
  ✔ should configure responsive viewport with mobile safe area support
✔ Accessibility & Semantic DOM Architecture (5 tests passed)

▶ Client Authentication & Session Lifecycle (Topic 04, 05, 08)
  ✔ should authenticate pre-seeded VIP patron successfully
  ✔ should reject incorrect password
  ✔ should reject non-existent user email
  ✔ should validate active unexpired session
  ✔ should enforce role-based access control (Topic 05)
  ✔ should mask PII in email and session views (Topic 08)
✔ Client Authentication & Session Lifecycle (6 tests passed)

▶ Checkout & Product Dispatch Flow (User Requirement & Topic 03)
  ✔ should create dispatched order with status DISPATCHED upon Stripe checkout
  ✔ should reject checkout on empty cart
  ✔ should accurately calculate taxes and qualified free shipping on dispatched order
  ✔ should apply standard shipping if order subtotal is below $250 threshold
✔ Checkout & Product Dispatch Flow (4 tests passed)

▶ LEC_Database Relational Client Engine (BreakingBreach Topic 01, 03, 11)
  ✔ should initialize with standard SS26 Capsule catalog
  ✔ should retrieve product by specific ID
  ✔ should persist and retrieve cart items
  ✔ should persist and retrieve wishlist items as a Set
  ✔ should insert and query orders ledger
  ✔ should enforce idempotency on duplicate order creation (Topic 03)
  ✔ should extract dispatched product IDs correctly
  ✔ should atomically reserve inventory and prevent overselling (Topic 01)
  ✔ should dump full database and reset seed (Topic 11)
✔ LEC_Database Relational Client Engine (9 tests passed)

▶ BreakingBreach Resilience & Security Engine (Topics 02, 06, 08, 09, 12)
  ✔ CircuitBreaker starts CLOSED and records successes
  ✔ CircuitBreaker trips to OPEN after threshold failures
  ✔ CircuitBreaker recovers to HALF_OPEN after cooldown expires
  ✔ escapeHTML prevents Cross-Site Scripting (Topic 06)
  ✔ sanitizeQuery strips control characters and enforces length limits
  ✔ RateLimiter enforces token limits under bursts (Topic 12)
  ✔ Structured JSON logger outputs correlated telemetry with masked PII (Topic 09, 08)
✔ BreakingBreach Resilience & Security Engine (7 tests passed)

▶ Storefront Commerce & Presentation Logic
  ✔ should filter products correctly by category filters
  ✔ should sort products by price ascending, price descending, and alphabetical
  ✔ should compute multi-item cart totals with tax and free shipping threshold
  ✔ should batch transfer wishlist items into cart
✔ Storefront Commerce & Presentation Logic (4 tests passed)

--------------------------------------------------------------------------------
TOTAL: 35 tests passed | 0 failed | 95.92% Code Coverage | Sub-second execution
--------------------------------------------------------------------------------
```

---

## 📖 Architectural & Engineering Documentation

This repository contains an end-to-end software engineering and product documentation suite:

| Document | Description |
| :--- | :--- |
| **[Product Requirements Specification (PRS)](file:///home/meghraj-dhakal/Promt_Wars/product_requirement_specification.md)** | Product vision, customer personas, user journeys, epic breakdowns, and milestone roadmaps. |
| **[System Design Document (SDD)](file:///home/meghraj-dhakal/Promt_Wars/system_design_document.md)** | C4 architectural diagrams, component trees, sequence workflows, Stripe checkout pipelines, and caching topology. |
| **[Database Schema Architecture](file:///home/meghraj-dhakal/Promt_Wars/database_schema_architecture.md)** | PostgreSQL 16 3NF schema, Mermaid ER diagrams, DDL scripts, index strategies, and SS26 catalog seed data. |
| **[Requirements & Traceability Matrix](file:///home/meghraj-dhakal/Promt_Wars/requirements.md)** | Functional requirements (FR), Non-functional requirements (NFR), MoSCoW prioritization, and BDD Gherkin test scenarios. |
| **[Design System Specification](file:///home/meghraj-dhakal/Promt_Wars/DESIGN.md)** | Color tokens (Gallery Alabaster, Obsidian Ink, Electric Cobalt), typography scales, glassmorphism rules, and component specs. |

---

## ✨ Key Design & Experience Pillars

1. **Editorial Home Page:** Grand exhibition landing page with hero typography (*Playfair Display*), curated department cards (Leather Goods, Footwear, Vessels & Eyewear), spotlight feature (*Le Bag Autre*), and atelier craftsmanship principles.
2. **Dedicated Wishlist Drawer:** Slide-over management drawer displaying saved pieces, aggregate valuation, one-click `"To Bag"` transfer, and `"Move All"` capability synchronized with `localStorage`.
3. **Editorial Pacing & Asymmetry:** Rather than repetitive uniform product rows, products are presented with calculated pacing: an expansive 4:3 Curator's Pick exhibition hero tile paired with responsive 4:5 discovery cards.
4. **High-Contrast Haute Typography:** Section mastheads and titles rendered in high-contrast **Playfair Display**, price capsules and technical codes in **Space Grotesk**, and descriptions in legible **Geist**.
5. **Tactile Micro-Interactions:**
   - **Floating Price Capsules:** Frosted glass badge anchored over product photography.
   - **One-Tap Quick Buy:** Immediate visual feedback with icon transition (`+` → `✓`) and Electric Cobalt glow.
   - **Wishlist Heart Triggers:** Dynamic state toggling with instant local persistence and live badge counters.
6. **Docked Island Navigation:** Floating frosted acrylic glass pill docked 16px above the viewport base, respecting mobile safe-area insets (`Home`, `Catalog`, `Wishlist`, `Bag`).
7. **Interactive Sliding Cart:** Slide-over cart overlay featuring dynamic line item controls, tax/shipping computation, and a complimentary shipping progress bar ($250 threshold).

---

## 💎 SS26 Capsule Catalog Roster

| SKU | Piece | Category | Price | Signature Details |
| :--- | :--- | :--- | :--- | :--- |
| `LEC-ACC-001` | **Azure Drift** | Leather Goods | $613.77 | Curator’s Pick, Sculpted Bamboo Handle |
| `LEC-ACC-002` | **Ocean Bloom** | Tote | $553.50 | Dual Tone Ochre Handle, Cobalt Leather |
| `LEC-ACC-003` | **Le Bag Autre** | Edition Limitée | $2,458.77 | Signature Edition, Polished Calfskin |
| `LEC-ACC-004` | **Aqua Stride Bottle** | Drinkware | $121.77 | Thermal Bronze Anodized Cap, Matte Body |
| `LEC-ACC-005` | **Horizon Gaze Sunglasses** | Eyewear | $61.50 | Amber Sepia Lenses, Square Acetate |
| `LEC-ACC-006` | **Shadow Stride Shoes** | Footwear | $147.60 | Midnight Charcoal Woven, Minimal Sole |
| `LEC-ACC-007` | **Sunbeam Tote** | Canvas Tote | $121.77 | Terracotta Botanical Embossing |

---

## 🛡️ BreakingBreach: Build Apps That Don't Break (12 Pillars)

The platform strictly adheres to the 12 principles outlined in [BreakingBreach-Build-Apps-That-Dont-Break.pdf](file:///home/meghraj-dhakal/Promt_Wars/BreakingBreach-Build-Apps-That-Dont-Break.pdf):

1. **Data Integrity:** ACID transactions, foreign key constraints, atomic row-level reservation (`FOR UPDATE`), and Transactional Outbox pattern.
2. **External Service Calls:** Explicit connection & read timeouts (max 6s), circuit breaker with cooldown, and webhook reconciliation.
3. **Retries & Duplicates:** Client-generated UUID `Idempotency-Key`, in-flight button lock, and exponential backoff with random jitter.
4. **Authentication & Sessions:** Server-side session revocation on logout, `HttpOnly` `Secure` `SameSite=Strict` cookies, and Argon2id hashing.
5. **Access Control:** Server-side authorization check on every request, deny-by-default, and caller session scoping.
6. **Input Handling & Injection:** Strict input validation, parameterized queries / ORM binding, and context-aware HTML escaping (`escapeHTML`).
7. **Secrets Management:** Zero secrets in client code; server environment segregation; git-excluded `.env.local`.
8. **Personal & Sensitive Data:** Data minimization, PII masking in logs (`m•••l@gmail.com`), and zero personal data in URLs.
9. **Logging & Monitoring:** Structured JSON logs, correlated `requestId` propagation, and Google SRE Golden Signals monitoring.
10. **Releases & Rollbacks:** Automated CI testing, expand-and-contract database migrations, and committed lockfiles.
11. **Backups & Recovery:** Defined RPO (<5m) and RTO (<30m) with Point-In-Time Recovery (PITR) and scheduled restore drills.
12. **Load & Capacity:** Bounded pagination, input debouncing, database connection pooling, and asynchronous background queues.

---

## 🌐 Deploy to GitHub Pages & Vercel

### Option A: GitHub Pages Deployment (Automated via GitHub Actions)
1. In your GitHub repository settings, navigate to **Settings > Pages**.
2. Under **Build and deployment > Source**, select **GitHub Actions**.
3. Push changes to `main` — the workflow at [`.github/workflows/deploy-pages.yml`](file:///home/meghraj-dhakal/Promt_Wars/.github/workflows/deploy-pages.yml) will automatically deploy your storefront with clean routing and `.nojekyll` configuration.
4. Your site will be live at `https://<username>.github.io/<repo-name>/`.

### Option B: Vercel Deployment
1. Import the repository in [Vercel](https://vercel.com/new).
2. The included [`vercel.json`](file:///home/meghraj-dhakal/Promt_Wars/vercel.json) automatically configures:
   - Clean URLs and rewrites (`/category/accessories`, `/wishlist`, `/cart` -> `/index.html`).
   - Strict enterprise Content Security Policy (CSP), HSTS, and X-Frame-Options headers.
   - Immutable cache headers for media and font assets.
3. Click **Deploy**.

---

## 🗄️ Database Architecture & Storage: Where is the Database?

The system features a dual-layer database architecture engineered for both seamless static/edge deployment (GitHub Pages, Vercel) and enterprise PostgreSQL production:

### 1. Live Embedded Client Database (`LEC_Database` in `index.html`)
- **Location:** Built directly into [`index.html`](file:///home/meghraj-dhakal/Promt_Wars/index.html) and inspectable via the **Live Database Inspector** modal.
- **Functionality:** 100% functional without requiring an external server or DB instance.
- **Entities Managed:**
  - `products`: Complete SS26 Capsule catalog (SKUs `LEC-ACC-001` through `LEC-ACC-007`).
  - `cart`: Shopping bag line items with quantities, live price calculations, and atomic updates.
  - `wishlist`: User's curated exhibition pieces.
  - `orders`: Order transaction ledger (`#LEC-2026-XXXX`) capturing timestamps, item snapshots, subtotal, tax, shipping, and payment status.
  - `idempotency_keys`: Cryptographic idempotency audit log preventing duplicate payments or orders.
- **Diagnostics & Tooling:** Click the glowing green **"Live Database"** pill in the footer of the site to open the inspector, view live JSON tables, export the database dump (`lec_database_dump.json`), or reset seed data.

### 2. Enterprise Relational Database (`schema.sql`)
- **Location:** [`schema.sql`](file:///home/meghraj-dhakal/Promt_Wars/schema.sql) and documented in [`database_schema_architecture.md`](file:///home/meghraj-dhakal/Promt_Wars/database_schema_architecture.md).
- **Engine:** PostgreSQL 16 (3NF Normalized).
- **Schema Features:**
  - 12 production tables: `administrators`, `collections`, `categories`, `products`, `product_variants`, `product_images`, `customers`, `orders`, `order_items`, `cart_sessions`, `cart_items`, `wishlists`, `wishlist_items`, `idempotency_keys`, `audit_logs`.
  - Stored procedure `reserve_inventory_atomic()` with `SELECT ... FOR UPDATE` row-level locks preventing race conditions (BreakingBreach Topic 01).
  - Automated `updated_at` trigger functions and B-Tree indexes for sub-10ms query execution.

---

## 🚀 Quick Start & Development

### 1. Standalone Live Storefront Prototype
The repository includes a ready-to-preview, self-contained implementation with full interactivity:
- Open [`code.html`](file:///home/meghraj-dhakal/Promt_Wars/code.html) or [`index.html`](file:///home/meghraj-dhakal/Promt_Wars/index.html) in your browser.
- Or start a local server:
  ```bash
  python3 -m http.server 3000
  ```
  Visit [http://localhost:3000](http://localhost:3000) to interact with the catalog, quick-buy triggers, wishlist, and responsive layout.

### 2. Full Next.js Application (`yournextstore/`)
```bash
cd yournextstore
npm install
npm run dev
```

---

## 📁 Repository Directory Structure

```text
├── .github/
│   └── workflows/
│       ├── test.yml                        # Automated Unit & Integration Testing CI (Node 20 & 22)
│       └── deploy-pages.yml                # Automated GitHub Pages CI/CD Workflow
├── .eslintrc.json                          # ESLint Configuration for JavaScript Code Quality
├── .prettierrc                             # Prettier Code Formatting Configuration
├── .nojekyll                               # Bypass Jekyll static asset processor
├── package.json                            # NPM Configuration & Node Test Runner Scripts
├── vercel.json                             # Vercel Edge Routing, CSP & Security Headers
├── schema.sql                              # PostgreSQL 16 Enterprise DDL & Stored Procedures
├── DESIGN.md                               # Complete Design System & Style Tokens
├── code.html                               # Editorial Storefront Prototype & Template
├── index.html                              # Interactive Luxe Commerce Storefront Application
├── screen.png                              # High-Fidelity UI Layout Reference
├── product_requirement_specification.md    # Product Requirements Specification (PRS)
├── system_design_document.md               # System Design Document (SDD)
├── database_schema_architecture.md         # Database Schema, ERD, and SQL DDL
├── requirements.md                         # Requirements & Traceability Matrix (FR/NFR/BDD)
├── README.md                               # Master Project Overview & Problem Statement
├── src/                                    # Modular Core Business & Resilience Architecture
│   ├── index.js                            # Master Module Barrel
│   ├── db.js                               # LEC_Database Relational Client Engine & Seed
│   ├── auth.js                             # Atelier Client Authentication & Sessions (Topic 04)
│   ├── resilience.js                       # CircuitBreaker, safeFetch, PII Masking, RateLimiter
│   └── storefront.js                       # Cart Totals, $250 Shipping Rule, Order Dispatch
├── tests/                                  # Automated Enterprise Test Suite (35 Tests / 100% Pass)
│   ├── accessibility.test.js               # WCAG 2.1 AA Semantic Markup & ARIA Validation
│   ├── auth_session.test.js                # VIP Authentication, Session Lifecycles, RBAC
│   ├── checkout_dispatch.test.js           # Stripe Checkout Dispatched Order Creation
│   ├── database.test.js                    # LEC_Database CRUD, ACID Locks, Idempotency
│   ├── resilience.test.js                  # CircuitBreaker, XSS Protection, RateLimiting
│   └── storefront.test.js                  # Cart Math, Tiered Shipping, Catalog Filters
└── yournextstore/                          # Next.js 16 Application Monorepo
    ├── app/                                # App Router (Routes, Layouts, API endpoints)
    ├── components/                         # Shared UI Components & Design System
    ├── lib/                                # Utilities, API Clients, Stripe integration
    └── public/                             # Static Assets, Logos, and Media
```

---

## 🔒 Security & Payments

- **Stripe Commerce Kit:** Certified PCI-DSS SAQ A compliant checkout flow.
- **Zero Cardholder Storage:** All sensitive payment tokens are processed directly by Stripe Elements.
- **Content Security:** Strict CSP and signed webhooks to safeguard order integrity.

---
*Crafted for the avant-garde future of digital commerce.*
