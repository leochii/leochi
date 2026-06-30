import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { password } = await request.json();
  


  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { success: false },
      { status: 401 }
    );
  }

  const response = NextResponse.json({
    success: true,
  });

  response.cookies.set("admin-auth", "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return response;
}