# Grocery Square: Backend & Deployment Roadmap

This document outlines the necessary work to transition the current high-fidelity front-end into a production-ready application.

## 1. Non-Functional UI Elements (Buttons/Links)

Currently, some interactive elements are "orphaned" or restricted to front-end logic:

- **Authentication Flow:**
  - `Login` & `Sign up` buttons: Render the pages but lack logic to authenticate via Supabase Auth.
  - `Sign out` button: Does not currently clear user sessions.
- **Cart & Checkout:**
  - `Add to Cart`: Updates local state (if using a cart hook) but does not persist to a database for cross-device synchronization.
  - `Checkout` button: Navigates to a 404 or inactive page; requires payment gateway (Stripe/Paypal) and order creation logic.
- **Search & Discovery:**
  - `Search Bar`: Debounce logic is ready, but results are currently empty due to missing Supabase credentials.
  - `Faceted Filters`: Filter counts and dynamic product filtering are tied to live database queries.
- **Dynamic Routing:**
  - Some category links (`Home > Produce`, `Home > Dairy`) require exact slug mapping to database entries to avoid 404s.

---

## 2. Essential Backend Work

### A. Supabase Configuration
- **Environment Variables:** Provide valid `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in [.env.local](file:///c:/Users/cc/Downloads/MyWebsite/.env.local).
- **Database Schema:** 
  - `categories`: Table with `id`, `name`, `slug`, `image_url`, and `description`.
  - `products`: Table with `id`, `name`, `price`, `sale_price`, stock_quantity, `category_id`, and `image_url`.
  - `orders`: Table to store customer orders, status, and line items.
  - `reviews`: Table for customer feedback (Stage 3 mockup).

### B. Authentication & Middleware
- Enable **Supabase Auth** (Email, Google, etc.).
- Configure `middleware.ts` to strictly protect `/account`, `/orders`, and `/checkout` routes.

### C. Payment Integration (SNAP/EBT Ready)
- Implement a server-side route for Stripe/External payments.
- Add specific logic to handle **SNAP/EBT** eligibility flags for products.

---

## 3. Deployment Checklist

- [ ] **Infrastructure:** Host on Vercel or similar for seamless Next.js support.
- [ ] **Images:** Migrate local images to a CDN or Supabase Storage bucket for performance.
- [ ] **Email:** Configure an SMTP or Resend service for order confirmations.
- [ ] **SEO:** Finalize `robots.txt` and `sitemap.xml`.

---

## Estimated Timeline
- **DB Setup:** 2-3 hours
- **Auth Integration:** 2 hours
- **Cart Persistence:** 4 hours
- **Payment Gateway:** 8-10 hours
