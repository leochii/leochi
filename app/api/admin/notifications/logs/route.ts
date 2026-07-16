import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseServerConfig } from "../../../../lib/server-env";
import { isAdminRequestAuthenticated } from "../../../../lib/admin-session";

export async function GET(request: Request) {
  if (!isAdminRequestAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const limitParam = Number(searchParams.get("limit") || "50");
    const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 200) : 50;

    const { url, serviceRoleKey } = getSupabaseServerConfig();
    const supabase = createClient(url, serviceRoleKey);

    const { data, error } = await supabase
      .from("notification_logs")
      .select("id, title, body, order_id, created_at")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return NextResponse.json(data || []);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch notification logs.";
    console.error("[NOTIFICATION LOGS]", message);
    return NextResponse.json({ error: "Failed to fetch notification logs." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isAdminRequestAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const title = typeof body?.title === "string" ? body.title.trim() : "";
    const message = typeof body?.body === "string" ? body.body.trim() : "";
    const orderId = typeof body?.order_id === "string" ? body.order_id.trim() : null;

    if (!title || !message) {
      return NextResponse.json(
        { error: "title and body are required." },
        { status: 400 }
      );
    }

    const { url, serviceRoleKey } = getSupabaseServerConfig();
    const supabase = createClient(url, serviceRoleKey);

    const { data, error } = await supabase
      .from("notification_logs")
      .insert({
        title,
        body: message,
        order_id: orderId,
      })
      .select("id, title, body, order_id, created_at")
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create notification log.";
    console.error("[NOTIFICATION LOGS]", message);
    return NextResponse.json({ error: "Failed to create notification log." }, { status: 500 });
  }
}
