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
import { sendNewOrderPushNotification } from "../../lib/push-notifications";

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

    const { data: insertedOrder, error: insertError } = await supabase
      .from("orders")
      .insert({
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
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("[WEBHOOK] Supabase insert error:", insertError);
      return NextResponse.json({ error: "Failed to persist order" }, { status: 500 });
    }

    const customerName = session.customer_details?.name || "Valued Customer";
    const orderTotalCad = (session.amount_total || 0) / 100;
    const orderId = typeof insertedOrder?.id === "string" ? insertedOrder.id : session.id;

    try {
      const { data: tokenRows, error: tokenError } = await supabase
        .from("admin_push_tokens")
        .select("token")
        .eq("is_active", true);

      if (tokenError) {
        console.error("[WEBHOOK] Failed to load admin push tokens:", tokenError);
      } else if (Array.isArray(tokenRows) && tokenRows.length > 0) {
        const tokens = tokenRows
          .map((row) => row.token)
          .filter((token): token is string => typeof token === "string" && token.length > 0);

        if (tokens.length > 0) {
          const { invalidTokens } = await sendNewOrderPushNotification({
            tokens,
            orderNumber: session.id,
            customerName,
            totalCad: orderTotalCad,
            orderId,
          });

          if (invalidTokens.length > 0) {
            const { error: disableTokenError } = await supabase
              .from("admin_push_tokens")
              .update({ is_active: false })
              .in("token", invalidTokens);

            if (disableTokenError) {
              console.error("[WEBHOOK] Failed to disable invalid push tokens:", disableTokenError);
            }
          }
        }
      }
    } catch (pushError) {
      console.error("[WEBHOOK] Push notification error:", pushError);
    }

    const customerEmail = session.customer_details?.email;
    const resendApiKey = process.env.RESEND_API_KEY?.trim();

    if (resendApiKey) {
      const emailClient = getResendClient(resendApiKey);
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
      const currentStatus = session.metadata?.currentStatus?.trim() || "In Production";

      if (customerEmail) {
        const customerEmailError = await sendOrderConfirmationEmail(emailClient, {
          customerEmail,
          customerName,
          orderNumber: session.id,
          orderDate,
          currentStatus,
          paymentStatus: session.payment_status || "paid",
          shippingMethod,
          estimatedDeliveryDate,
          shippingCarrier: "Pending shipment",
          trackingNumber: "Pending shipment",
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
