import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/types";
import { OrderListItem } from "@/types/domain";
import { fetchOrders } from "@/features/orders/api";

type Props = NativeStackScreenProps<RootStackParamList, "OrdersList">;
const filters = ["all", "pending", "paid", "shipped"] as const;

type Filter = (typeof filters)[number];

export function OrdersListScreen({ navigation }: Props) {
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);

  const loadOrders = useCallback(async (queryText: string, filter: Filter) => {
    try {
      setLoading(true);
      const data = await fetchOrders({
        q: queryText.trim() || undefined,
        status: filter === "all" ? undefined : filter,
      });
      setOrders(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadOrders(search, statusFilter);
    }, 220);

    return () => clearTimeout(timer);
  }, [search, statusFilter, loadOrders]);

  const filtered = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      const q = search.trim().toLowerCase();
      if (!q) {
        return matchesStatus;
      }

      const haystack = `${order.orderNumber} ${order.customerName || ""}`.toLowerCase();
      return matchesStatus && haystack.includes(q);
    });
  }, [orders, search, statusFilter]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Orders</Text>
      <TextInput
        style={styles.search}
        value={search}
        onChangeText={setSearch}
        placeholder="Search by email or order number"
        placeholderTextColor="#767676"
      />

      <FlatList
        horizontal
        data={filters}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => setStatusFilter(item)}
            style={[styles.filterPill, item === statusFilter && styles.filterPillActive]}
          >
            <Text style={[styles.filterText, item === statusFilter && styles.filterTextActive]}>{item === "all" ? "ALL" : item.toUpperCase()}</Text>
          </Pressable>
        )}
      />

      {loading ? <ActivityIndicator color="#FFFFFF" style={styles.loader} /> : null}

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.empty}>No orders yet.</Text>}
        renderItem={({ item }) => (
          <Pressable onPress={() => navigation.navigate("OrderDetails", { orderId: item.id })} style={styles.row}>
            <Text style={styles.rowTitle}>Order {item.orderNumber}</Text>
            <Text style={styles.rowMeta}>{item.customerEmail || item.customerName || "Unknown customer"}</Text>
            <View style={[styles.statusBadge, badgeStyle(item.status)]}>
              <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050505",
    padding: 12
  },
  heading: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 10
  },
  search: {
    borderWidth: 1,
    borderColor: "#262626",
    borderRadius: 10,
    color: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    backgroundColor: "#0E0E0E"
  },
  filterRow: {
    gap: 8,
    paddingBottom: 12
  },
  filterPill: {
    borderWidth: 1,
    borderColor: "#2A2A2A",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12
  },
  filterPillActive: {
    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF"
  },
  filterText: {
    color: "#A1A1A1",
    fontSize: 12,
    fontWeight: "600"
  },
  filterTextActive: {
    color: "#080808"
  },
  loader: {
    marginVertical: 8
  },
  row: {
    borderWidth: 1,
    borderColor: "#222222",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    backgroundColor: "#101010"
  },
  rowTitle: {
    color: "#FFFFFF",
    fontWeight: "700"
  },
  rowMeta: {
    color: "#A5A5A5",
    marginTop: 3
  },
  statusBadge: {
    marginTop: 8,
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  empty: {
    color: "#7A7A7A",
    marginTop: 20,
    textAlign: "center"
  }
});

function badgeStyle(status: OrderListItem["status"]) {
  if (status === "paid") {
    return { borderColor: "#2E6C3B", backgroundColor: "#123118" };
  }

  if (status === "shipped") {
    return { borderColor: "#2B4B75", backgroundColor: "#0F1F36" };
  }

  if (status === "pending") {
    return { borderColor: "#7A6523", backgroundColor: "#2A220A" };
  }

  return { borderColor: "#3A3A3A", backgroundColor: "#141414" };
}
