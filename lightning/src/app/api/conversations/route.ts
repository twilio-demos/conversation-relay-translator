import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const conversationId = searchParams.get("conversationId");
  const status = searchParams.get("status");
  const pageSize = searchParams.get("pageSize");
  const pageToken = searchParams.get("pageToken");

  try {
    const twilioAccountSidEnv = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuthTokenEnv = process.env.TWILIO_AUTH_TOKEN;

    let fetchUrl = "https://conversations.twilio.com/v2/Conversations";

    if (conversationId) {
      fetchUrl += `/${conversationId}`;
    } else {
      const params = new URLSearchParams();
      if (status) params.append("status", status);
      if (pageSize) params.append("pageSize", pageSize);
      if (pageToken) params.append("pageToken", pageToken);
      fetchUrl += `?${params.toString()}`;
    }

    const conversationResponse = await fetch(fetchUrl, {
      headers: {
        Authorization:
          "Basic " + btoa(`${twilioAccountSidEnv}:${twilioAuthTokenEnv}`),
        "Content-Type": "application/json",
        "X-Pre-Auth-Context": twilioAccountSidEnv ?? "",
      },
      method: "GET",
    });

    const data = await conversationResponse.json();
    if (!conversationResponse.ok) {
      return NextResponse.json({ error: data }, { status: conversationResponse.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { conversationsId, status }: { conversationsId: string; status: string } = await request.json();

    if (!conversationsId || !status) {
      return NextResponse.json({ error: "Invalid request parameters" }, { status: 400 });
    }

    if (status !== "ACTIVE" && status !== "CLOSED") {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    const twilioAccountSidEnv = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuthTokenEnv = process.env.TWILIO_AUTH_TOKEN;

    const conversationResponse = await fetch(
      `https://conversations.twilio.com/v2/Conversations/${conversationsId}`,
      {
        method: "PUT",
        body: JSON.stringify({ status }),
        headers: {
          Authorization: "Basic " + btoa(`${twilioAccountSidEnv}:${twilioAuthTokenEnv}`),
          "Content-Type": "application/json",
          "X-Pre-Auth-Context": twilioAccountSidEnv ?? "",
        },
      }
    );

    const data = await conversationResponse.json();
    if (!conversationResponse.ok) {
      return NextResponse.json({ error: data }, { status: conversationResponse.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
