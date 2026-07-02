import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const body = await req.text();

  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (!supabaseUrl || !supabaseKey) {
        console.error("Supabase credentials missing in webhook");
        return NextResponse.json({ received: true });
      }

      const supabase = createClient(supabaseUrl, supabaseKey);
      const session = event.data.object as Stripe.Checkout.Session;

      console.log("[WEBHOOK] Processing checkout.session.completed");
      console.log("[WEBHOOK] Customer email:", session.customer_details?.email);
      console.log("[WEBHOOK] RESEND_API_KEY present:", !!process.env.RESEND_API_KEY);

      const { error } = await supabase.from("orders").insert({
        stripe_session_id: session.id,
        customer_email: session.customer_details?.email,
        customer_name: session.customer_details?.name,
        amount: session.amount_total,
        currency: session.currency,
        status: session.payment_status,
        products: JSON.parse(session.metadata?.products || "[]"),
        shipping_address: session.customer_details?.address?.line1,
        city: session.customer_details?.address?.city,
        province: session.customer_details?.address?.state,
        postal_code: session.customer_details?.address?.postal_code,
        phone: session.customer_details?.phone,
      });

      if (error) {
        console.error("[WEBHOOK] SUPABASE ERROR:");
        console.error("[WEBHOOK]", JSON.stringify(error, null, 2));
      } else {
        console.log("[WEBHOOK] Order saved successfully!");

        // Send confirmation email
        const customerEmail = session.customer_details?.email;
        const customerName = session.customer_details?.name || "Valued Customer";

        if (customerEmail) {
          console.log("[WEBHOOK] Attempting to send confirmation email to:", customerEmail);

          if (!process.env.RESEND_API_KEY) {
            console.error("[WEBHOOK] ERROR: RESEND_API_KEY is not set");
          } else {
            try {
              console.log("[WEBHOOK] Importing Resend...");
              const { Resend } = await import("resend");
              const resend = new Resend(process.env.RESEND_API_KEY);

              console.log("[WEBHOOK] Calling resend.emails.send()...");
              const emailResponse = await resend.emails.send({
                from: "orders@leochi.co",
                to: customerEmail,
                subject: "Order Confirmation - LEOCHI",
                html: `
                  <h1>Thank you for your purchase!</h1>
                  <p>Hi ${customerName},</p>
                  <p>Your order has been confirmed and will be shipped soon.</p>
                  <p>Order Total: CAD $${((session.amount_total || 0) / 100).toFixed(2)}</p>
                  <p>We'll send you a tracking number as soon as your order ships.</p>
                  <p>Best regards,<br/>LEOCHI Team</p>
                `,
              });

              console.log("[WEBHOOK] Email send response:", JSON.stringify(emailResponse, null, 2));

              if (emailResponse.error) {
                console.error("[WEBHOOK] Email send error:", JSON.stringify(emailResponse.error, null, 2));
              } else {
                console.log("[WEBHOOK] Confirmation email sent successfully! ID:", emailResponse.data?.id);
              }
            } catch (emailError) {
              console.error("[WEBHOOK] Email send exception:", emailError);
            }
          }
        } else {
          console.warn("[WEBHOOK] No customer email found, skipping email send");
        }
      }
    } catch (error) {
      console.error("[WEBHOOK] Webhook handler error:", error);
    }
  }

  return NextResponse.json({ received: true });
}
