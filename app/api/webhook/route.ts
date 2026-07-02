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
              
              // Parse products from metadata
              let productsHTML = "";
              try {
                const products = JSON.parse(session.metadata?.products || "[]");
                if (products && products.length > 0) {
                  productsHTML = products
                    .map(
                      (product: any) => `
                    <tr>
                      <td style="padding: 20px 0; border-bottom: 1px solid #333;">
                        <table cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td style="padding-right: 20px; vertical-align: top; width: 120px;">
                              <img 
                                src="https://leochi.co${
                                  product.images?.[0] || "/placeholder.png"
                                }" 
                                alt="${product.name}" 
                                style="width: 100%; display: block; max-width: 120px; aspect-ratio: 1; object-fit: cover;"
                              />
                            </td>
                            <td style="vertical-align: top;">
                              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 14px; color: #ffffff; margin-bottom: 8px; font-weight: 500;">
                                ${product.name}
                              </div>
                              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 13px; color: #888888;">
                                Size: ${product.size}
                              </div>
                              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 13px; color: #888888; margin-bottom: 8px;">
                                Qty: ${product.quantity}
                              </div>
                              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 14px; color: #ffffff; font-weight: 500;">
                                CAD $${(product.price * product.quantity).toFixed(2)}
                              </div>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  `
                    )
                    .join("");
                }
              } catch (e) {
                console.log("[WEBHOOK] Could not parse products for email");
              }

              const orderTotal = ((session.amount_total || 0) / 100).toFixed(2);

              const emailResponse = await resend.emails.send({
                from: "orders@leochi.co",
                to: customerEmail,
                subject: "Order Confirmation - LEOCHI",
                html: `
                  <!DOCTYPE html>
                  <html lang="en">
                  <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Order Confirmation - LEOCHI</title>
                    <style>
                      body {
                        margin: 0;
                        padding: 0;
                        background-color: #0a0a0a;
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                      }
                      .email-container {
                        background-color: #0a0a0a;
                        max-width: 600px;
                        margin: 0 auto;
                      }
                      .header {
                        text-align: center;
                        padding: 60px 20px 40px;
                        border-bottom: 1px solid #1a1a1a;
                      }
                      .logo {
                        font-family: 'Georgia', serif;
                        font-size: 32px;
                        font-weight: 700;
                        color: #ffffff;
                        letter-spacing: 4px;
                        text-transform: uppercase;
                        margin: 0;
                        padding: 0;
                      }
                      .content {
                        padding: 40px 30px;
                      }
                      .greeting {
                        font-size: 24px;
                        font-weight: 300;
                        color: #ffffff;
                        margin: 0 0 30px 0;
                        letter-spacing: 1px;
                      }
                      .status-text {
                        font-size: 14px;
                        color: #888888;
                        margin-bottom: 40px;
                        line-height: 1.6;
                      }
                      .products-section {
                        margin: 40px 0;
                      }
                      .section-label {
                        font-size: 12px;
                        color: #666666;
                        text-transform: uppercase;
                        letter-spacing: 2px;
                        margin-bottom: 20px;
                        font-weight: 600;
                      }
                      .order-summary {
                        background-color: #121212;
                        border: 1px solid #1a1a1a;
                        padding: 30px;
                        margin: 40px 0;
                        border-radius: 0px;
                      }
                      .summary-row {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 15px;
                        font-size: 14px;
                      }
                      .summary-label {
                        color: #888888;
                      }
                      .summary-value {
                        color: #ffffff;
                        font-weight: 500;
                      }
                      .total-row {
                        display: flex;
                        justify-content: space-between;
                        margin-top: 20px;
                        padding-top: 20px;
                        border-top: 1px solid #1a1a1a;
                        font-size: 18px;
                        font-weight: 600;
                      }
                      .total-label {
                        color: #ffffff;
                      }
                      .total-value {
                        color: #ffffff;
                      }
                      .cta-section {
                        text-align: center;
                        margin: 40px 0;
                      }
                      .cta-button {
                        display: inline-block;
                        background-color: #ffffff;
                        color: #000000;
                        padding: 14px 40px;
                        text-decoration: none;
                        font-size: 12px;
                        font-weight: 700;
                        letter-spacing: 1px;
                        text-transform: uppercase;
                        border-radius: 0px;
                        margin: 20px 0;
                      }
                      .footer {
                        border-top: 1px solid #1a1a1a;
                        padding: 40px 30px;
                        text-align: center;
                        font-size: 12px;
                        color: #666666;
                        line-height: 1.8;
                      }
                      .footer-text {
                        margin: 8px 0;
                      }
                      @media (max-width: 480px) {
                        .email-container {
                          width: 100% !important;
                        }
                        .content, .order-summary, .footer {
                          padding: 25px 15px !important;
                        }
                        .logo {
                          font-size: 24px;
                        }
                        .greeting {
                          font-size: 18px;
                        }
                        .header {
                          padding: 40px 20px 30px;
                        }
                      }
                    </style>
                  </head>
                  <body>
                    <table cellpadding="0" cellspacing="0" width="100%" style="background-color: #0a0a0a;">
                      <tr>
                        <td>
                          <table cellpadding="0" cellspacing="0" width="100%" class="email-container" style="max-width: 600px; margin: 0 auto;">
                            <!-- Header -->
                            <tr>
                              <td class="header">
                                <p class="logo">LEOCHI</p>
                              </td>
                            </tr>

                            <!-- Main Content -->
                            <tr>
                              <td class="content">
                                <h1 class="greeting">ORDER CONFIRMED</h1>
                                <p class="status-text">
                                  Thank you, ${customerName}. Your order has been confirmed and will be carefully packed and shipped to you soon. You'll receive a tracking number via email as soon as your order dispatches.
                                </p>

                                <!-- Products -->
                                ${
                                  productsHTML
                                    ? `
                                  <div class="products-section">
                                    <div class="section-label">Items Ordered</div>
                                    <table cellpadding="0" cellspacing="0" width="100%">
                                      ${productsHTML}
                                    </table>
                                  </div>
                                `
                                    : ""
                                }

                                <!-- Order Summary -->
                                <div class="order-summary">
                                  <div class="summary-row">
                                    <span class="summary-label">Subtotal</span>
                                    <span class="summary-value">CAD $${orderTotal}</span>
                                  </div>
                                  <div class="total-row">
                                    <span class="total-label">Order Total</span>
                                    <span class="total-value">CAD $${orderTotal}</span>
                                  </div>
                                </div>

                                <!-- CTA Button -->
                                <div class="cta-section">
                                  <a href="https://leochi.co/orders/${session.id}" class="cta-button">View Order</a>
                                </div>
                              </td>
                            </tr>

                            <!-- Footer -->
                            <tr>
                              <td class="footer">
                                <p class="footer-text">LEOCHI © 2026. All rights reserved.</p>
                                <p class="footer-text">Premium Streetwear</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </body>
                  </html>
                `,
              });

              console.log("[WEBHOOK] Email send response:", JSON.stringify(emailResponse, null, 2));

              if (emailResponse.error) {
                console.error("[WEBHOOK] RESEND ERROR - Full Response:", JSON.stringify(emailResponse, null, 2));
                console.error("[WEBHOOK] RESEND ERROR - Status:", (emailResponse as any).statusCode || (emailResponse as any).status || "unknown");
                console.error("[WEBHOOK] RESEND ERROR - Name:", (emailResponse.error as any)?.name || "unknown");
                console.error("[WEBHOOK] RESEND ERROR - Message:", (emailResponse.error as any)?.message || JSON.stringify(emailResponse.error));
              } else {
                console.log("[WEBHOOK] Confirmation email sent successfully! ID:", emailResponse.data?.id);
              }
            } catch (emailError) {
              console.error("[WEBHOOK] RESEND EXCEPTION - Full Error:", emailError);
              console.error("[WEBHOOK] RESEND EXCEPTION - Type:", typeof emailError);
              console.error("[WEBHOOK] RESEND EXCEPTION - Constructor:", (emailError as any)?.constructor?.name);
              console.error("[WEBHOOK] RESEND EXCEPTION - Stack:", (emailError as any)?.stack);
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
