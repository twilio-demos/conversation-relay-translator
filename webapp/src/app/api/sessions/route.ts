import { listSessions } from "@/lib/dynamodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sessions = await listSessions();

    return NextResponse.json(sessions ?? []);
  } catch (error) {
    console.error("Error getting profile:", error);
    return NextResponse.json(
      { error: "Failed to get profile" },
      { status: 500 }
    );
  }
}
