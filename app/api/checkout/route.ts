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

metadata: {
  products: JSON.stringify(cartItems),
},
    success_url: "https://leochi.co/success",
cancel_url: "https://leochi.co/cart",

billing_address_collection: "required",
phone_number_collection: {
  enabled: true,
},
  });

  return NextResponse.json({
    url: session.url,
  });
}