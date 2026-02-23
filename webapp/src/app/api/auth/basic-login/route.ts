import { SignJWT } from "jose";
import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "basic-auth-token";
const TOKEN_EXPIRY = "8h";

function getSecret(): Uint8Array {
  const secret = process.env.BASIC_AUTH_SECRET;
  if (!secret) throw new Error("BASIC_AUTH_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();

  const validUsername = process.env.BASIC_AUTH_USERNAME;
  const validPassword = process.env.BASIC_AUTH_PASSWORD;

  if (!validUsername || !validPassword) {
    return NextResponse.json(
      { error: "Auth not configured" },
      { status: 500 }
    );
  }

  if (username !== validUsername || password !== validPassword) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }

  const token = await new SignJWT({ username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(getSecret());

  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });

  return response;
}
