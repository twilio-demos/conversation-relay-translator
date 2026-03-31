import { deleteCintelResultsByPhone, getCintelResults } from "@/lib/dynamodb";
import { NextRequest, NextResponse } from "next/server";

// GET /api/cintel
export async function GET() {
  try {
    const results = await getCintelResults();
    return NextResponse.json(results);
  } catch (error) {
    console.error("Error fetching cintel results:", error);
    return NextResponse.json(
      { error: "Failed to fetch cintel results" },
      { status: 500 }
    );
  }
}

// DELETE /api/cintel
export async function DELETE(request: NextRequest) {
  try {
    const { phoneNumber } = await request.json();

    if (!phoneNumber) {
      return NextResponse.json(
        { error: "phoneNumber is required" },
        { status: 400 }
      );
    }

    await deleteCintelResultsByPhone(phoneNumber);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting cintel results:", error);
    return NextResponse.json(
      { error: "Failed to delete cintel results" },
      { status: 500 }
    );
  }
}
