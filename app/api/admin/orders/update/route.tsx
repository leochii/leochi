import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const VALID_STATUSES = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const VALID_CARRIERS = [
  "Canada Post",
  "UPS",
  "FedEx",
  "DHL",
  "Purolator",
];

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error(
        "Supabase credentials missing:",
        { hasUrl: !!supabaseUrl, hasKey: !!supabaseKey }
      );
      return NextResponse.json(
        { success: false, error: "Server configuration error: Supabase credentials not configured" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const body = await req.json();
    const { id, order_status, tracking_number, carrier } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { success: false, error: "Order ID is required and must be a string" },
        { status: 400 }
      );
    }

    if (!order_status || !VALID_STATUSES.includes(order_status)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid order status. Must be one of: ${VALID_STATUSES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    if (carrier && !VALID_CARRIERS.includes(carrier)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid carrier. Must be one of: ${VALID_CARRIERS.join(", ")}`,
        },
        { status: 400 }
      );
    }

    if (tracking_number && typeof tracking_number !== "string") {
      return NextResponse.json(
        { success: false, error: "Tracking number must be a string" },
        { status: 400 }
      );
    }

    console.log("Updating order:", { id, order_status, tracking_number, carrier });

    const { error } = await supabase
      .from("orders")
      .update({
        order_status,
        tracking_number: tracking_number || null,
        carrier: carrier || null,
      })
      .eq("id", id);

    if (error) {
      console.error("Supabase update error:", error);
      return NextResponse.json(
        { success: false, error: error.message || "Failed to update order" },
        { status: 500 }
      );
    }

    console.log("Order updated successfully:", id);
    return NextResponse.json({ success: true });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    console.error("API error:", errorMessage, error);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}