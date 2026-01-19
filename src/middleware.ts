import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { API_URL } from "./config";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path.startsWith("/api")) {
    return NextResponse.redirect(new URL(API_URL + path));
  }

  if (path.startsWith("/ttc")) {
    const newPath = path.replace("/ttc", "");
    return NextResponse.redirect(new URL(newPath, request.url));
  }

  if (path.startsWith("/not-found")) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
