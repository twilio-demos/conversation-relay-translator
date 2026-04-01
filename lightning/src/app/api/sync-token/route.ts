import { NextResponse } from "next/server";
import twilio from "twilio";

export async function GET() {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID!;
    const apiKey = process.env.TWILIO_API_KEY!;
    const apiSecret = process.env.TWILIO_API_SECRET!;
    const syncServiceSid = process.env.SYNC_SERVICE_SID || "default";

    if (!accountSid || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Missing TWILIO_ACCOUNT_SID, TWILIO_API_KEY, or TWILIO_API_SECRET" },
        { status: 500 }
      );
    }

    const AccessToken = twilio.jwt.AccessToken;
    const SyncGrant = AccessToken.SyncGrant;

    const token = new AccessToken(accountSid, apiKey, apiSecret, {
      identity: "translator-frontend",
      ttl: 3600,
    });

    const syncGrant = new SyncGrant({ serviceSid: syncServiceSid });
    token.addGrant(syncGrant);

    return NextResponse.json({ token: token.toJwt() });
  } catch (error) {
    console.error("Error generating Sync token:", error);
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    );
  }
}
