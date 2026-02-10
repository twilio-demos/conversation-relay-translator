import { type Session } from "@/types/profile";
import { useEffect, useRef, useState } from "react";

export const useSessions = (serverSessions: Session[]) => {
  const [sessions, setSessions] = useState<Session[]>(serverSessions);
  const [isPolling, setIsPolling] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const pollSessions = async () => {
      try {
        const response = await fetch("/api/sessions");

        if (response.ok) {
          const data = await response.json();
          if (data) {
            setSessions(data);
          }
        }
      } catch (error) {
        console.error("Error polling sessions:", error);
      }
    };

    pollSessions();

    intervalRef.current = setInterval(pollSessions, 2000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPolling]);

  return { sessions, isPolling, setIsPolling };
};
