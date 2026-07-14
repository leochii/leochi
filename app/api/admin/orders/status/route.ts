import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseServerConfig } from "../../../../lib/server-env";

export async function PATCH(request: Request) {
  try {
    const { url, serviceRoleKey } = getSupabaseServerConfig();
    const supabase = createClient(url, serviceRoleKey);
    const { id, status } = await request.json();

    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Something went wrong.";
    console.error("API error:", errorMessage);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}