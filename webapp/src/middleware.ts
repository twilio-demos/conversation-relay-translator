import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default function middleware(request: NextRequest) {
  // Bypass authentication if NEXT_PUBLIC_LOCAL is set
  if (process.env.NEXT_PUBLIC_LOCAL === "true") {
    return NextResponse.next();
  }

  // Otherwise, use NextAuth middleware
  return withAuth(request as any);
}

export const config = {
  matcher: [
    "/",
    "/profiles/:path*",
    "/sessions/:path*",
    "/conversations/:path*",
    "/api/profiles/:path*",
    "/api/sessions/:path*",
    "/api/conversations/:path*",
  ],
};
