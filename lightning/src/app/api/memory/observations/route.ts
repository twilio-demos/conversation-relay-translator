import { NextRequest, NextResponse } from "next/server";
import {
  lookupProfileId,
  memoryAuthHeaders,
  memoryStoreId,
} from "@/lib/twilio-memory";

async function fetchAllObservationIds(profileId: string): Promise<string[]> {
  const ids: string[] = [];
  let pageToken: string | null = null;

  do {
    const params = new URLSearchParams({ pageSize: "20" });
    if (pageToken) params.set("pageToken", pageToken);

    const res = await fetch(
      `https://memory.twilio.com/v1/Stores/${memoryStoreId}/Profiles/${profileId}/Observations?${params}`,
      { headers: memoryAuthHeaders }
    );

    if (!res.ok) break;

    const data = await res.json();
    const observations: { id: string }[] = data?.observations ?? [];
    ids.push(...observations.map((o) => o.id));
    pageToken = data?.nextPageToken ?? null;
  } while (pageToken);

  return ids;
}

// DELETE /api/memory/observations — deletes all observations for a profile
export async function DELETE(request: NextRequest) {
  try {
    const { phoneNumber } = await request.json();

    if (!phoneNumber) {
      return NextResponse.json(
        { error: "phoneNumber is required" },
        { status: 400 }
      );
    }

    const profileId = await lookupProfileId(phoneNumber);
    if (!profileId) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const ids = await fetchAllObservationIds(profileId);

    await Promise.all(
      ids.map((id) =>
        fetch(
          `https://memory.twilio.com/v1/Stores/${memoryStoreId}/Profiles/${profileId}/Observations/${id}`,
          { method: "DELETE", headers: memoryAuthHeaders }
        )
      )
    );

    return NextResponse.json({ deleted: ids.length });
  } catch (error) {
    console.error("Error deleting observations:", (error as Error)?.message);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
