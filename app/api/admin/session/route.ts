import { NextResponse } from "next/server";
import { isAdminRequestAuthenticated } from "../../../lib/admin-session";

export async function GET(request: Request) {
  return NextResponse.json({
    authenticated: isAdminRequestAuthenticated(request),
  });
}
