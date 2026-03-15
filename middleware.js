// middleware.js
import { NextResponse } from "next/server";

const AUTH_ROUTES = ["/login", "/register"];

export function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // logged user cannot access login/register
  if (token && AUTH_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // protected routes
  if (
    !token &&
    (pathname.startsWith("/account") ||
      pathname.startsWith("/admin") ||
      pathname.startsWith("/checkout"))
  ) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/account/:path*",
    "/admin/:path*",
    "/checkout",
  ],
};
