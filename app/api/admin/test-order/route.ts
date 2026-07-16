import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseServerConfig } from "../../../lib/server-env";
import { isAdminRequestAuthenticated } from "../../../lib/admin-session";
import {
  buildNewOrderPushMessage,
  sendNewOrderPushNotification,
} from "../../../lib/push-notifications";

function isAuthorized(request: Request): boolean {
  if (isAdminRequestAuthenticated(request)) {
    return true;
  }

  const providedSecret = request.headers.get("x-admin-test-secret")?.trim();
  const expectedSecret = process.env.ADMIN_TEST_ORDER_SECRET?.trim();

  if (!expectedSecret) {
    return false;
  }

  return providedSecret === expectedSecret;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const customerName = typeof body?.customerName === "string" && body.customerName.trim().length > 0
      ? body.customerName.trim()
      : "Test Customer";
    const customerEmail = typeof body?.customerEmail === "string" && body.customerEmail.trim().length > 0
      ? body.customerEmail.trim().toLowerCase()
      : "owner-test@leochi.co";
    const amountCad = typeof body?.amountCad === "number" && body.amountCad > 0
      ? body.amountCad
      : 120;

    const orderNumber = `TEST-${Date.now()}`;
    const amountCents = Math.round(amountCad * 100);

    const { url, serviceRoleKey } = getSupabaseServerConfig();
    const supabase = createClient(url, serviceRoleKey);

    const { data: insertedOrder, error: insertError } = await supabase
      .from("orders")
      .insert({
        stripe_session_id: orderNumber,
        customer_email: customerEmail,
        customer_name: customerName,
        amount: amountCents,
        currency: "cad",
        status: "paid",
        products: [
          {
            name: "LEOCHI Test Tee",
            size: "M",
            quantity: 1,
            price: amountCents,
          },
        ],
        shipping_address: "123 Test Street",
        city: "Toronto",
        province: "ON",
        postal_code: "M5V 2T6",
      })
      .select("id")
      .single();

    if (insertError) {
      throw insertError;
    }

    const orderId = insertedOrder?.id;

    const { data: tokenRows, error: tokenError } = await supabase
      .from("admin_push_tokens")
      .select("token")
      .eq("is_active", true);

    if (tokenError) {
      throw tokenError;
    }

    const tokens = (tokenRows || [])
      .map((row) => row.token)
      .filter((token): token is string => typeof token === "string" && token.length > 0);

    const pushMessage = buildNewOrderPushMessage({
      orderNumber,
      customerName,
      totalCad: amountCad,
    });

    if (tokens.length > 0) {
      await sendNewOrderPushNotification({
        tokens,
        orderNumber,
        customerName,
        totalCad: amountCad,
        orderId: typeof orderId === "string" ? orderId : orderNumber,
      });
    }

    const { error: logError } = await supabase.from("notification_logs").insert({
      title: pushMessage.title,
      body: pushMessage.body,
      order_id: typeof orderId === "string" ? orderId : orderNumber,
    });

    if (logError) {
      throw logError;
    }

    return NextResponse.json({
      success: true,
      orderId,
      orderNumber,
      amountCad,
      pushedToTokens: tokens.length,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create test order.";
    console.error("[ADMIN TEST ORDER]", message);
    return NextResponse.json({ error: "Failed to create test order." }, { status: 500 });
  }
}
