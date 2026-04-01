import { useQuery } from "@tanstack/react-query";

interface MemoryRecallParams {
  phoneNumber: string;
  conversationId?: string;
  query?: string;
  communicationsLimit?: number;
  observationsLimit?: number;
  summariesLimit?: number;
  relevanceThreshold?: number;
}

export interface MemoryObservation {
  id: string;
  content: string;
  dateCreated: string;
  relevanceScore?: number;
}

export interface MemorySummary {
  id: string;
  content: string;
  dateCreated: string;
  relevanceScore?: number;
}

export interface MemoryRecallResult {
  observations: MemoryObservation[];
  summaries: MemorySummary[];
  communications: unknown[];
}

async function fetchMemoryRecall(
  params: MemoryRecallParams
): Promise<MemoryRecallResult> {
  const res = await fetch("/api/memory", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error("Failed to fetch memory recall");
  return res.json();
}

export function useMemoryRecall(params: MemoryRecallParams | null) {
  return useQuery({
    queryKey: ["memory", params],
    queryFn: () => fetchMemoryRecall(params!),
    enabled: !!params?.phoneNumber,
    refetchInterval: 2000,
  });
}
