import { type Session } from "@/types/profile";
import { useEffect, useRef, useState } from "react";

export const useSession = (sessionId: string) => {
  const [session, setSession] = useState<Session>();

  const [isPolling, setIsPolling] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (session?.callStatus && session.callStatus !== "connected") {
      setIsPolling(false);
    }
  }, [session?.callStatus]);

  useEffect(() => {
    if (!sessionId || sessionId === "Unknown" || !isPolling) {
      return;
    }

    const pollSession = async () => {
      try {
        const response = await fetch(
          `/api/sessions/${encodeURIComponent(sessionId)}`
        );

        if (response.ok) {
          const data = await response.json();
          if (data) {
            setSession(data);
          }
        }
      } catch (error) {
        console.error("Error polling session:", error);
      }
    };

    pollSession();

    intervalRef.current = setInterval(pollSession, 2000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [sessionId, isPolling]);

  return { session, isPolling, setIsPolling };
};
