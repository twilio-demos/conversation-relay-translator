import { putCintelOperatorResult } from "@/lib/dynamodb";
import { fetchProfile } from "@/lib/twilio-memory";
import { CintelResult } from "@/types/cintel";
import { NextRequest, NextResponse } from "next/server";

type CommunicationData = {
  author: { address: string; channel: string; participantId: string };
  recipients: Array<{
    address: string;
    channel: string;
    participantId: string;
  }>;
};

/**
 * Fetches communication data from the Twilio Conversations API.
 *
 * @param conversationId - The Twilio conversation ID
 * @param lastCommunicationId - The ID of the last communication in the conversation
 * @returns The communication data including author information
 * @throws Error if the Twilio API request fails
 */
const getLastCommunicationData = async (
  conversationId: string,
  lastCommunicationId: string
): Promise<CommunicationData> => {
  const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID || "";
  const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN || "";

  const lastCommunicationResponse = await fetch(
    `https://conversations.twilio.com/v2/Conversations/${conversationId}/Communications/${lastCommunicationId}`,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${twilioAccountSid}:${twilioAuthToken}`
        ).toString("base64")}`,
        "Content-Type": "application/json",
        "X-Pre-Auth-Context": twilioAccountSid,
      },
      method: "GET",
    }
  );

  if (!lastCommunicationResponse.ok) {
    throw new Error(
      `Twilio API error: ${lastCommunicationResponse.status} ${lastCommunicationResponse.statusText}`
    );
  }

  const lastCommunicationData =
    (await lastCommunicationResponse.json()) as CommunicationData;
  return lastCommunicationData;
};

// POST /api/webhook/cintel
export async function POST(request: NextRequest) {
  try {
    const body: CintelResult = await request.json();

    const conversationId = body.conversationId;

    for (const result of body.operatorResults) {
      const lastCommunicationId = result.executionDetails?.communications?.last;
      const lastCommunicationData = await getLastCommunicationData(
        conversationId,
        lastCommunicationId
      );

      const participants = result.executionDetails.participants;

      // Determine the customer number from the author address.
      const customerParticipant = participants.find(
        (participant) => participant.type === "CUSTOMER"
      );

      const agentParticipant = participants.find(
        (participant) => participant.type !== "CUSTOMER"
      );

      let customerPhone: string | undefined;
      let agentPhone: string | undefined;

      if (customerParticipant?.profileId) {
        const customerProfile = await fetchProfile(
          customerParticipant.profileId
        );
        customerPhone = customerProfile?.traits?.Contact?.phone ?? undefined;
      }

      if (agentParticipant?.profileId) {
        const agentProfile = await fetchProfile(agentParticipant.profileId);
        agentPhone = agentProfile?.traits?.Contact?.phone ?? undefined;
      }

      const messageSentBy =
        customerParticipant?.id === lastCommunicationData.author.participantId
          ? "CUSTOMER"
          : "HUMAN_AGENT";

      const operatorFor = messageSentBy === "CUSTOMER" ? "phone1" : "phone2";
      const phoneNumber =
        messageSentBy === "CUSTOMER" ? customerPhone : agentPhone;

      await putCintelOperatorResult(
        result,
        operatorFor,
        conversationId,
        phoneNumber
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing cintel webhook:", error);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
}
