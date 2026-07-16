import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { fetchAnalyticsMetrics } from "@/features/orders/api";
import { AnalyticsMetrics, AnalyticsPoint } from "@/types/domain";

export function AnalyticsScreen() {
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchAnalyticsMetrics();
      setMetrics(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAnalytics();
  }, [loadAnalytics]);

  const chart = useMemo(() => buildGraph(metrics?.revenueGraph || []), [metrics?.revenueGraph]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Analytics</Text>
      <Text style={styles.subhead}>Monthly revenue and product performance</Text>

      {loading && !metrics ? <ActivityIndicator color="#FFFFFF" style={styles.loader} /> : null}

      <View style={styles.grid}>
        <MetricCard label="Revenue Today" value={`CAD $${((metrics?.revenueToday || 0) / 100).toFixed(2)}`} />
        <MetricCard label="Revenue This Month" value={`CAD $${((metrics?.revenueThisMonth || 0) / 100).toFixed(2)}`} />
        <MetricCard label="Orders This Month" value={String(metrics?.ordersThisMonth || 0)} />
      </View>

      <Section title="Revenue Graph">
        <View style={styles.chartWrap}>
          {chart.length === 0 ? (
            <Text style={styles.empty}>No revenue yet this month.</Text>
          ) : (
            chart.map((point) => (
              <View key={point.date} style={styles.barRow}>
                <Text style={styles.barLabel}>{point.label}</Text>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${point.ratio}%` }]} />
                </View>
                <Text style={styles.barValue}>${(point.value / 100).toFixed(0)}</Text>
              </View>
            ))
          )}
        </View>
      </Section>

      <Section title="Best Selling Products">
        {(metrics?.bestSellingProducts || []).length === 0 ? (
          <Text style={styles.empty}>No product data available.</Text>
        ) : (
          metrics?.bestSellingProducts.map((item) => (
            <View style={styles.productRow} key={item.name}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productMeta}>{item.unitsSold} sold</Text>
              <Text style={styles.productMeta}>CAD ${(item.revenue / 100).toFixed(2)}</Text>
            </View>
          ))
        )}
      </Section>

      <Pressable style={styles.refreshButton} onPress={() => void loadAnalytics()}>
        <Text style={styles.refreshText}>Refresh Analytics</Text>
      </Pressable>
    </ScrollView>
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function buildGraph(points: AnalyticsPoint[]) {
  if (points.length === 0) {
    return [] as Array<{ date: string; label: string; value: number; ratio: number }>;
  }

  const sampled = points.length > 10 ? points.filter((_, idx) => idx % Math.ceil(points.length / 10) === 0) : points;
  const max = Math.max(...sampled.map((point) => point.revenue), 1);

  return sampled.map((point) => ({
    date: point.date,
    label: point.date.slice(5),
    value: point.revenue,
    ratio: Math.max(8, Math.round((point.revenue / max) * 100)),
  }));
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050505",
  },
  content: {
    padding: 14,
    paddingBottom: 20,
  },
  heading: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 2,
  },
  subhead: {
    color: "#9A9A9A",
    marginBottom: 14,
  },
  loader: {
    marginVertical: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 10,
  },
  card: {
    width: "48%",
    backgroundColor: "#0F0F0F",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#222222",
    padding: 12,
    minHeight: 92,
  },
  cardLabel: {
    color: "#9A9A9A",
    fontSize: 12,
    marginBottom: 8,
  },
  cardValue: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
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
  chartWrap: {
    gap: 8,
  },
  barRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  barLabel: {
    color: "#A1A1A1",
    width: 42,
    fontSize: 12,
  },
  barTrack: {
    flex: 1,
    height: 10,
    borderRadius: 999,
    backgroundColor: "#1C1C1C",
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
  },
  barValue: {
    color: "#B5B5B5",
    width: 42,
    textAlign: "right",
    fontSize: 12,
  },
  productRow: {
    borderWidth: 1,
    borderColor: "#252525",
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    backgroundColor: "#0B0B0B",
  },
  productName: {
    color: "#FFFFFF",
    fontWeight: "700",
    marginBottom: 2,
  },
  productMeta: {
    color: "#A8A8A8",
    fontSize: 12,
  },
  empty: {
    color: "#808080",
  },
  refreshButton: {
    borderWidth: 1,
    borderColor: "#2D2D2D",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  refreshText: {
    color: "#F4F4F4",
    fontWeight: "700",
  },
});
