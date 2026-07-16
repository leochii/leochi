# Leochi Admin Mobile (Private Owner App)

Private iPhone-focused Expo app for owner operations. This app is not intended for App Store publication.

## Phase 1 Scope

- Project architecture and folder structure
- Navigation skeleton
- Screen contracts for:
  - Splash
  - Login (owner only)
  - Dashboard
  - Orders List
  - Order Details
- API/service plan to connect to existing Leochi backend
- Push notification support for new orders

## Run Locally

1. Copy .env.example to .env
2. Fill runtime values:
   - EXPO_PUBLIC_SUPABASE_URL
   - EXPO_PUBLIC_SUPABASE_ANON_KEY
   - EXPO_PUBLIC_API_BASE_URL
3. Install deps and start:

```bash
npm install
npm run start
```

## Navigation Architecture

- Splash -> Login -> Dashboard
- Dashboard -> Orders List -> Order Details

## API Plan (Phase 1)

Reads:
- GET /api/admin/dashboard
- GET /api/admin/orders/list
- GET /api/admin/orders/:id

Writes:
- POST /api/admin/orders/update
  - mark shipped
  - trigger shipping email

Auth:
- POST /api/admin/login
- POST /api/admin/logout

Push:
- POST /api/admin/push/register
- Triggered by Stripe webhook on new paid order

## Folder Structure

```text
leochi-admin-mobile/
  App.tsx
  app.json
  package.json
  tsconfig.json
  babel.config.js
  .env.example
  src/
    navigation/
      RootNavigator.tsx
      types.ts
    screens/
      SplashScreen.tsx
      LoginScreen.tsx
      DashboardScreen.tsx
      OrdersListScreen.tsx
      OrderDetailsScreen.tsx
    features/
      orders/
        api.ts
    lib/
      config.ts
      supabase.ts
    types/
      domain.ts
```

## Notes

- Keep this app private and distributed internally only.
