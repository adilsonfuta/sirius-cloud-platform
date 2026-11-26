import { NextRequest, NextResponse } from "next/server";

// This redirect is only a UI guard. Every API route verifies the persisted session.
export function middleware(request: NextRequest) {
  if (!request.cookies.has("sirius_session")) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
export const config = { matcher: ["/dashboard/:path*"] };
