import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import { env } from "@/lib/config";

type NotificationData = {
  orderId?: string;
};

const PUSH_TOKEN_KEY = "leochi_push_token_v1";
const PUSH_ENABLED_KEY = "leochi_push_enabled_v1";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function getProjectId(): string | undefined {
  const easProjectId = Constants.easConfig?.projectId;
  if (easProjectId) {
    return easProjectId;
  }

  const fromExpoConfig = Constants.expoConfig?.extra?.eas?.projectId;
  return typeof fromExpoConfig === "string" ? fromExpoConfig : undefined;
}

export async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (!Device.isDevice) {
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const permission = await Notifications.requestPermissionsAsync();
    finalStatus = permission.status;
  }

  if (finalStatus !== "granted") {
    return null;
  }

  const projectId = getProjectId();
  const tokenResponse = await Notifications.getExpoPushTokenAsync(
    projectId ? { projectId } : undefined
  );
  const token = tokenResponse.data;
  await SecureStore.setItemAsync(PUSH_TOKEN_KEY, token);
  return token;
}

export async function registerPushTokenWithBackend(token: string): Promise<void> {
  const response = await fetch(`${env.apiBaseUrl}/api/admin/push/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      token,
      platform: "ios",
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Push registration failed (${response.status}): ${text}`);
  }

  await SecureStore.setItemAsync(PUSH_TOKEN_KEY, token);
  await SecureStore.setItemAsync(PUSH_ENABLED_KEY, "true");
}

export async function getStoredPushToken(): Promise<string | null> {
  return SecureStore.getItemAsync(PUSH_TOKEN_KEY);
}

export async function getPushEnabledPreference(): Promise<boolean> {
  const value = await SecureStore.getItemAsync(PUSH_ENABLED_KEY);
  return value !== "false";
}

export async function setPushEnabledPreference(enabled: boolean): Promise<void> {
  await SecureStore.setItemAsync(PUSH_ENABLED_KEY, enabled ? "true" : "false");
}

export async function updatePushPreferenceWithBackend(token: string, enabled: boolean): Promise<void> {
  const response = await fetch(`${env.apiBaseUrl}/api/admin/push/preferences`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ token, enabled }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Push preference update failed (${response.status}): ${text}`);
  }
}

export function getOrderIdFromNotificationData(data: unknown): string | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const orderId = (data as NotificationData).orderId;
  return typeof orderId === "string" && orderId.length > 0 ? orderId : null;
}
