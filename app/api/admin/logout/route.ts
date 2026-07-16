import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "../../../lib/admin-session";

export async function POST() {
  const response = NextResponse.json({
    success: true,
  });

  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    path: "/",
    expires: new Date(0),
  });

  return response;
}