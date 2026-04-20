import { deleteReadyState, getReadyState, putReadyState } from "@/lib/dynamodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const state = await getReadyState();
    return NextResponse.json(state);
  } catch (error) {
    console.error("Error fetching ready state:", error);
    return NextResponse.json({ error: "Failed to fetch ready state" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { party, ready, p1Phone, p2Phone }: {
      party: "p1" | "p2";
      ready: boolean;
      p1Phone?: string;
      p2Phone?: string;
    } = await request.json();
    if (!party || ready === undefined) {
      return NextResponse.json({ error: "party and ready are required" }, { status: 400 });
    }
    const updated = await putReadyState({
      ...(party === "p1" ? { p1Ready: ready } : { p2Ready: ready }),
      ...(p1Phone ? { p1Phone } : {}),
      ...(p2Phone ? { p2Phone } : {}),
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating ready state:", error);
    return NextResponse.json({ error: "Failed to update ready state" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await deleteReadyState();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting ready state:", error);
    return NextResponse.json({ error: "Failed to delete ready state" }, { status: 500 });
  }
}
