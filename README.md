# Luxe Editorial Commerce — SS26 Capsule

[![Next.js 16](https://img.shields.io/badge/Next.js-16.4-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.3-blue?style=flat&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS_v4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![Stripe Native](https://img.shields.io/badge/Stripe-Commerce_Kit-635bff?style=flat&logo=stripe)](https://stripe.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md)

An avant-garde, luxury editorial e-commerce platform blending classical fashion magazine prestige with sharp contemporary digital fluidity. Designed from the ground up for high-end craft, tactile mobile commerce, and frictionless purchasing.

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

1. **Editorial Pacing & Asymmetry:** Rather than repetitive uniform product rows, products are presented with calculated pacing: an expansive 4:3 Curator's Pick exhibition hero tile paired with responsive 4:5 discovery cards.
2. **High-Contrast Haute Typography:** Section mastheads and titles rendered in high-contrast **Playfair Display**, price capsules and technical codes in **Space Grotesk**, and descriptions in legible **Geist**.
3. **Tactile Micro-Interactions:**
   - **Floating Price Capsules:** Frosted glass badge anchored over product photography.
   - **One-Tap Quick Buy:** Immediate visual feedback with icon transition (`+` → `✓`) and Electric Cobalt glow.
   - **Wishlist Heart Triggers:** Dynamic state toggling with instant local persistence.
4. **Docked Island Navigation:** Floating frosted acrylic glass pill docked 16px above the viewport base, respecting mobile safe-area insets.
5. **Interactive Sliding Cart:** Slide-over cart overlay featuring dynamic line item controls, tax/shipping computation, and a complimentary shipping progress bar ($250 threshold).

---

## 💎 SS26 Capsule Catalog Roster

| SKU | Piece | Category | Price | Signature Details |
| :--- | :--- | :--- | :--- | :--- |
| `YNS-ACC-001` | **Azure Drift** | Leather Goods | $613.77 | Curator’s Pick, Sculpted Bamboo Handle |
| `YNS-ACC-002` | **Ocean Bloom** | Tote | $553.50 | Dual Tone Ochre Handle, Cobalt Leather |
| `YNS-ACC-003` | **Le Bag Autre** | Edition Limitée | $2,458.77 | Signature Edition, Polished Calfskin |
| `YNS-ACC-004` | **Aqua Stride Bottle** | Drinkware | $121.77 | Thermal Bronze Anodized Cap, Matte Body |
| `YNS-ACC-005` | **Horizon Gaze Sunglasses** | Eyewear | $61.50 | Amber Sepia Lenses, Square Acetate |
| `YNS-ACC-006` | **Shadow Stride Shoes** | Footwear | $147.60 | Midnight Charcoal Woven, Minimal Sole |
| `YNS-ACC-007` | **Sunbeam Tote** | Canvas Tote | $121.77 | Terracotta Botanical Embossing |

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
├── DESIGN.md                               # Complete Design System & Style Tokens
├── code.html                               # Editorial Storefront Prototype & Template
├── index.html                              # Interactive Luxe Commerce Storefront Application
├── screen.png                              # High-Fidelity UI Layout Reference
├── product_requirement_specification.md    # Product Requirements Specification (PRS)
├── system_design_document.md               # System Design Document (SDD)
├── database_schema_architecture.md         # Database Schema, ERD, and SQL DDL
├── requirements.md                         # Requirements & Traceability Matrix (FR/NFR/BDD)
├── README.md                               # Master Project Overview
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
