import { NextRequest, NextResponse } from "next/server";

interface MemoryRecallBody {
  phoneNumber: string;
  storeId: string;
  conversationId?: string;
  query?: string;
  beginDate?: string;
  endDate?: string;
  communicationsLimit?: number;
  observationsLimit?: number;
  summariesLimit?: number;
  relevanceThreshold?: number;
}

const accountSid = process.env.TWILIO_ACCOUNT_SID ?? "";
const authToken = process.env.TWILIO_AUTH_TOKEN ?? "";
const storeId = process.env.MEMORY_STORE_ID ?? "";

const memoryProfileLookup = async (phoneNumber: string) => {
  const fetchUrl = `https://memory.twilio.com/v1/Stores/${storeId}/Profiles/Lookup`;

  const lookupResponse = await fetch(fetchUrl, {
    body: JSON.stringify({ idType: "phone", value: phoneNumber }),
    headers: {
      Authorization: "Basic " + btoa(`${accountSid}:${authToken}`),
      "Content-Type": "application/json",
      "X-Pre-Auth-Context": accountSid,
    },
    method: "POST",
  });

  const data = await lookupResponse.json();

  if (!lookupResponse.ok) {
    return undefined;
  }

  return data;
};

// POST /api/memory
export async function POST(request: NextRequest) {
  try {
    const body: MemoryRecallBody = await request.json();
    const { phoneNumber, ...rest } = body;

    const { profiles } = await memoryProfileLookup(phoneNumber);
    const profileId = profiles[0];

    const fetchUrl = `https://memory.twilio.com/v1/Stores/${storeId}/Profiles/${profileId}/Recall`;

    const payload: Record<string, unknown> = {};
    if (rest.conversationId) payload.conversationId = rest.conversationId;
    if (rest.query) payload.query = rest.query;
    if (rest.beginDate) payload.beginDate = rest.beginDate;
    if (rest.endDate) payload.endDate = rest.endDate;
    if (rest.communicationsLimit !== undefined)
      payload.communicationsLimit = rest.communicationsLimit;
    if (rest.observationsLimit !== undefined)
      payload.observationsLimit = rest.observationsLimit;
    if (rest.summariesLimit !== undefined)
      payload.summariesLimit = rest.summariesLimit;
    if (rest.relevanceThreshold !== undefined)
      payload.relevanceThreshold = rest.relevanceThreshold;

    const response = await fetch(fetchUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${accountSid}:${authToken}`
        ).toString("base64")}`,
        "Content-Type": "application/json",
        "X-Pre-Auth-Context": accountSid,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error retrieving memories:", (error as Error)?.message);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
