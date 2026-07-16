import * as SecureStore from "expo-secure-store";

const SESSION_KEY = "leochi_owner_session_v1";

type StoredSession = {
  email: string;
  signedInAt: string;
};

export async function saveOwnerSession(email: string): Promise<void> {
  const payload: StoredSession = {
    email,
    signedInAt: new Date().toISOString(),
  };

  await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(payload));
}

export async function getOwnerSession(): Promise<StoredSession | null> {
  const raw = await SecureStore.getItemAsync(SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<StoredSession>;
    if (!parsed.email || !parsed.signedInAt) {
      return null;
    }

    return {
      email: parsed.email,
      signedInAt: parsed.signedInAt,
    };
  } catch {
    return null;
  }
}

export async function clearOwnerSession(): Promise<void> {
  await SecureStore.deleteItemAsync(SESSION_KEY);
}
