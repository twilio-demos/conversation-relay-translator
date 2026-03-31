import { StoredOperatorResult } from "@/types/cintel";
import { useQuery } from "@tanstack/react-query";

async function fetchCintelResults(): Promise<StoredOperatorResult[]> {
  const res = await fetch("/api/cintel");
  if (!res.ok) throw new Error("Failed to fetch cintel results");
  return res.json();
}

export function useCintelResults() {
  return useQuery({
    queryKey: ["cintel"],
    queryFn: fetchCintelResults,
    refetchInterval: 3000,
  });
}
