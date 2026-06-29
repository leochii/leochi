import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("Stripe Webhook:", body);

    return NextResponse.json({
      received: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Webhook failed" },
      { status: 500 }
    );
  }
}