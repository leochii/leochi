# LEOCHI Storefront

Next.js 16 storefront and admin panel with Stripe Checkout, Stripe webhooks, Supabase order storage, and Resend transactional email.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create your local environment file from [.env.example](.env.example):

```bash
cp .env.example .env.local
```

3. Fill all required variables with real values (no placeholders).

4. Run locally:

```bash
npm run dev
```

## Required Environment Variables

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `ADMIN_PASSWORD`

## Stripe Live Mode Notes

- In production, `STRIPE_SECRET_KEY` must be a live key (`sk_live_...`).
- Webhook signature validation uses `STRIPE_WEBHOOK_SECRET` and rejects invalid signatures.
- Checkout success and cancel URLs are generated from `NEXT_PUBLIC_SITE_URL` (or `SITE_URL`).

## Build

```bash
npm run build
```

## Custom Printing Setup

1. Run the SQL in [supabase/custom_printing_requests.sql](/Users/nimaadiidar/leochi/supabase/custom_printing_requests.sql) to create the `custom_printing_requests` table and the `custom-printing-designs` storage bucket.
2. Verify your Resend domain can send from `orders@leochi.co`.
3. Confirm the uploaded design bucket stays public if you want admins to open the stored file URLs directly.

## Deploy (Vercel)

1. Add all required environment variables in Vercel Project Settings.
2. Ensure values are set for the Production environment.
3. Deploy and verify:
	- `/api/checkout` creates sessions
	- `/api/webhook` receives signed Stripe events
	- `/success` and `/cancel` render correctly

## Security Notes

- Never commit `.env.local`.
- Replace placeholder values before building for production.
- Admin routes and admin APIs are protected by proxy-based cookie checks.