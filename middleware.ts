import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PATHS = ["/dashboard", "/classroom"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasSession = Boolean(req.cookies.get("ml_session"));

  const isProtected = PROTECTED_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
  const isLogin = pathname === "/login";

  if (isProtected && !hasSession) {
    const url = new URL("/login", req.url);
    return NextResponse.redirect(url);
  }

  if (isLogin && hasSession) {
    const url = new URL("/dashboard", req.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/classroom/:path*", "/login"],
};


