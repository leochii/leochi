import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseServerConfig } from "../../../lib/server-env";
import { isAdminRequestAuthenticated } from "../../../lib/admin-session";

type DashboardOrderRow = {
  id: string;
  stripe_session_id: string | null;
  customer_name: string | null;
  customer_email: string | null;
  amount: number | null;
  currency: string | null;
  status: string | null;
  tracking_number: string | null;
  carrier: string | null;
  created_at: string | null;
  products: Array<{
    name?: string;
    quantity?: number;
    price?: number;
  }> | null;
};

function toOrderListItem(order: DashboardOrderRow) {
  return {
    id: order.id,
    orderNumber: order.stripe_session_id || order.id,
    stripeSessionId: order.stripe_session_id || undefined,
    customerName: order.customer_name || undefined,
    customerEmail: order.customer_email || undefined,
    amount: typeof order.amount === "number" ? order.amount : 0,
    currency: order.currency || "cad",
    status: (order.status || "pending") as
      | "pending"
      | "paid"
      | "processing"
      | "shipped"
      | "delivered"
      | "cancelled",
    trackingNumber: order.tracking_number || undefined,
    carrier: order.carrier || undefined,
    createdAt: order.created_at || new Date().toISOString(),
  };
}

export async function GET(request: Request) {
  if (!isAdminRequestAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { url, serviceRoleKey } = getSupabaseServerConfig();
    const supabase = createClient(url, serviceRoleKey);

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(startOfDay.getFullYear(), startOfDay.getMonth(), 1);

    const [todayResult, monthResult, pendingResult, totalOrdersResult, latestResult] = await Promise.all([
      supabase
        .from("orders")
        .select("id, amount")
        .gte("created_at", startOfDay.toISOString()),
      supabase
        .from("orders")
        .select("id, amount, products")
        .gte("created_at", startOfMonth.toISOString()),
      supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("orders").select("id", { count: "exact", head: true }),
      supabase
        .from("orders")
        .select("id, stripe_session_id, customer_name, customer_email, amount, currency, status, tracking_number, carrier, created_at, products")
        .order("created_at", { ascending: false })
        .limit(10),
    ]);

    if (todayResult.error) {
      throw todayResult.error;
    }

    if (monthResult.error) {
      throw monthResult.error;
    }

    if (pendingResult.error) {
      throw pendingResult.error;
    }

    if (totalOrdersResult.error) {
      throw totalOrdersResult.error;
    }

    if (latestResult.error) {
      throw latestResult.error;
    }

    const todaysRevenue = (todayResult.data || []).reduce((sum, row) => {
      return sum + (typeof row.amount === "number" ? row.amount : 0);
    }, 0);

    const revenueThisMonth = (monthResult.data || []).reduce((sum, row) => {
      return sum + (typeof row.amount === "number" ? row.amount : 0);
    }, 0);

    const productStats = new Map<string, { unitsSold: number; revenue: number }>();

    for (const row of monthResult.data || []) {
      const products = Array.isArray(row.products) ? row.products : [];
      for (const product of products) {
        const name =
          typeof product?.name === "string" && product.name.trim().length > 0
            ? product.name.trim()
            : "Unnamed Product";
        const qty = typeof product?.quantity === "number" && product.quantity > 0 ? product.quantity : 1;
        const price = typeof product?.price === "number" ? product.price : 0;

        const existing = productStats.get(name) || { unitsSold: 0, revenue: 0 };
        existing.unitsSold += qty;
        existing.revenue += qty * price;
        productStats.set(name, existing);
      }
    }

    const bestSellingProducts = Array.from(productStats.entries())
      .map(([name, value]) => ({
        name,
        unitsSold: value.unitsSold,
        revenue: value.revenue,
      }))
      .sort((a, b) => b.unitsSold - a.unitsSold || b.revenue - a.revenue)
      .slice(0, 5);

    return NextResponse.json({
      todaysRevenue,
      revenueThisMonth,
      ordersToday: todayResult.data?.length || 0,
      totalOrders: totalOrdersResult.count || 0,
      pendingOrders: pendingResult.count || 0,
      bestSellingProducts,
      recentOrders: (latestResult.data || []).map((order) => toOrderListItem(order as DashboardOrderRow)),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch dashboard.";
    console.error("[ADMIN DASHBOARD]", message);
    return NextResponse.json({ error: "Failed to fetch dashboard metrics." }, { status: 500 });
  }
}
