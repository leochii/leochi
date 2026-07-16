import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const ADMIN_SESSION_COOKIE = "admin-session";
export const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 24;

type AdminSessionPayload = {
  role: "admin";
  iat: number;
  exp: number;
};

function getAdminSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim() || "";

  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is required.");
  }

  return secret;
}

function getOptionalAdminSessionSecret(): string | null {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim() || "";
  return secret.length > 0 ? secret : null;
}

function sign(value: string, secret: string): string {
  return createHmac("sha256", secret)
    .update(value)
    .digest("base64url");
}

function safeBase64UrlDecode(value: string): string | null {
  try {
    return Buffer.from(value, "base64url").toString("utf8");
  } catch {
    return null;
  }
}

function parseCookieHeader(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) {
    return null;
  }

  const target = `${name}=`;
  const pairs = cookieHeader.split(";");

  for (const pair of pairs) {
    const value = pair.trim();
    if (!value.startsWith(target)) {
      continue;
    }

    return value.slice(target.length);
  }

  return null;
}

export function createAdminSessionToken(nowMs = Date.now()): string {
  const secret = getAdminSessionSecret();
  const iat = Math.floor(nowMs / 1000);
  const exp = iat + ADMIN_SESSION_TTL_SECONDS;
  const payload: AdminSessionPayload = {
    role: "admin",
    iat,
    exp,
  };

  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = sign(encodedPayload, secret);

  return `${encodedPayload}.${signature}`;
}

export function verifyAdminSessionToken(token: string | null | undefined): boolean {
  const secret = getOptionalAdminSessionSecret();
  if (!secret) {
    return false;
  }

  if (!token) {
    return false;
  }

  const parts = token.split(".");
  if (parts.length !== 2) {
    return false;
  }

  const [encodedPayload, providedSignature] = parts;
  const expectedSignature = sign(encodedPayload, secret);
  const providedBuffer = Buffer.from(providedSignature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (providedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  if (!timingSafeEqual(providedBuffer, expectedBuffer)) {
    return false;
  }

  const decodedPayload = safeBase64UrlDecode(encodedPayload);
  if (!decodedPayload) {
    return false;
  }

  try {
    const payload = JSON.parse(decodedPayload) as Partial<AdminSessionPayload>;
    const now = Math.floor(Date.now() / 1000);

    if (payload.role !== "admin") {
      return false;
    }

    if (typeof payload.exp !== "number" || payload.exp <= now) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export function isAdminRequestAuthenticated(request: Request | NextRequest): boolean {
  const token = parseCookieHeader(
    request.headers.get("cookie"),
    ADMIN_SESSION_COOKIE
  );

  return verifyAdminSessionToken(token);
}

export async function isAdminPageAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  return verifyAdminSessionToken(token);
}

export async function requireAdminPageAuth(): Promise<void> {
  const authenticated = await isAdminPageAuthenticated();

  if (!authenticated) {
    redirect("/admin/login");
  }
}