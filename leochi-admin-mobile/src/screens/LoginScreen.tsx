import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/types";
import { loginOwner } from "@/features/auth/api";
import { saveOwnerSession } from "@/features/auth/session";
import {
  getPushEnabledPreference,
  registerForPushNotificationsAsync,
  registerPushTokenWithBackend,
} from "@/notifications/push";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onLogin() {
    if (!email.trim() || !password) {
      Alert.alert("Credentials required", "Enter owner email and password.");
      return;
    }

    try {
      setLoading(true);
      await loginOwner({ email: email.trim().toLowerCase(), password });
      await saveOwnerSession(email.trim().toLowerCase());

      try {
        const pushEnabled = await getPushEnabledPreference();
        if (pushEnabled) {
          const token = await registerForPushNotificationsAsync();
          if (token) {
            await registerPushTokenWithBackend(token);
          }
        }
      } catch (pushError) {
        console.error("Push registration failed:", pushError);
      }

      navigation.replace("Dashboard");
    } catch {
      Alert.alert("Access denied", "Invalid owner credentials or server unavailable.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.brand}>LEOCHI</Text>
      <Text style={styles.title}>Owner Access</Text>
      <Text style={styles.subtitle}>Private Operations App</Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="Owner email"
        placeholderTextColor="#767676"
        style={styles.input}
      />
      <TextInput
        value={password}
        secureTextEntry
        onChangeText={setPassword}
        placeholder="Password"
        placeholderTextColor="#767676"
        style={styles.input}
      />
      <Pressable style={styles.button} onPress={onLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Signing In..." : "Sign In"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050505",
    padding: 24,
    justifyContent: "center"
  },
  brand: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "700",
    letterSpacing: 4,
    marginBottom: 8
  },
  title: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 6
  },
  subtitle: {
    color: "#9A9A9A",
    marginBottom: 18,
    letterSpacing: 0.4
  },
  input: {
    borderWidth: 1,
    borderColor: "#2B2B2B",
    borderRadius: 10,
    color: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    backgroundColor: "#0E0E0E"
  },
  button: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: "center"
  },
  buttonText: {
    color: "#090909",
    fontWeight: "700"
  }
});
