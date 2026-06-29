import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { cartItems } = await req.json();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],

    line_items: cartItems.map((item: any) => ({
      price_data: {
        currency: "cad",
        product_data: {
          name: `${item.name} (${item.size})`,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    })),

    mode: "payment",

    success_url: "http://localhost:3000/success",

    cancel_url: "http://localhost:3000/cart",
  });

  return NextResponse.json({
    url: session.url,
  });
}