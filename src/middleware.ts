import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const sessionToken = req.cookies.get("better-auth.session_token")?.value;
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/dashboard") && !sessionToken) {
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
