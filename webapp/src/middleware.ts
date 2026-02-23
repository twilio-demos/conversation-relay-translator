import { jwtVerify } from "jose";
import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "basic-auth-token";
const SIGNIN_PATH = "/auth/basic-signin";

function getSecret(): Uint8Array {
  const secret = process.env.BASIC_AUTH_SECRET;
  if (!secret) throw new Error("BASIC_AUTH_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export default async function middleware(request: NextRequest) {
  if (process.env.NEXT_PUBLIC_EXTERNAL === "true") {
    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
      const signinUrl = new URL(SIGNIN_PATH, request.url);
      signinUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
      return NextResponse.redirect(signinUrl);
    }

    try {
      await jwtVerify(token, getSecret());
      return NextResponse.next();
    } catch {
      const signinUrl = new URL(SIGNIN_PATH, request.url);
      signinUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
      return NextResponse.redirect(signinUrl);
    }
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
