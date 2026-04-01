/**
 * sync.mjs -- Twilio Sync broadcast helper
 *
 * Publishes messages to a Twilio Sync Stream keyed by phone number
 * so the frontend can display real-time transcriptions.
 *
 * Uses the Twilio REST API directly (no SDK) to avoid needing
 * the Twilio client layer.
 */

const SYNC_TTL = 3600;

function getAuth() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!accountSid || !authToken) return null;
  return {
    accountSid,
    header:
      "Basic " + Buffer.from(`${accountSid}:${authToken}`).toString("base64"),
  };
}

function getServiceSid() {
  return process.env.SYNC_SERVICE_SID || "default";
}

function syncUrl(serviceSid, path) {
  return `https://sync.twilio.com/v1/Services/${serviceSid}${path}`;
}

async function syncFetch(auth, serviceSid, path, body) {
  const res = await fetch(syncUrl(serviceSid, path), {
    method: "POST",
    headers: {
      Authorization: auth.header,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(body),
  });
  return res;
}

/**
 * Publish a message to a Sync Stream for the given phone number.
 * Auto-creates the stream if it doesn't exist.
 * Best-effort — errors are logged but not thrown.
 *
 * @param {string} phoneNumber - The phone number used as stream identifier
 * @param {object} message - The message payload to publish
 */
export async function broadcastToSync(phoneNumber, message) {
  const auth = getAuth();
  if (!auth) return;

  const serviceSid = getServiceSid();
  const streamName = `translator-${phoneNumber.replace(/\+/g, "")}`;

  try {
    // Try to publish to the stream
    const res = await syncFetch(
      auth,
      serviceSid,
      `/Streams/${streamName}/Messages`,
      { Data: JSON.stringify(message) }
    );

    if (res.ok) return;

    // If stream doesn't exist (404), create it and retry
    if (res.status === 404) {
      await syncFetch(auth, serviceSid, "/Streams", {
        UniqueName: streamName,
        Ttl: SYNC_TTL,
      });

      await syncFetch(
        auth,
        serviceSid,
        `/Streams/${streamName}/Messages`,
        { Data: JSON.stringify(message) }
      );
    } else {
      const text = await res.text();
      console.error(`Sync publish error (${res.status}):`, text);
    }
  } catch (error) {
    console.error("Sync broadcast error:", error);
  }
}
