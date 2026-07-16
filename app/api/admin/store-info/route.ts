import { NextResponse } from "next/server";
import { isAdminRequestAuthenticated } from "../../../lib/admin-session";

export async function GET(request: Request) {
  if (!isAdminRequestAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  return NextResponse.json({
    storeName: "LEOCHI",
    website: process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "https://leochi.co",
    ownerEmail: process.env.ADMIN_EMAIL || "Owner account",
  });
}
