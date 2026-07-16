import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_TTL_SECONDS,
  createAdminSessionToken,
} from "../../../lib/admin-session";

export async function POST(request: Request) {
  const { email, password } = await request.json();
  const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
  const ownerEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  if (!normalizedEmail || !password) {
    return NextResponse.json(
      { success: false },
      { status: 401 }
    );
  }

  if (ownerEmail && normalizedEmail !== ownerEmail) {
    return NextResponse.json(
      { success: false },
      { status: 401 }
    );
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { success: false },
      { status: 401 }
    );
  }

  const response = NextResponse.json({
    success: true,
  });

  response.cookies.set(ADMIN_SESSION_COOKIE, createAdminSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: ADMIN_SESSION_TTL_SECONDS,
  });

  return response;
}