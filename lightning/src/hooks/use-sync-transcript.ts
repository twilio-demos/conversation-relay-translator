"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SyncClient, type SyncStream } from "twilio-sync";

export type SyncTranscriptMessage = {
  id: number;
  text: string;
  whichParty: "caller" | "callee";
  isFinal: boolean;
};

export function useSyncTranscript(phoneNumber: string) {
  const [messages, setMessages] = useState<SyncTranscriptMessage[]>([]);
  const clientRef = useRef<SyncClient | null>(null);
  const streamRef = useRef<SyncStream | null>(null);

  const handleStreamMessage = useCallback(
    (args: { message: { data: object }; isLocal: boolean }) => {
      const data = args.message.data as Record<string, unknown>;
      if (data.type !== "transcription") return;

      const text = data.text as string;
      const role = data.role as "user" | "assistant";
      const isFinal = data.isFinal as boolean;
      const whichParty: "caller" | "callee" =
        role === "user" ? "caller" : "callee";

      setMessages((prev) => {
        // Look for an existing streaming (non-final) entry from the same party
        const streamingIdx = prev.findLastIndex(
          (m) => m.whichParty === whichParty && !m.isFinal
        );

        if (!isFinal) {
          // Partial: update existing streaming entry or create new one
          if (streamingIdx >= 0) {
            const updated = [...prev];
            updated[streamingIdx] = {
              ...prev[streamingIdx],
              text,
            };
            return updated;
          }
          return [
            ...prev,
            { id: Date.now(), text, whichParty, isFinal: false },
          ];
        }

        // Final: replace streaming entry or append new final entry
        if (streamingIdx >= 0) {
          const updated = [...prev];
          updated[streamingIdx] = {
            ...prev[streamingIdx],
            text,
            isFinal: true,
          };
          return updated;
        }
        return [...prev, { id: Date.now(), text, whichParty, isFinal: true }];
      });
    },
    []
  );

  useEffect(() => {
    if (!phoneNumber) return;

    const streamName = `translator-${phoneNumber.replace(/\+/g, "")}`;
    let cancelled = false;

    async function connect() {
      try {
        const res = await fetch("/api/sync-token");
        if (!res.ok) {
          console.error("Failed to fetch Sync token");
          return;
        }
        const { token } = await res.json();
        if (cancelled) return;

        const client = new SyncClient(token);
        clientRef.current = client;

        // Refresh token before expiry
        client.on("tokenAboutToExpire", async () => {
          try {
            const refreshRes = await fetch("/api/sync-token");
            if (refreshRes.ok) {
              const { token: newToken } = await refreshRes.json();
              client.updateToken(newToken);
            }
          } catch (err) {
            console.error("Failed to refresh Sync token:", err);
          }
        });

        const stream = await client.stream(streamName);
        if (cancelled) {
          stream.close();
          client.shutdown();
          return;
        }
        streamRef.current = stream;
        stream.on("messagePublished", handleStreamMessage);
      } catch (err) {
        console.error("Sync connection error:", err);
      }
    }

    connect();

    return () => {
      cancelled = true;
      if (streamRef.current) {
        streamRef.current.close();
        streamRef.current = null;
      }
      if (clientRef.current) {
        clientRef.current.shutdown();
        clientRef.current = null;
      }
    };
  }, [phoneNumber, handleStreamMessage]);

  const clearMessages = useCallback(() => setMessages([]), []);

  return { messages, clearMessages };
}
