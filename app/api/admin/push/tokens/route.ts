import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseServerConfig } from "../../../../lib/server-env";
import { isAdminRequestAuthenticated } from "../../../../lib/admin-session";

export async function GET(request: Request) {
  if (!isAdminRequestAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { url, serviceRoleKey } = getSupabaseServerConfig();
    const supabase = createClient(url, serviceRoleKey);

    const { data, error } = await supabase
      .from("admin_push_tokens")
      .select("id, token, created_at")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      throw error;
    }

    return NextResponse.json(data || []);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch push tokens.";
    console.error("[PUSH TOKENS]", message);
    return NextResponse.json({ error: "Failed to fetch push tokens." }, { status: 500 });
  }
}
