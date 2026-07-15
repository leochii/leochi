import "server-only";

const PLACEHOLDER_PATTERNS = [
  /example\.supabase\.co/i,
  /^example-key$/i,
  /^changeme$/i,
  /^your[-_]/i,
];

function assertNotPlaceholder(name: string, value: string) {
  if (PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(value))) {
    throw new Error(`${name} contains a placeholder value. Set a real production value.`);
  }
}

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is required.`);
  }

  assertNotPlaceholder(name, value);
  return value;
}

export function getStripeSecretKey(): string {
  return requireEnv("STRIPE_SECRET_KEY");
}

export function getStripeWebhookSecret(): string {
  const secret = requireEnv("STRIPE_WEBHOOK_SECRET");

  if (!secret.startsWith("whsec_")) {
    throw new Error("STRIPE_WEBHOOK_SECRET must start with whsec_.");
  }

  return secret;
}

export function getSupabaseServerConfig() {
  return {
    url: requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    serviceRoleKey: requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
  };
}

export function getSiteUrl(fallbackOrigin?: string): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim() || process.env.SITE_URL?.trim();

  const raw = configured || fallbackOrigin;
  if (!raw) {
    throw new Error("Set NEXT_PUBLIC_SITE_URL or SITE_URL for checkout redirects.");
  }

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error("NEXT_PUBLIC_SITE_URL or SITE_URL must be an absolute URL.");
  }

  return url.origin;
}