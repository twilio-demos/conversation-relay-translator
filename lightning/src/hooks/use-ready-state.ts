import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";

export interface ReadyState {
  p1Ready: boolean;
  p2Ready: boolean;
  p1Phone?: string;
  p2Phone?: string;
}

export function useReadyState() {
  const [readyState, setReadyState] = useState<ReadyState>({ p1Ready: false, p2Ready: false });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch("/api/ready");
        if (res.ok) {
          const data = await res.json();
          setReadyState(data);
        }
      } catch (error) {
        console.error("Error polling ready state:", error);
      }
    };

    poll();
    intervalRef.current = setInterval(poll, 2000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return { readyState, setReadyState };
}

export function useSetReady() {
  return useMutation({
    mutationFn: async ({
      party,
      ready,
      p1Phone,
      p2Phone,
    }: {
      party: "p1" | "p2";
      ready: boolean;
      p1Phone: string;
      p2Phone: string;
    }) => {
      const res = await fetch("/api/ready", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ party, ready, p1Phone, p2Phone }),
      });
      if (!res.ok) throw new Error("Failed to set ready state");
      return res.json() as Promise<ReadyState>;
    },
  });
}
