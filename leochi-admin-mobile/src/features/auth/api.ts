import { env } from "@/lib/config";
import { StoreInfo } from "@/types/domain";

async function readJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Request failed (${response.status}): ${text}`);
  }

  return (await response.json()) as T;
}

export async function loginOwner(input: { email: string; password: string }) {
  const response = await fetch(`${env.apiBaseUrl}/api/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      email: input.email,
      password: input.password,
    }),
  });

  return readJson<{ success: boolean }>(response);
}

export async function checkOwnerSession(): Promise<boolean> {
  try {
    const response = await fetch(`${env.apiBaseUrl}/api/admin/session`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      return false;
    }

    const payload = (await response.json()) as { authenticated?: boolean };
    return payload.authenticated === true;
  } catch {
    return false;
  }
}

export async function logoutOwner(): Promise<void> {
  await fetch(`${env.apiBaseUrl}/api/admin/logout`, {
    method: "POST",
    credentials: "include",
  });
}

export async function fetchStoreInfo(): Promise<StoreInfo> {
  const response = await fetch(`${env.apiBaseUrl}/api/admin/store-info`, {
    credentials: "include",
  });

  return readJson<StoreInfo>(response);
}
