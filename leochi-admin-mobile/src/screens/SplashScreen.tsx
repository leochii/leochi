import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/types";
import { getOwnerSession, clearOwnerSession } from "@/features/auth/session";
import { checkOwnerSession } from "@/features/auth/api";

type Props = NativeStackScreenProps<RootStackParamList, "Splash">;

export function SplashScreen({ navigation }: Props) {
  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      const session = await getOwnerSession();
      if (!session) {
        if (mounted) {
          navigation.replace("Login");
        }
        return;
      }

      const activeServerSession = await checkOwnerSession();
      if (!activeServerSession) {
        await clearOwnerSession();
        if (mounted) {
          navigation.replace("Login");
        }
        return;
      }

      if (mounted) {
        navigation.replace("Dashboard");
      }
    }

    void bootstrap();

    return () => {
      mounted = false;
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.brand}>LEOCHI</Text>
      <Text style={styles.sub}>Owner Console</Text>
      <ActivityIndicator color="#E4D3BC" style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0B0D",
    justifyContent: "center",
    alignItems: "center"
  },
  brand: {
    color: "#F5F5F5",
    fontSize: 36,
    fontWeight: "700",
    letterSpacing: 3
  },
  sub: {
    color: "#A5A5AA",
    marginTop: 8,
    letterSpacing: 1.5
  },
  loader: {
    marginTop: 20
  }
});
