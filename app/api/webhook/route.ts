import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import {
  getStripeSecretKey,
  getStripeWebhookSecret,
  getSupabaseServerConfig,
} from "../../lib/server-env";
import {
  EmailProduct,
  formatAddress,
  getResendClient,
  LEOCHI_SITE_URL,
  sendAdminNotificationEmail,
  sendOrderConfirmationEmail,
} from "../../lib/transactional-emails";

export const runtime = "nodejs";

function parseProducts(raw: string | undefined): EmailProduct[] {
  if (!raw) {
    return [];
  }

  try {
    const value = JSON.parse(raw);
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export async function POST(req: NextRequest) {
  try {
    const stripe = new Stripe(getStripeSecretKey());
    const webhookSecret = getStripeWebhookSecret();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing stripe-signature header." }, { status: 400 });
    }

    const body = await req.text();
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (error) {
      console.error("[WEBHOOK] Invalid signature:", error);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    if (event.type !== "checkout.session.completed") {
      return NextResponse.json({ received: true });
    }

    const session = event.data.object as Stripe.Checkout.Session;
    const products = parseProducts(session.metadata?.products);

    const { url, serviceRoleKey } = getSupabaseServerConfig();
    const supabase = createClient(url, serviceRoleKey);

    const { error: insertError } = await supabase.from("orders").insert({
      stripe_session_id: session.id,
      customer_email: session.customer_details?.email,
      customer_name: session.customer_details?.name,
      amount: session.amount_total,
      currency: session.currency,
      status: session.payment_status,
      products,
      shipping_address: session.customer_details?.address?.line1,
      city: session.customer_details?.address?.city,
      province: session.customer_details?.address?.state,
      postal_code: session.customer_details?.address?.postal_code,
      phone: session.customer_details?.phone,
    });

    if (insertError) {
      console.error("[WEBHOOK] Supabase insert error:", insertError);
      return NextResponse.json({ error: "Failed to persist order" }, { status: 500 });
    }

    const customerEmail = session.customer_details?.email;
    const resendApiKey = process.env.RESEND_API_KEY?.trim();

    if (resendApiKey) {
      const emailClient = getResendClient(resendApiKey);
      const customerName = session.customer_details?.name || "Valued Customer";
      const orderTotalCad = (session.amount_total || 0) / 100;
      const orderDate = new Date(session.created * 1000).toLocaleDateString("en-CA", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const shippingAddress = formatAddress([
        session.customer_details?.address?.line1,
        session.customer_details?.address?.line2,
        [session.customer_details?.address?.city, session.customer_details?.address?.state]
          .filter(Boolean)
          .join(", "),
        [session.customer_details?.address?.postal_code, session.customer_details?.address?.country]
          .filter(Boolean)
          .join(" "),
      ]);
      const shippingMethod = session.metadata?.shippingMethod?.trim() || "Standard Shipping";
      const estimatedDeliveryDate =
        session.metadata?.estimatedDeliveryDate?.trim() || "Within 5-8 business days";

      if (customerEmail) {
        const customerEmailError = await sendOrderConfirmationEmail(emailClient, {
          customerEmail,
          customerName,
          orderNumber: session.id,
          orderDate,
          currentStatus: "Order Confirmed",
          paymentStatus: session.payment_status || "paid",
          shippingMethod,
          estimatedDeliveryDate,
          shippingCarrier: "To be assigned",
          trackingNumber: "Not available yet",
          shippingAddress: shippingAddress || "Address will be provided in your shipment update.",
          products,
          orderTotalCad,
        });

        if (customerEmailError) {
          console.error("[WEBHOOK] Order confirmation email error:", customerEmailError);
        }
      }

      const adminEmailError = await sendAdminNotificationEmail(emailClient, {
        heading: "New order placed",
        summary: "A new paid order has been placed on leochi.co.",
        fields: [
          { label: "Order Number", value: session.id },
          { label: "Customer", value: customerName },
          { label: "Email", value: customerEmail || "Not provided" },
          { label: "Total", value: `CAD $${orderTotalCad.toFixed(2)}` },
          { label: "Payment Status", value: session.payment_status || "paid" },
        ],
        actionUrl: `${LEOCHI_SITE_URL}/admin`,
      });

      if (adminEmailError) {
        console.error("[WEBHOOK] Admin notification email error:", adminEmailError);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook processing failed.";
    console.error("[WEBHOOK] Fatal error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
