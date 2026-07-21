# README_ADMIN_APP

Production setup and verification guide for the Leochi Admin mobile app and backend integration.

## 1. Required Environment Variables

Configure these in Vercel Production and local `.env.local` where needed:

- `NEXT_PUBLIC_SITE_URL`
- `SITE_URL` (optional fallback)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- `ADMIN_PASSWORD`
- `ADMIN_EMAIL` (recommended, owner-only email restriction)
- `ADMIN_SESSION_SECRET`
- `ADMIN_TEST_ORDER_SECRET` (required for test-order endpoint when no admin cookie is present)

## 2. Supabase Migration Execution (Production)

Run these SQL files in Supabase SQL Editor in order:

1. `supabase/migrations/20260716_admin_push_tokens.sql`
2. `supabase/migrations/20260716_notification_logs.sql`

Detailed safe steps and verification SQL are in `supabase/MIGRATIONS_ADMIN_APP.md`.

## 3. Stripe Configuration

- Set `STRIPE_SECRET_KEY` to live key.
- Create webhook endpoint in Stripe Dashboard pointing to:
  - `https://YOUR_DOMAIN/api/webhook`
- Subscribe at minimum to:
  - `checkout.session.completed`
- Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`.

## 4. Supabase Configuration

- Ensure `orders` table exists and is writable by service-role key.
- Apply admin app migrations for:
  - `admin_push_tokens`
  - `notification_logs`
- Confirm service-role key has insert/select/update access to these tables.

## 5. Resend Configuration

- Set `RESEND_API_KEY`.
- Verify sender domain for `orders@leochi.co` (or your configured sender).

## 6. API Verification (Production)

Use admin-authenticated requests for admin routes.

### Public route checks

```bash
curl -i https://YOUR_DOMAIN/api/webhook
```
Expected: 400 with missing signature for GET/invalid requests.

### Admin route checks (with session cookie)

- `GET /api/admin/session`
- `GET /api/admin/dashboard`
- `GET /api/admin/orders/list`
- `GET /api/admin/orders/{id}`
- `GET /api/admin/analytics`
- `GET /api/admin/push/tokens`
- `GET /api/admin/notifications/logs`
- `GET /api/admin/store-info`

## 7. Test Order Simulation Endpoint

Endpoint:

- `POST /api/admin/test-order`

Auth options:

- Admin session cookie, or
- Header `x-admin-test-secret: <ADMIN_TEST_ORDER_SECRET>`

Example:

```bash
curl -X POST https://YOUR_DOMAIN/api/admin/test-order \
  -H "Content-Type: application/json" \
  -H "x-admin-test-secret: YOUR_SECRET" \
  -d '{
    "customerName": "John Smith",
    "customerEmail": "john@example.com",
    "amountCad": 120
  }'
```

What this validates:

- New order row appears in `orders`
- Dashboard metrics update
- Orders list updates
- Push notification dispatches to active tokens
- Notification log written to `notification_logs`

## 8. Mobile App Runtime Setup

In `leochi-admin-mobile/.env`:

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_API_BASE_URL=https://YOUR_DOMAIN`

Then:

```bash
cd leochi-admin-mobile
npm install
npm run start
```

## 9. Production Checklist

- [ ] All required env vars configured in Vercel Production
- [ ] Supabase migrations executed and verified
- [ ] Stripe webhook configured and signature validated
- [ ] Resend API key and sender domain verified
- [ ] Admin login works with owner-only restriction
- [ ] Push token registration works from mobile app
- [ ] `/api/admin/test-order` creates order and triggers push/log entry
- [ ] Dashboard and Orders screens reflect test order

## 10. Build Verification

From repository root:

```bash
npm run build
```

From mobile app:

```bash
cd leochi-admin-mobile
npm run typecheck
```
