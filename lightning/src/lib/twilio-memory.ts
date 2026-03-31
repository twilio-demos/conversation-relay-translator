const accountSid = process.env.TWILIO_ACCOUNT_SID ?? "";
const authToken = process.env.TWILIO_AUTH_TOKEN ?? "";
const storeId = process.env.MEMORY_STORE_ID ?? "";

export const memoryAuthHeaders = {
  Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
  "Content-Type": "application/json",
  "X-Pre-Auth-Context": accountSid,
};

export const memoryStoreId = storeId;

export interface MemoryProfile {
  id: string;
  traits?: {
    Contact?: {
      phone?: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export async function fetchProfile(profileId: string): Promise<MemoryProfile | null> {
  const res = await fetch(
    `https://memory.twilio.com/v1/Stores/${storeId}/Profiles/${profileId}`,
    { headers: memoryAuthHeaders }
  );
  if (!res.ok) return null;
  return res.json();
}

export async function lookupProfileId(phoneNumber: string): Promise<string | null> {
  const res = await fetch(
    `https://memory.twilio.com/v1/Stores/${storeId}/Profiles/Lookup`,
    {
      method: "POST",
      headers: memoryAuthHeaders,
      body: JSON.stringify({ idType: "phone", value: phoneNumber }),
    }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data?.profiles?.[0] ?? null;
}
