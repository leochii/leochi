# Leochi Admin iPhone Installation (Owner Only)

This flow installs the app privately on your personal iPhone using EAS internal distribution and QR links.
No App Store release required.

## Prerequisites

- Apple ID enrolled in Apple Developer Program
- Expo account (same account used for EAS)
- Physical iPhone with camera
- `ADMIN_EMAIL` and `ADMIN_PASSWORD` configured on backend

## 1) Configure environment

```bash
cd leochi-admin-mobile
cp .env.example .env
```

Fill `.env`:

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_API_BASE_URL=https://leochi.co`

## 2) Install dependencies and EAS CLI

```bash
npm install
npm install -g eas-cli
```

## 3) Configure Expo + EAS project

```bash
npx expo login
npx eas login
npx eas-cli init
```

This links the app to EAS and writes the real `projectId` in:

- `app.json` -> `expo.extra.eas.projectId`

## 4) Configure iOS push notifications

Run credentials setup and follow prompts:

```bash
npx eas credentials -p ios
```

What to configure:

- Use bundle id: `co.leochi.admin`
- Enable Push Notifications capability for this app ID
- Create/use APNs key when prompted

## 5) Build internal iOS app and generate install QR

### Option A: Owner internal build (recommended for direct install)

```bash
npx eas build --platform ios --profile owner-internal
```

When build completes, EAS prints an install URL and QR code.

Install on iPhone:

1. Open the build URL or scan the QR from terminal/dashboard.
2. Install the app.
3. If required, trust developer profile in iPhone settings.

### Option B: Development client build + live QR bundle

Build dev client:

```bash
npm run build:ios:dev
```

Install dev client from EAS QR, then run Metro QR:

```bash
npm run start:dev-client:lan
```

Scan the dev-client QR with the installed Leochi Admin dev client.

If you need tunnel mode (outside same Wi-Fi), install ngrok globally first:

```bash
npm install -g @expo/ngrok@^4.1.0
npm run start:dev-client
```

## 6) Owner-only hardening

Backend env must be set in production:

- `ADMIN_EMAIL=your_owner_email@example.com`
- `ADMIN_PASSWORD=...`
- `ADMIN_SESSION_SECRET=...`

This enforces owner-only login from mobile app.

## 7) Verify push notifications on device

1. Login in app.
2. Accept iOS notification permission prompt.
3. Trigger a test order:

```bash
curl -X POST https://leochi.co/api/admin/test-order \
  -H "Content-Type: application/json" \
  -H "x-admin-test-secret: YOUR_ADMIN_TEST_ORDER_SECRET" \
  -d '{"customerName":"John Smith","customerEmail":"john@example.com","amountCad":120}'
```

Expected:

- iPhone receives notification
- Tapping notification opens order details

## 8) Useful commands (exact)

```bash
cd leochi-admin-mobile
npm install
npx expo login
npx eas login
npx eas-cli init
npx eas credentials -p ios
npx eas build --platform ios --profile owner-internal
npm run build:ios:dev
npm run build:ios:prod
npm run start:dev-client:lan
npm run start:dev-client
npm run typecheck
```
