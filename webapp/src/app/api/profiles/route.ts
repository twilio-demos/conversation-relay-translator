import { listProfiles, putProfile } from "@/lib/dynamodb";
import { UserProfile } from "@/types/profile";
import Analytics from "@segment/analytics-node";
import { NextRequest, NextResponse } from "next/server";

const analytics = new Analytics({
  writeKey: process.env.SEGMENT_WRITE_KEY || "",
});

// GET /api/profiles - List all profiles
export async function GET() {
  try {
    const profiles = await listProfiles();
    return NextResponse.json(profiles);
  } catch (error) {
    console.error("Error listing profiles:", error);
    return NextResponse.json(
      { error: "Failed to list profiles" },
      { status: 500 }
    );
  }
}

// POST /api/profiles - Create a new profile
export async function POST(request: NextRequest) {
  try {
    const profile: UserProfile = await request.json();

    // Basic validation
    if (!profile.phoneNumber || !profile.name) {
      return NextResponse.json(
        { error: "Phone number and name are required" },
        { status: 400 }
      );
    }

    await putProfile(profile);

    await analytics.track({
      event: "Profile Created",
      properties: profile,
      userId: profile.creator,
      anonymousId: "",
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error creating profile:", error);
    return NextResponse.json(
      { error: "Failed to create profile" },
      { status: 500 }
    );
  }
}
