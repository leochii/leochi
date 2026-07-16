import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/types";
import { fetchDashboardMetrics } from "@/features/orders/api";
import { DashboardMetrics } from "@/types/domain";

type Props = NativeStackScreenProps<RootStackParamList, "Dashboard">;

export function DashboardScreen({ navigation }: Props) {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const loadMetrics = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchDashboardMetrics();
      setMetrics(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMetrics();
  }, [loadMetrics]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Owner Dashboard</Text>
      <Text style={styles.subhead}>Live commerce overview</Text>

      {loading && !metrics ? (
        <ActivityIndicator color="#FFFFFF" style={styles.loader} />
      ) : null}

      <View style={styles.grid}>
        <MetricCard label="Today's Revenue" value={`CAD $${((metrics?.todaysRevenue || 0) / 100).toFixed(2)}`} />
        <MetricCard label="Revenue This Month" value={`CAD $${((metrics?.revenueThisMonth || 0) / 100).toFixed(2)}`} />
        <MetricCard label="Total Orders" value={String(metrics?.totalOrders || 0)} />
        <MetricCard label="Pending Orders" value={String(metrics?.pendingOrders || 0)} />
      </View>

      <Section title="Best Selling Products">
        {(metrics?.bestSellingProducts || []).length === 0 ? (
          <Text style={styles.empty}>No product sales yet.</Text>
        ) : (
          metrics?.bestSellingProducts.map((product) => (
            <View style={styles.listRow} key={product.name}>
              <Text style={styles.listTitle}>{product.name}</Text>
              <Text style={styles.listMeta}>{product.unitsSold} sold</Text>
              <Text style={styles.listMeta}>CAD ${(product.revenue / 100).toFixed(2)}</Text>
            </View>
          ))
        )}
      </Section>

      <Section title="Recent Orders">
        {(metrics?.recentOrders || []).length === 0 ? (
          <Text style={styles.empty}>No recent orders.</Text>
        ) : (
          metrics?.recentOrders.map((order) => (
            <Pressable key={order.id} style={styles.listRow} onPress={() => navigation.navigate("OrderDetails", { orderId: order.id })}>
              <Text style={styles.listTitle}>Order {order.orderNumber}</Text>
              <Text style={styles.listMeta}>{order.customerName || "Unknown customer"}</Text>
              <Text style={styles.listMeta}>CAD ${(order.amount / 100).toFixed(2)} · {order.status.toUpperCase()}</Text>
            </Pressable>
          ))
        )}
      </Section>

      <Pressable style={styles.secondaryButton} onPress={() => navigation.navigate("Settings")}>
        <Text style={styles.secondaryText}>Settings</Text>
      </Pressable>

      <Pressable style={styles.primaryButton} onPress={() => navigation.navigate("OrdersList")}>
        <Text style={styles.primaryText}>Open Orders</Text>
      </Pressable>

      <Pressable style={styles.secondaryButton} onPress={() => navigation.navigate("Analytics")}>
        <Text style={styles.secondaryText}>Analytics</Text>
      </Pressable>

      <Pressable style={styles.ghostButton} onPress={() => void loadMetrics()}>
        <Text style={styles.ghostText}>Refresh Metrics</Text>
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

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={styles.cardValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050505",
  },
  content: {
    padding: 16
  },
  heading: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 2
  },
  subhead: {
    color: "#8F8F8F",
    marginBottom: 14,
    letterSpacing: 0.4
  },
  loader: {
    marginVertical: 10
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  card: {
    width: "48%",
    backgroundColor: "#0F0F0F",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#222222",
    padding: 12,
    minHeight: 92
  },
  cardLabel: {
    color: "#9A9A9A",
    fontSize: 12,
    marginBottom: 8
  },
  cardValue: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700"
  },
  section: {
    borderWidth: 1,
    borderColor: "#222222",
    borderRadius: 12,
    backgroundColor: "#101010",
    padding: 12,
    marginTop: 12
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontWeight: "700",
    marginBottom: 8
  },
  listRow: {
    borderWidth: 1,
    borderColor: "#272727",
    borderRadius: 10,
    backgroundColor: "#0A0A0A",
    padding: 10,
    marginBottom: 8
  },
  listTitle: {
    color: "#FFFFFF",
    fontWeight: "700"
  },
  listMeta: {
    color: "#A1A1A1",
    marginTop: 2,
    fontSize: 12
  },
  empty: {
    color: "#888888"
  },
  primaryButton: {
    marginTop: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center"
  },
  primaryText: {
    color: "#090909",
    fontWeight: "700"
  },
  ghostButton: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#2D2D2D",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center"
  },
  ghostText: {
    color: "#F4F4F4",
    fontWeight: "700"
  },
  secondaryButton: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center"
  },
  secondaryText: {
    color: "#FFFFFF",
    fontWeight: "700"
  }
});
