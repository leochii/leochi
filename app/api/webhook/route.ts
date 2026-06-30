import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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
    const session = event.data.object as Stripe.Checkout.Session;

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
})

    if (error) {
  console.error("SUPABASE ERROR:");
  console.error(JSON.stringify(error, null, 2));
} else {
  console.log("Order saved!");
}
  }

  return NextResponse.json({ received: true });
}