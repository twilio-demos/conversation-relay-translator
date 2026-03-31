import { listProfiles, putProfile } from "@/lib/dynamodb";
import { UserProfile } from "@/types/profile";
import { NextRequest, NextResponse } from "next/server";

// PUT /api/profiles/[phoneNumber] - Update a profile
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ phoneNumber: string }> }
) {
  try {
    const { phoneNumber: rawPhoneNumber } = await params;
    const phoneNumber = decodeURIComponent(rawPhoneNumber);

    const currentProfile = (await listProfiles()).filter(
      (p) => p.phoneNumber === phoneNumber
    )[0];

    const profile: UserProfile = await request.json();
    const values = {
      ...currentProfile,
      ...profile,
    };

    await putProfile(values);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
