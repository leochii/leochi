import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/types";
import { fetchOrderDetails, markOrderShipped } from "@/features/orders/api";
import { OrderDetails } from "@/types/domain";

type Props = NativeStackScreenProps<RootStackParamList, "OrderDetails">;

export function OrderDetailsScreen({ route }: Props) {
  const { orderId } = route.params;
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");

  const loadOrder = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchOrderDetails(orderId);
      setOrder(data);
      setTrackingNumber(data.trackingNumber || "");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    void loadOrder();
  }, [loadOrder]);

  async function onMarkAsShipped(sendShippingEmail: boolean) {
    if (!trackingNumber.trim()) {
      Alert.alert("Tracking required", "Enter tracking number before shipping.");
      return;
    }

    try {
      setBusy(true);
      await markOrderShipped({
        id: orderId,
        trackingNumber: trackingNumber.trim(),
        carrier: "Canada Post",
        sendShippingEmail,
      });

      Alert.alert(
        "Updated",
        sendShippingEmail ? "Order shipped and shipping email sent." : "Order marked as shipped."
      );
      await loadOrder();
    } catch {
      Alert.alert("Update failed", "Could not update this order.");
    } finally {
      setBusy(false);
    }
  }

  const address = [order?.shippingAddress, [order?.city, order?.province].filter(Boolean).join(", "), order?.postalCode]
    .filter((part) => typeof part === "string" && part.length > 0)
    .join(" ");

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Order Details</Text>

      {loading ? <ActivityIndicator color="#FFFFFF" style={styles.loader} /> : null}

      <Section title="Customer Information">
        <Line label="Customer Name" value={order?.customerName || "Unknown"} />
        <Line label="Email" value={order?.customerEmail || "Not provided"} />
        <Line label="Order Number" value={order?.orderNumber || orderId} />
      </Section>

      <Section title="Address">
        <Line label="Shipping Address" value={address || "Not available"} />
      </Section>

      <Section title="Items">
        {(order?.products || []).length === 0 ? <Line label="Items" value="No items" /> : null}
        {(order?.products || []).map((item, idx) => (
          <View style={styles.productRow} key={`${item.name}-${idx}`}>
            <Text style={styles.productName}>{item.name || "Item"}</Text>
            <Text style={styles.productMeta}>Size: {item.size || "N/A"}</Text>
            <Text style={styles.productMeta}>Quantity: {item.quantity || 1}</Text>
          </View>
        ))}
        <Line label="Total Price" value={`CAD $${((order?.amount || 0) / 100).toFixed(2)}`} />
      </Section>

      <Section title="Payment & Tracking">
        <Line label="Payment Status" value={order?.paymentStatus || "Unknown"} />
        <Line label="Tracking Number" value={order?.trackingNumber || "Pending"} />
        <TextInput
          value={trackingNumber}
          onChangeText={setTrackingNumber}
          placeholder="Tracking number"
          placeholderTextColor="#767676"
          style={styles.input}
        />
      </Section>

      <Section title="Order Timeline">
        {(order?.timeline || []).length === 0 ? <Line label="Timeline" value="No timeline available" /> : null}
        {(order?.timeline || []).map((entry) => (
          <View key={entry.key} style={styles.timelineRow}>
            <View style={styles.timelineDot} />
            <View>
              <Text style={styles.timelineLabel}>{entry.label}</Text>
              <Text style={styles.timelineTime}>{new Date(entry.timestamp).toLocaleString()}</Text>
            </View>
          </View>
        ))}
      </Section>

      <Pressable style={styles.primaryBtn} onPress={() => void onMarkAsShipped(false)} disabled={busy || loading}>
        <Text style={styles.primaryBtnText}>{busy ? "Updating..." : "Mark as Shipped"}</Text>
      </Pressable>

      <Pressable style={styles.secondaryBtn} onPress={() => void onMarkAsShipped(true)} disabled={busy || loading}>
        <Text style={styles.secondaryBtnText}>Send Shipping Email</Text>
      </Pressable>
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.line}>
      <Text style={styles.lineLabel}>{label}</Text>
      <Text style={styles.lineValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050505"
  },
  content: {
    padding: 14
  },
  heading: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12
  },
  loader: {
    marginBottom: 10
  },
  section: {
    borderWidth: 1,
    borderColor: "#222222",
    borderRadius: 12,
    backgroundColor: "#101010",
    padding: 12,
    marginBottom: 10
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontWeight: "700",
    marginBottom: 8
  },
  line: {
    marginBottom: 6
  },
  lineLabel: {
    color: "#A1A1A1",
    fontSize: 12
  },
  lineValue: {
    color: "#FFFFFF"
  },
  productRow: {
    borderWidth: 1,
    borderColor: "#262626",
    borderRadius: 10,
    backgroundColor: "#0A0A0A",
    padding: 10,
    marginBottom: 8,
  },
  productName: {
    color: "#FFFFFF",
    fontWeight: "700",
    marginBottom: 2,
  },
  productMeta: {
    color: "#B2B2B2",
    fontSize: 12,
  },
  timelineRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
    alignItems: "flex-start",
  },
  timelineDot: {
    marginTop: 4,
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
  },
  timelineLabel: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  timelineTime: {
    color: "#A5A5A5",
    fontSize: 12,
  },
  input: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    borderRadius: 10,
    color: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#080808"
  },
  primaryBtn: {
    marginTop: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center"
  },
  primaryBtnText: {
    color: "#090909",
    fontWeight: "700"
  },
  secondaryBtn: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#2F2F2F",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center"
  },
  secondaryBtnText: {
    color: "#FFFFFF",
    fontWeight: "700"
  }
});
