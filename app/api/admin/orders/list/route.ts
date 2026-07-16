import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseServerConfig } from "../../../../lib/server-env";
import { isAdminRequestAuthenticated } from "../../../../lib/admin-session";

const VALID_FILTERS = new Set(["pending", "paid", "shipped"]);

type OrderRow = {
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
};

function mapOrder(order: OrderRow) {
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
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() || "";
    const status = searchParams.get("status")?.trim().toLowerCase() || "";

    let query = supabase
      .from("orders")
      .select("id, stripe_session_id, customer_name, customer_email, amount, currency, status, tracking_number, carrier, created_at")
      .order("created_at", { ascending: false })
      .limit(1000);

    if (status && VALID_FILTERS.has(status)) {
      query = query.eq("status", status);
    }

    if (q.length > 0) {
      const escaped = q.replace(/,/g, " ");
      query = query.or(`stripe_session_id.ilike.%${escaped}%,customer_email.ilike.%${escaped}%`);
    }

    const result = await query;

    if (result.error) {
      throw result.error;
    }

    return NextResponse.json((result.data || []).map((order) => mapOrder(order as OrderRow)));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch orders.";
    console.error("[ADMIN ORDERS LIST]", message);
    return NextResponse.json({ error: "Failed to fetch orders." }, { status: 500 });
  }
}
