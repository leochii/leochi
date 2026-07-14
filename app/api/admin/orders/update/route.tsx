import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseServerConfig } from "../../../../lib/server-env";

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
  const requestTimestamp = new Date().toISOString();

  try {
    const { url: supabaseUrl, serviceRoleKey: supabaseKey } = getSupabaseServerConfig();

    const supabase = createClient(supabaseUrl, supabaseKey);

    const body = await req.json();

    const { id, status, tracking_number, carrier } = body;
    const payloadStatus = status;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { success: false, error: "Order ID is required and must be a string" },
        { status: 400 }
      );
    }

    if (!payloadStatus || !VALID_STATUSES.includes(payloadStatus)) {
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

    const updatePayload = {
      status: payloadStatus,
      tracking_number: tracking_number || null,
      carrier: carrier || null,
    };

    const { error } = await supabase
      .from("orders")
      .update(updatePayload)
      .eq("id", id);

    if (error) {
      console.error("Supabase update error:", error);
      return NextResponse.json(
        { success: false, error: error.message || "Failed to update order" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    const stack = error instanceof Error ? error.stack : undefined;
    console.error("API error:", {
      message: errorMessage,
      stack,
      requestTimestamp,
    });
    return NextResponse.json(
      { success: false, error: errorMessage, stack },
      { status: 500 }
    );
  }
}