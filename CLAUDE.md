# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

No test suite is configured.

## Architecture

**Grocery Square** — a Next.js 16 e-commerce app for fresh grocery delivery.

### Stack
- **Next.js 16** with React 19 and TypeScript — App Router with React Server Components
- **Supabase** — PostgreSQL database + authentication
- **Tailwind CSS v4 + shadcn/ui** — styling and UI components
- **SWR** — client-side data fetching and caching
- **React Hook Form + Zod** — form handling and validation

### Key Directories
- `app/` — Next.js App Router pages (each folder = a route)
- `components/` — reusable React components; `components/ui/` contains shadcn/ui primitives
- `lib/` — shared utilities, types, and Supabase client setup
- `hooks/` — custom React hooks

### Data Layer
- `lib/types.ts` — all TypeScript interfaces (Product, Category, Order, CartItem, etc.) mapping to Supabase tables
- `lib/supabase/client.ts` — browser Supabase client (for Client Components)
- `lib/supabase/server.ts` — server Supabase client (for Server Components/Route Handlers)
- `middleware.ts` — runs on every request; refreshes Supabase session cookies

### State Management
- `lib/cart-context.tsx` — React Context + SWR for cart state; exposes `addItem`, `updateQuantity`, `removeItem`, `clearCart`
- `components/providers.tsx` — wraps the app in CartContext and other providers

### Patterns
- **Server Components by default** — fetch data directly with the server Supabase client (`lib/supabase/server.ts`)
- **Client Components** — use `"use client"` directive; interact with Supabase via browser client
- `next.config.mjs` sets `typescript: { ignoreBuildErrors: true }` and `images: { unoptimized: true }`
- Path alias `@/` maps to the project root
- shadcn/ui components are added via `npx shadcn@latest add <component>` and land in `components/ui/`
