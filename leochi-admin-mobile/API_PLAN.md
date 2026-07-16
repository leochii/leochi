# API & Data Plan (Phase 1)

## Objective

Support owner-only order operations from iPhone with minimal surface area.

## Runtime Sources

1. Existing Leochi admin APIs for mutations and auth
2. Supabase for secure order data reads when needed

## Required Environment Variables

- EXPO_PUBLIC_API_BASE_URL
- EXPO_PUBLIC_SUPABASE_URL
- EXPO_PUBLIC_SUPABASE_ANON_KEY

## Auth Flow

1. Login screen posts password to /api/admin/login
2. Server sets httpOnly admin session cookie
3. App reuses cookie-bound requests for protected routes
4. Logout (phase 2 UX) posts /api/admin/logout

## Endpoints

### Dashboard
- GET /api/admin/dashboard
- Response:
  {
    "ordersToday": number,
    "revenueToday": number,
    "pendingOrders": number,
    "recentOrders": OrderListItem[]
  }

### Orders List
- GET /api/admin/orders/list?status=&q=
- Supports search and status filter

### Order Details
- GET /api/admin/orders/:id

### Actions
- POST /api/admin/orders/update
- Payload for shipped update:
  {
    "id": string,
    "status": "shipped",
    "tracking_number": string,
    "carrier": string,
    "sendShippingEmail": true
  }

### Push Registration
- POST /api/admin/push/register
- Payload:
  {
    "token": string,
    "platform": "ios"
  }

### New Order Push Event
- Source: POST /api/webhook (checkout.session.completed)
- Notification title: "🔥 New Order"
- Notification body:
  - Order #XXXX
  - Customer Name
  - Total Amount
- Notification data payload includes `orderId` for deep-link navigation to Order Details.

## Error Model

- 401: invalid owner session -> return to Login
- 4xx: validation issue -> inline message
- 5xx: server/network issue -> retry CTA + fallback message

## Security Notes

- No service-role key on device
- No plain admin boolean on client
- Credentials never hardcoded in app
- Owner-only distribution (private builds)
