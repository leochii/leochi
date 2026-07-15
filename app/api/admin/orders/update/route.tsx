import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseServerConfig } from "../../../../lib/server-env";
import {
  EmailProduct,
  formatAddress,
  getResendClient,
  sendShippingConfirmationEmail,
} from "../../../../lib/transactional-emails";

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

    const { id, status, tracking_number, carrier, sendShippingEmail } = body;
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

    const { data: updatedOrder, error } = await supabase
      .from("orders")
      .update(updatePayload)
      .select("id, customer_email, customer_name, amount, currency, products, shipping_address, city, province, postal_code, tracking_number, carrier")
      .eq("id", id);

    if (error) {
      console.error("Supabase update error:", error);
      return NextResponse.json(
        { success: false, error: error.message || "Failed to update order" },
        { status: 500 }
      );
    }

    const orderRow = Array.isArray(updatedOrder) ? updatedOrder[0] : null;

    if (sendShippingEmail === true && orderRow?.customer_email && tracking_number) {
      const resendApiKey = process.env.RESEND_API_KEY?.trim();

      if (!resendApiKey) {
        return NextResponse.json({
          success: true,
          warning: "Order updated, but shipping email was skipped because RESEND_API_KEY is missing.",
        });
      }

      const emailClient = getResendClient(resendApiKey);
      const products = Array.isArray(orderRow.products)
        ? (orderRow.products as EmailProduct[])
        : [];

      const shippingAddress = formatAddress([
        orderRow.shipping_address,
        [orderRow.city, orderRow.province].filter(Boolean).join(", "),
        orderRow.postal_code,
      ]);

      const amountInCents = typeof orderRow.amount === "number" ? orderRow.amount : 0;
      const shippingEmailError = await sendShippingConfirmationEmail(emailClient, {
        customerEmail: orderRow.customer_email,
        customerName: orderRow.customer_name || "Client",
        orderNumber: orderRow.id,
        trackingNumber: tracking_number,
        carrier: carrier || "Carrier update pending",
        currentStatus: "Shipped",
        estimatedDeliveryDate: "To be confirmed by carrier",
        shippingAddress: shippingAddress || "Address on file",
        products,
        orderTotalCad: amountInCents / 100,
      });

      if (shippingEmailError) {
        console.error("Shipping confirmation email error:", shippingEmailError);
        return NextResponse.json({
          success: true,
          warning: "Order updated, but shipping confirmation email failed to send.",
        });
      }
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