import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (
      pathname === "/admin/login" ||
      pathname === "/api/admin/login" ||
      pathname === "/api/admin/logout"
    ) {
      return NextResponse.next();
    }

    const auth = request.cookies.get("admin-auth");

    if (!auth) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
