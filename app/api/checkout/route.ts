import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getSiteUrl, getStripeSecretKey } from "../../lib/server-env";

interface CartItem {
  name: string;
  size: string;
  price: number;
  quantity: number;
}

export const runtime = "nodejs";

function getStripeClient() {
  return new Stripe(getStripeSecretKey());
}

export async function POST(req: Request) {
  try {
    const { cartItems } = (await req.json()) as { cartItems?: CartItem[] };

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }

    const stripe = getStripeClient();
    const origin = req.headers.get("origin") || undefined;
    const siteUrl = getSiteUrl(origin);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: cartItems.map((item: CartItem) => ({
        price_data: {
          currency: "cad",
          product_data: {
            name: `${item.name} (${item.size})`,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      metadata: {
        products: JSON.stringify(cartItems),
      },
      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cancel`,
      billing_address_collection: "required",
      phone_number_collection: {
        enabled: true,
      },
    });

    if (!session.url) {
      return NextResponse.json({ error: "Stripe session URL is unavailable." }, { status: 500 });
    }

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create checkout session.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}