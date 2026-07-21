import "server-only";

const PLACEHOLDER_PATTERNS = [
  /example\.supabase\.co/i,
  /^example-key$/i,
  /^changeme$/i,
  /^your[-_]/i,
];

function isPlaceholderValue(value: string) {
  return PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(value));
}

function assertNotPlaceholder(name: string, value: string) {
  if (isPlaceholderValue(value)) {
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

export function getTelegramNotificationConfig() {
  const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();

  if (!botToken || !chatId) {
    return null;
  }

  if (isPlaceholderValue(botToken)) {
    throw new Error("TELEGRAM_BOT_TOKEN contains a placeholder value. Set a real production value.");
  }

  if (isPlaceholderValue(chatId)) {
    throw new Error("TELEGRAM_CHAT_ID contains a placeholder value. Set a real production value.");
  }

  return { botToken, chatId };
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