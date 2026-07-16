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
    const platform = typeof body?.platform === "string" ? body.platform.trim() : "ios";

    if (!token || !isValidExpoPushToken(token)) {
      return NextResponse.json(
        { success: false, error: "A valid Expo push token is required." },
        { status: 400 }
      );
    }

    const { url, serviceRoleKey } = getSupabaseServerConfig();
    const supabase = createClient(url, serviceRoleKey);

    const { error } = await supabase.from("admin_push_tokens").upsert(
      {
        token,
        platform,
        is_active: true,
        last_seen_at: new Date().toISOString(),
      },
      { onConflict: "token" }
    );

    if (error) {
      console.error("[PUSH REGISTER] Supabase error:", error);
      return NextResponse.json(
        { success: false, error: "Unable to register push token." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Request failed.";
    console.error("[PUSH REGISTER] API error:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
