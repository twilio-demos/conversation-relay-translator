import { listSessions } from "@/lib/dynamodb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

export async function GET() {
  try {
    const session = await getServerSession();
    const owner =
      process.env.NEXT_PUBLIC_EMAIL || session?.user?.email || undefined;
    const sessions = await listSessions(owner);

    return NextResponse.json(sessions ?? []);
  } catch (error) {
    console.error("Error getting profile:", error);
    return NextResponse.json(
      { error: "Failed to get profile" },
      { status: 500 }
    );
  }
}
