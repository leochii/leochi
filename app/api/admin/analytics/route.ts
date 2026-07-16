import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseServerConfig } from "../../../lib/server-env";
import { isAdminRequestAuthenticated } from "../../../lib/admin-session";

type OrderRow = {
  amount: number | null;
  created_at: string | null;
  products: Array<{
    name?: string;
    quantity?: number;
    price?: number;
  }> | null;
};

function dateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function monthStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export async function GET(request: Request) {
  if (!isAdminRequestAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = monthStart(now);

    const { url, serviceRoleKey } = getSupabaseServerConfig();
    const supabase = createClient(url, serviceRoleKey);

    const { data, error } = await supabase
      .from("orders")
      .select("amount, created_at, products")
      .gte("created_at", startOfMonth.toISOString())
      .order("created_at", { ascending: true });

    if (error) {
      throw error;
    }

    const rows = (data || []) as OrderRow[];

    let revenueToday = 0;
    let revenueThisMonth = 0;
    const ordersThisMonth = rows.length;

    const revenueByDay = new Map<string, number>();
    const productTotals = new Map<string, { unitsSold: number; revenue: number }>();

    for (const row of rows) {
      const amount = typeof row.amount === "number" ? row.amount : 0;
      revenueThisMonth += amount;

      const createdAt = row.created_at ? new Date(row.created_at) : null;
      if (createdAt && createdAt >= startOfDay) {
        revenueToday += amount;
      }

      if (createdAt) {
        const key = dateKey(createdAt);
        revenueByDay.set(key, (revenueByDay.get(key) || 0) + amount);
      }

      const products = Array.isArray(row.products) ? row.products : [];
      for (const product of products) {
        const name = typeof product?.name === "string" && product.name.trim().length > 0
          ? product.name.trim()
          : "Unnamed Product";
        const qty = typeof product?.quantity === "number" && product.quantity > 0 ? product.quantity : 1;
        const unitPrice = typeof product?.price === "number" ? product.price : 0;
        const total = unitPrice * qty;

        const existing = productTotals.get(name) || { unitsSold: 0, revenue: 0 };
        existing.unitsSold += qty;
        existing.revenue += total;
        productTotals.set(name, existing);
      }
    }

    const graph: Array<{ date: string; revenue: number }> = [];
    const cursor = new Date(startOfMonth);
    while (cursor <= now) {
      const key = dateKey(cursor);
      graph.push({ date: key, revenue: revenueByDay.get(key) || 0 });
      cursor.setDate(cursor.getDate() + 1);
    }

    const bestSellingProducts = Array.from(productTotals.entries())
      .map(([name, totals]) => ({
        name,
        unitsSold: totals.unitsSold,
        revenue: totals.revenue,
      }))
      .sort((a, b) => b.unitsSold - a.unitsSold || b.revenue - a.revenue)
      .slice(0, 5);

    return NextResponse.json({
      revenueToday,
      revenueThisMonth,
      ordersThisMonth,
      bestSellingProducts,
      revenueGraph: graph,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch analytics.";
    console.error("[ADMIN ANALYTICS]", message);
    return NextResponse.json({ error: "Failed to fetch analytics." }, { status: 500 });
  }
}
