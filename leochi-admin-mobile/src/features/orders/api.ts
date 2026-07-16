import { env } from "@/lib/config";
import { AnalyticsMetrics, DashboardMetrics, OrderDetails, OrderListItem, OrderStatus } from "@/types/domain";

async function readJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Request failed (${response.status}): ${text}`);
  }
  return (await response.json()) as T;
}

// Phase 1 plan: use existing admin APIs for updates and Supabase-backed endpoints for reads.
export async function fetchOrders(input?: {
  q?: string;
  status?: "pending" | "paid" | "shipped";
}): Promise<OrderListItem[]> {
  const params = new URLSearchParams();
  if (input?.q) {
    params.set("q", input.q);
  }
  if (input?.status) {
    params.set("status", input.status);
  }

  const query = params.toString();
  const response = await fetch(`${env.apiBaseUrl}/api/admin/orders/list${query ? `?${query}` : ""}`, {
    credentials: "include"
  });
  return readJson<OrderListItem[]>(response);
}

export async function fetchOrderDetails(orderId: string): Promise<OrderDetails> {
  const response = await fetch(`${env.apiBaseUrl}/api/admin/orders/${orderId}`, {
    credentials: "include"
  });
  return readJson<OrderDetails>(response);
}

export async function fetchDashboardMetrics(): Promise<DashboardMetrics> {
  const response = await fetch(`${env.apiBaseUrl}/api/admin/dashboard`, {
    credentials: "include"
  });
  return readJson<DashboardMetrics>(response);
}

export async function fetchAnalyticsMetrics(): Promise<AnalyticsMetrics> {
  const response = await fetch(`${env.apiBaseUrl}/api/admin/analytics`, {
    credentials: "include"
  });
  return readJson<AnalyticsMetrics>(response);
}

export async function markOrderShipped(input: {
  id: string;
  trackingNumber: string;
  carrier: string;
  sendShippingEmail: boolean;
  estimatedDeliveryDate?: string;
}) {
  const response = await fetch(`${env.apiBaseUrl}/api/admin/orders/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify({
      id: input.id,
      status: "shipped" as OrderStatus,
      tracking_number: input.trackingNumber,
      carrier: input.carrier,
      sendShippingEmail: input.sendShippingEmail,
      estimatedDeliveryDate: input.estimatedDeliveryDate
    })
  });

  return readJson<{ success: boolean; warning?: string; error?: string }>(response);
}
