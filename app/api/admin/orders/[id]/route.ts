import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseServerConfig } from "../../../../lib/server-env";
import { isAdminRequestAuthenticated } from "../../../../lib/admin-session";

type Product = {
  name?: string;
  size?: string;
  quantity?: number;
  price?: number;
  image?: string;
};

type OrderRow = {
  id: string;
  stripe_session_id: string | null;
  customer_name: string | null;
  customer_email: string | null;
  phone: string | null;
  shipping_address: string | null;
  city: string | null;
  province: string | null;
  postal_code: string | null;
  amount: number | null;
  currency: string | null;
  status: string | null;
  tracking_number: string | null;
  carrier: string | null;
  products: Product[] | null;
  created_at: string | null;
};

function mapOrder(order: OrderRow) {
  const status = order.status || "pending";
  const paymentStatus = status === "paid" || status === "shipped" || status === "delivered" ? "paid" : status;
  const createdAt = order.created_at || new Date().toISOString();

  const timeline = [
    {
      key: "placed",
      label: "Order Placed",
      timestamp: createdAt,
    },
    {
      key: "payment",
      label: paymentStatus === "paid" ? "Payment Confirmed" : "Payment Pending",
      timestamp: createdAt,
    },
  ];

  if (status === "shipped" || status === "delivered") {
    timeline.push({
      key: "shipped",
      label: "Shipped",
      timestamp: createdAt,
    });
  }

  if (status === "delivered") {
    timeline.push({
      key: "delivered",
      label: "Delivered",
      timestamp: createdAt,
    });
  }

  return {
    id: order.id,
    orderNumber: order.stripe_session_id || order.id,
    stripeSessionId: order.stripe_session_id || undefined,
    customerName: order.customer_name || undefined,
    customerEmail: order.customer_email || undefined,
    phone: order.phone || undefined,
    shippingAddress: order.shipping_address || undefined,
    city: order.city || undefined,
    province: order.province || undefined,
    postalCode: order.postal_code || undefined,
    amount: typeof order.amount === "number" ? order.amount : 0,
    currency: order.currency || "cad",
    status: status as "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled",
    paymentStatus,
    trackingNumber: order.tracking_number || undefined,
    carrier: order.carrier || undefined,
    products: Array.isArray(order.products) ? order.products : [],
    createdAt,
    timeline,
  };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminRequestAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { url, serviceRoleKey } = getSupabaseServerConfig();
    const supabase = createClient(url, serviceRoleKey);

    const baseSelect = "id, stripe_session_id, customer_name, customer_email, phone, shipping_address, city, province, postal_code, amount, currency, status, tracking_number, carrier, products, created_at";

    let result = await supabase
      .from("orders")
      .select(baseSelect)
      .eq("id", id)
      .maybeSingle();

    if (!result.data && !result.error) {
      result = await supabase
        .from("orders")
        .select(baseSelect)
        .eq("stripe_session_id", id)
        .maybeSingle();
    }

    if (result.error) {
      throw result.error;
    }

    if (!result.data) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    return NextResponse.json(mapOrder(result.data as OrderRow));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch order.";
    console.error("[ADMIN ORDER DETAIL]", message);
    return NextResponse.json({ error: "Failed to fetch order detail." }, { status: 500 });
  }
}
