import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import {
  getSiteUrl,
  getStripeSecretKey,
  getStripeWebhookSecret,
  getSupabaseServerConfig,
} from "../../lib/server-env";

export const runtime = "nodejs";

type EmailProduct = {
  name?: string;
  size?: string;
  quantity?: number;
  price?: number;
  image?: string;
};

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

function renderProducts(products: EmailProduct[]) {
  return products
    .map((product) => {
      const quantity = product.quantity ?? 1;
      const unitPrice = product.price ?? 0;
      const total = (unitPrice * quantity).toFixed(2);

      return `
        <tr>
          <td style="padding: 16px 0; border-bottom: 1px solid #262626; color: #e5e5e5; font-size: 14px;">
            <div style="font-weight: 600; color: #ffffff;">${product.name ?? "LEOCHI Item"}</div>
            <div style="color: #9ca3af; margin-top: 6px;">Size: ${product.size ?? "N/A"} · Qty: ${quantity}</div>
            <div style="margin-top: 8px; color: #ffffff;">CAD $${total}</div>
          </td>
        </tr>
      `;
    })
    .join("");
}

function buildEmailHtml(params: {
  customerName: string;
  orderTotal: string;
  products: EmailProduct[];
  sessionId: string;
  siteUrl: string;
}) {
  const { customerName, orderTotal, products, sessionId, siteUrl } = params;

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>LEOCHI Order Confirmation</title>
      </head>
      <body style="margin:0; padding:0; background:#050505; color:#ffffff; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#050505;">
          <tr>
            <td align="center" style="padding:32px 16px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width:640px; background:#0b0b0b; border:1px solid #1f1f1f;">
                <tr>
                  <td style="padding:40px 28px 28px; text-align:center; border-bottom:1px solid #1f1f1f;">
                    <div style="font-size:34px; letter-spacing:8px; font-weight:700; color:#ffffff;">LEOCHI</div>
                    <div style="margin-top:8px; color:#9ca3af; letter-spacing:2px; font-size:11px; text-transform:uppercase;">Premium Streetwear</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:28px;">
                    <h1 style="margin:0 0 12px; font-size:28px; letter-spacing:1px;">Order Confirmed</h1>
                    <p style="margin:0 0 24px; color:#d4d4d8; line-height:1.65;">
                      Thank you, ${customerName}. Your order is confirmed and being prepared by the LEOCHI team.
                    </p>

                    <table width="100%" cellpadding="0" cellspacing="0" style="margin:10px 0 24px;">
                      ${renderProducts(products)}
                    </table>

                    <table width="100%" cellpadding="0" cellspacing="0" style="background:#111111; border:1px solid #262626; margin-bottom:24px;">
                      <tr>
                        <td style="padding:16px 18px; color:#a3a3a3; font-size:13px;">Order Reference</td>
                        <td style="padding:16px 18px; color:#ffffff; font-size:13px; text-align:right;">${sessionId}</td>
                      </tr>
                      <tr>
                        <td style="padding:16px 18px; color:#a3a3a3; font-size:13px; border-top:1px solid #262626;">Total</td>
                        <td style="padding:16px 18px; color:#ffffff; font-size:20px; font-weight:700; text-align:right; border-top:1px solid #262626;">CAD $${orderTotal}</td>
                      </tr>
                    </table>

                    <div style="text-align:center;">
                      <a href="${siteUrl}/success?session_id=${sessionId}#order" style="display:inline-block; padding:12px 24px; background:#ffffff; color:#000000; text-decoration:none; letter-spacing:1px; text-transform:uppercase; font-size:12px; font-weight:700;">View Order</a>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
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

    if (customerEmail && resendApiKey) {
      const resend = new Resend(resendApiKey);
      const customerName = session.customer_details?.name || "Valued Customer";
      const orderTotal = ((session.amount_total || 0) / 100).toFixed(2);
      const siteUrl = getSiteUrl();

      const { error: emailError } = await resend.emails.send({
        from: "LEOCHI <orders@leochi.co>",
        to: customerEmail,
        subject: "Order Confirmation - LEOCHI",
        html: buildEmailHtml({
          customerName,
          orderTotal,
          products,
          sessionId: session.id,
          siteUrl,
        }),
      });

      if (emailError) {
        console.error("[WEBHOOK] Resend error:", emailError);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook processing failed.";
    console.error("[WEBHOOK] Fatal error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
