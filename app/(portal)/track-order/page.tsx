import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseServerConfig } from "../../lib/server-env";

type TrackOrderPageProps = {
  searchParams: Promise<{
    orderNumber?: string | string[];
  }>;
};

function readOrderNumber(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0]?.trim() || "";
  }

  return typeof value === "string" ? value.trim() : "";
}

function getProductionStatus(orderStatus: string | null | undefined, rawProductionStatus: string | null | undefined) {
  if (rawProductionStatus && rawProductionStatus.trim().length > 0) {
    return rawProductionStatus;
  }

  const status = (orderStatus || "").toLowerCase();

  if (status === "pending" || status === "paid" || status === "processing") {
    return "In Production";
  }

  if (status === "shipped" || status === "delivered") {
    return "Completed";
  }

  if (status === "cancelled") {
    return "Cancelled";
  }

  return "In Production";
}

function getShippingStatus(orderStatus: string | null | undefined, rawShippingStatus: string | null | undefined) {
  if (rawShippingStatus && rawShippingStatus.trim().length > 0) {
    return rawShippingStatus;
  }

  const status = (orderStatus || "").toLowerCase();

  if (status === "delivered") {
    return "Delivered";
  }

  if (status === "shipped") {
    return "Shipped";
  }

  if (status === "cancelled") {
    return "Cancelled";
  }

  return "Pending shipment";
}

function renderTrackingMessage(message: string) {
  return (
    <main className="min-h-screen bg-[#f5f0e5] text-[#1b1b1b] px-6 py-12 md:py-16">
      <div className="max-w-3xl mx-auto border border-[#e1d7c7] bg-[#fcf8f1] px-8 py-10 text-center">
        <p className="font-serif text-4xl tracking-[0.18em] mb-8">LEOCHI</p>
        <p className="text-sm text-[#5f5243] mb-6">{message}</p>
        <a
          href="mailto:support@leochi.co"
          className="inline-flex items-center justify-center bg-[#1b1b1b] text-[#f5f0e5] px-6 py-3 text-xs uppercase tracking-[0.18em]"
        >
          Contact Support
        </a>
      </div>
    </main>
  );
}

function getSupabaseClientSafely() {
  try {
    const { url, serviceRoleKey } = getSupabaseServerConfig();
    return createClient(url, serviceRoleKey);
  } catch (error) {
    console.error("[TRACK_ORDER] Supabase configuration unavailable:", error);
    return null;
  }
}

async function fetchOrderByStripeSession(
  supabase: SupabaseClient,
  orderNumber: string
) {
  try {
    return await supabase
      .from("orders")
      .select("*")
      .eq("stripe_session_id", orderNumber)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
  } catch (error) {
    console.error("[TRACK_ORDER] Failed to fetch order by stripe session id:", error);
    return null;
  }
}

async function fetchOrderById(
  supabase: SupabaseClient,
  orderNumber: string
) {
  try {
    return await supabase
      .from("orders")
      .select("*")
      .eq("id", orderNumber)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
  } catch (error) {
    console.error("[TRACK_ORDER] Failed to fetch order by id:", error);
    return null;
  }
}

export default async function TrackOrderPage({ searchParams }: TrackOrderPageProps) {
  const params = await searchParams;
  const orderNumber = readOrderNumber(params.orderNumber);

  if (!orderNumber) {
    return renderTrackingMessage("Order number is missing from the tracking link.");
  }

  const supabase = getSupabaseClientSafely();
  if (!supabase) {
    return renderTrackingMessage("Order tracking is temporarily unavailable. Please try again later or contact support.");
  }

  const bySession = await fetchOrderByStripeSession(supabase, orderNumber);

  if (!bySession) {
    return renderTrackingMessage("Order tracking is temporarily unavailable. Please try again later or contact support.");
  }

  const byId = bySession.data
    ? { data: bySession.data, error: bySession.error }
    : await fetchOrderById(supabase, orderNumber);

  if (!byId) {
    return renderTrackingMessage("Order tracking is temporarily unavailable. Please try again later or contact support.");
  }

  const order = byId.data;
  const error = bySession.error || byId.error;

  if (error || !order) {
    return renderTrackingMessage("We could not find an order for this tracking number.");
  }

  const orderData = order as Record<string, unknown>;
  const resolvedOrderNumber =
    (typeof orderData.stripe_session_id === "string" && orderData.stripe_session_id.trim().length > 0
      ? orderData.stripe_session_id
      : typeof orderData.id === "string" && orderData.id.trim().length > 0
        ? orderData.id
        : orderNumber);
  const productionStatus = getProductionStatus(
    typeof orderData.status === "string" ? orderData.status : undefined,
    typeof orderData.production_status === "string" ? orderData.production_status : undefined
  );
  const shippingStatus = getShippingStatus(
    typeof orderData.status === "string" ? orderData.status : undefined,
    typeof orderData.shipping_status === "string" ? orderData.shipping_status : undefined
  );
  const shippingCarrier = typeof orderData.carrier === "string" && orderData.carrier.trim().length > 0
    ? orderData.carrier
    : "Pending shipment";
  const trackingNumber = typeof orderData.tracking_number === "string" && orderData.tracking_number.trim().length > 0
    ? orderData.tracking_number
    : "Pending shipment";
  const estimatedDeliveryDate =
    typeof orderData.estimated_delivery_date === "string" && orderData.estimated_delivery_date.trim().length > 0
      ? orderData.estimated_delivery_date
      : "Pending shipment";

  return (
    <main className="min-h-screen bg-[#f5f0e5] text-[#1b1b1b] px-6 py-12 md:py-16">
      <div className="max-w-3xl mx-auto border border-[#e1d7c7] bg-[#fcf8f1]">
        <div className="px-8 py-10 border-b border-[#e1d7c7] text-center">
          <p className="font-serif text-4xl tracking-[0.18em]">LEOCHI</p>
        </div>

        <section className="px-8 py-8 border-b border-[#e1d7c7]">
          <p className="text-xs uppercase tracking-[0.22em] text-[#8b6f47] mb-4">Order Information</p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="border border-[#e1d7c7] bg-[#f8f2e8] p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#7d6b53] mb-2">Order Number</p>
              <p className="text-sm md:text-base break-all">{resolvedOrderNumber}</p>
            </div>
            <div className="border border-[#e1d7c7] bg-[#f8f2e8] p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#7d6b53] mb-2">Production Status</p>
              <p className="text-base font-medium">{productionStatus}</p>
            </div>
          </div>
        </section>

        <section className="px-8 py-8">
          <p className="text-xs uppercase tracking-[0.22em] text-[#8b6f47] mb-4">Tracking Information</p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="border border-[#e1d7c7] bg-[#f8f2e8] p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#7d6b53] mb-2">Shipping Status</p>
              <p className="text-sm md:text-base">{shippingStatus}</p>
            </div>
            <div className="border border-[#e1d7c7] bg-[#f8f2e8] p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#7d6b53] mb-2">Estimated Delivery Date</p>
              <p className="text-sm md:text-base">{estimatedDeliveryDate}</p>
            </div>
            <div className="border border-[#e1d7c7] bg-[#f8f2e8] p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#7d6b53] mb-2">Shipping Carrier</p>
              <p className="text-sm md:text-base">{shippingCarrier}</p>
            </div>
            <div className="border border-[#e1d7c7] bg-[#f8f2e8] p-4 md:col-span-2">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#7d6b53] mb-2">Tracking Number</p>
              <p className="text-sm md:text-base break-all">{trackingNumber}</p>
            </div>
          </div>

          <div className="pt-7">
            <a
              href="mailto:support@leochi.co"
              className="inline-flex items-center justify-center bg-[#1b1b1b] text-[#f5f0e5] px-6 py-3 text-xs uppercase tracking-[0.18em]"
            >
              Contact Support
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
