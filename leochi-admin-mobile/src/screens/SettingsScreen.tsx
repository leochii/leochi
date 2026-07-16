import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/types";
import { clearOwnerSession } from "@/features/auth/session";
import { fetchStoreInfo, logoutOwner } from "@/features/auth/api";
import {
  getPushEnabledPreference,
  getStoredPushToken,
  registerForPushNotificationsAsync,
  registerPushTokenWithBackend,
  setPushEnabledPreference,
  updatePushPreferenceWithBackend,
} from "@/notifications/push";
import { StoreInfo } from "@/types/domain";

type Props = NativeStackScreenProps<RootStackParamList, "Settings">;

export function SettingsScreen({ navigation }: Props) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [storeInfo, setStoreInfo] = useState<StoreInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingNotif, setUpdatingNotif] = useState(false);

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      const [enabled, info] = await Promise.all([
        getPushEnabledPreference(),
        fetchStoreInfo(),
      ]);
      setNotificationsEnabled(enabled);
      setStoreInfo(info);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  async function onToggleNotifications(value: boolean) {
    try {
      setUpdatingNotif(true);
      setNotificationsEnabled(value);

      let token = await getStoredPushToken();

      if (!token && value) {
        token = await registerForPushNotificationsAsync();
      }

      if (token) {
        if (value) {
          await registerPushTokenWithBackend(token);
        }
        await updatePushPreferenceWithBackend(token, value);
      }

      await setPushEnabledPreference(value);
    } catch {
      setNotificationsEnabled(!value);
      Alert.alert("Update failed", "Unable to update notification settings.");
    } finally {
      setUpdatingNotif(false);
    }
  }

  async function onLogout() {
    try {
      await logoutOwner();
    } finally {
      await clearOwnerSession();
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Settings</Text>
      <Text style={styles.subhead}>Owner app preferences</Text>

      {loading ? <ActivityIndicator color="#FFFFFF" style={styles.loader} /> : null}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.rowBetween}>
          <Text style={styles.label}>Push notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={(value) => void onToggleNotifications(value)}
            disabled={updatingNotif}
            thumbColor="#FFFFFF"
            trackColor={{ false: "#333333", true: "#666666" }}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Store Information</Text>
        <Text style={styles.infoLine}>{storeInfo?.storeName || "LEOCHI"}</Text>
        <Text style={styles.infoLine}>{storeInfo?.website || "https://leochi.co"}</Text>
        <Text style={styles.infoLine}>{storeInfo?.ownerEmail || "Owner account"}</Text>
      </View>

      <Pressable style={styles.logoutButton} onPress={() => void onLogout()}>
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050505",
    padding: 16,
  },
  heading: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 2,
  },
  subhead: {
    color: "#8F8F8F",
    marginBottom: 14,
  },
  loader: {
    marginBottom: 12,
  },
  section: {
    borderWidth: 1,
    borderColor: "#222222",
    borderRadius: 12,
    backgroundColor: "#101010",
    padding: 12,
    marginBottom: 10,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontWeight: "700",
    marginBottom: 8,
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    color: "#EFEFEF",
  },
  infoLine: {
    color: "#B5B5B5",
    marginBottom: 4,
  },
  logoutButton: {
    marginTop: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  logoutText: {
    color: "#090909",
    fontWeight: "700",
  },
});
