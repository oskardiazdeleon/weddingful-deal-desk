# Weddingful Deal Desk

MVP web app for the Weddingful business — a destination wedding savings platform with two monetization streams:

- **B2C**: Free savings audit lead capture → paid Concierge service ($999 flat fee)
- **B2B**: Vendor lead delivery program (qualified couples matched to venues/planners)

Built with **Next.js 15 (App Router)**, **TypeScript**, and **Tailwind CSS**.

---

## Architecture

```
app/
  page.tsx                  Homepage — value prop + dual monetization
  intake/page.tsx           Couple intake flow (4-step form, client component)
  audit/page.tsx            Savings audit results + Concierge CTA (server component)
  concierge/page.tsx        Concierge checkout (Stripe placeholder)
  vendors/page.tsx          Vendor lead program landing + contact form
  admin/page.tsx            Internal admin — couple leads + vendor inquiries
  api/
    leads/route.ts          POST — save couple lead to JSON store
    vendor-inquiry/route.ts POST — save vendor inquiry to JSON store

lib/
  db.ts                     File-based JSON store (replace with real DB before scaling)
  audit.ts                  Savings estimation logic

data/                       Auto-created at runtime (gitignored)
  couple-leads.json         Couple lead records
  vendor-inquiries.json     Vendor inquiry records
```

### Data storage

MVP uses a flat-file JSON store in `./data/`. This is intentional for zero-dependency local dev.
Before deploying to production, replace `lib/db.ts` with a real database client
(Postgres via Prisma, Supabase, PlanetScale, etc.).

### Stripe integration (TODO)

The concierge checkout page is a placeholder. To wire payments:

1. `npm install stripe @stripe/stripe-js`
2. Copy `.env.local.example` to `.env.local` and fill in Stripe keys
3. Create `/app/api/checkout/route.ts`:
   ```ts
   import Stripe from "stripe";
   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
   // POST: stripe.checkout.sessions.create({ ... })
   ```
4. Replace the placeholder `<form>` in `app/concierge/page.tsx` with a redirect to `/api/checkout`
5. Add `/app/concierge/success/page.tsx` for the post-payment confirmation page

---

## Routes

| Route | Description |
|---|---|
| `/` | Homepage |
| `/intake` | Couple intake form (4 steps) |
| `/audit` | Savings audit results (query params: `budget`, `guestCount`, `destination`, `leadId`) |
| `/concierge` | Concierge checkout (Stripe placeholder) |
| `/vendors` | Vendor program landing + application form |
| `/admin` | Internal admin — lists all leads and inquiries |
| `POST /api/leads` | Save couple lead |
| `POST /api/vendor-inquiry` | Save vendor inquiry |

---

## Environment variables

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

| Variable | Required | Description |
|---|---|---|
| `STRIPE_SECRET_KEY` | For payments | Stripe secret key (sk_test_... or sk_live_...) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | For payments | Stripe publishable key |
| `STRIPE_CONCIERGE_PRICE_ID` | For payments | Stripe Price ID for the $999 product |
| `NEXT_PUBLIC_APP_URL` | For payments | Full URL for Stripe redirect (default: http://localhost:3000) |

---

## Running locally

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The `data/` directory is created automatically on first form submission.

```bash
# Build for production
npm run build
npm start
```

---

## Production checklist

- [ ] Replace `lib/db.ts` with a real database
- [ ] Wire Stripe checkout (see Stripe integration section above)
- [ ] Add authentication to `/admin` (Clerk, NextAuth, or middleware shared secret)
- [ ] Add `data/` to `.gitignore`
- [ ] Set `NODE_ENV=production` and configure HTTPS
- [ ] Review and update savings estimates in `lib/audit.ts` with real data
