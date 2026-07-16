import React, { useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { RootNavigator } from "./src/navigation/RootNavigator";
import * as Notifications from "expo-notifications";
import { navigationRef } from "./src/navigation/navigation-ref";
import { getOrderIdFromNotificationData } from "./src/notifications/push";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#050505",
    card: "#0E0E0E",
    text: "#FFFFFF",
    border: "#222222",
    primary: "#FFFFFF"
  }
};

export default function App() {
  const pendingOrderIdRef = useRef<string | null>(null);

  useEffect(() => {
    const navigateFromResponse = (response: Notifications.NotificationResponse) => {
      const orderId = getOrderIdFromNotificationData(response.notification.request.content.data);
      if (!orderId) {
        return;
      }

      if (!navigationRef.isReady()) {
        pendingOrderIdRef.current = orderId;
        return;
      }

      navigationRef.navigate("OrderDetails", { orderId });
    };

    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      navigateFromResponse(response);
    });

    void Notifications.getLastNotificationResponseAsync().then((lastResponse) => {
      if (lastResponse) {
        navigateFromResponse(lastResponse);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <NavigationContainer
      theme={theme}
      ref={navigationRef}
      onReady={() => {
        const pendingOrderId = pendingOrderIdRef.current;
        if (!pendingOrderId) {
          return;
        }

        pendingOrderIdRef.current = null;
        navigationRef.navigate("OrderDetails", { orderId: pendingOrderId });
      }}
    >
      <StatusBar style="light" />
      <RootNavigator />
    </NavigationContainer>
  );
}
