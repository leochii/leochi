import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isAdminRequestAuthenticated } from "../../../../lib/admin-session";
import { getSupabaseServerConfig } from "../../../../lib/server-env";
import { isValidExpoPushToken } from "../../../../lib/push-notifications";

export async function POST(request: Request) {
  if (!isAdminRequestAuthenticated(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const token = typeof body?.token === "string" ? body.token.trim() : "";
    const enabled = body?.enabled === true;

    if (!token || !isValidExpoPushToken(token)) {
      return NextResponse.json({ success: false, error: "Valid token required." }, { status: 400 });
    }

    const { url, serviceRoleKey } = getSupabaseServerConfig();
    const supabase = createClient(url, serviceRoleKey);

    const { error } = await supabase
      .from("admin_push_tokens")
      .upsert(
        {
          token,
          platform: "ios",
          is_active: enabled,
          last_seen_at: new Date().toISOString(),
        },
        { onConflict: "token" }
      );

    if (error) {
      console.error("[PUSH PREFERENCES] Supabase error:", error);
      return NextResponse.json({ success: false, error: "Unable to update push preferences." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Request failed.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
