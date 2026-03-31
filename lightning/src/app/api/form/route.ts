import { SiteEvent } from "@/lib/events";
import { segmentTrack } from "@gtmi/utilities/telemetry/node";
import { NextRequest, NextResponse } from "next/server";

// POST /api/form
export async function POST(request: NextRequest) {
  const writeKey = process.env.SEGMENT_WRITE_KEY;

  try {
    const body = await request.json();

    const { email, ...formBody } = body;

    segmentTrack(writeKey || "", {
      event: SiteEvent.INFO_FORM_SUBMITTED,
      userId: email,
      properties: { email, ...formBody },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error processing form:", error);
    return NextResponse.json(
      { error: "Failed to process form" },
      { status: 500 }
    );
  }
}
