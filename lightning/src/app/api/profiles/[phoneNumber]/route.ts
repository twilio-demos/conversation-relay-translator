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

    if (!currentProfile) {
      return NextResponse.json({ success: true });
    }

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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ phoneNumber: string }> }
) {
  try {
    const { phoneNumber: rawPhoneNumber } = await params;
    const cleanPhoneNumber1 = decodeURIComponent(rawPhoneNumber);
    const cleanPhoneNumber2 = request.nextUrl.searchParams.get("phone2") ?? "";

    const currentProfile = (await listProfiles()).filter(
      (p) => p.phoneNumber === cleanPhoneNumber1
    )[0];

    if (!currentProfile) {
      const defaults: UserProfile = {
        phoneNumber: cleanPhoneNumber1,
        name: "Automated",
        sourceLanguage: "en-US",
        sourceLanguageCode: "en",
        sourceLanguageFriendly: "English - United States",
        sourceTranscriptionProvider: "Deepgram",
        sourceTtsProvider: "ElevenLabs",
        sourceVoice: "UgBBYS2sOqTuMpoF3BR0",
        calleeDetails: true,
        calleeNumber: cleanPhoneNumber2,
        calleeLanguage: "en-US",
        calleeLanguageCode: "en",
        calleeLanguageFriendly: "English - United States",
        calleeTranscriptionProvider: "Deepgram",
        calleeTtsProvider: "ElevenLabs",
        calleeVoice: "UgBBYS2sOqTuMpoF3BR0",
        useFlex: false,
        flexNumber: process.env.NEXT_PUBLIC_FLEX_NUMBER ?? "",
        flexWorkerHandle: "",
        useExternalFlex: false,
        externalFlexNumber: "",
        customSourceHash: "",
        customCalleeHash: "",
      };

      await putProfile(defaults);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
