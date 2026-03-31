"use client";

import { useDemo } from "@/components/DemoProvider";
import { useMemoryRecall } from "@/hooks/use-memory-recall";

export function Memory() {
  const { phone2, pinnedConversationId, pinnedCintelConversationId } =
    useDemo();

  const { data, isPending } = useMemoryRecall({
    phoneNumber: phone2,
    conversationId:
      pinnedCintelConversationId || pinnedConversationId || undefined,
    observationsLimit: 3,
    summariesLimit: 2,
  });

  const observations = data?.observations ?? [];
  const summaries = data?.summaries ?? [];
  const hasContent = observations.length > 0 || summaries.length > 0;

  return (
    <div className="border border-white/10 rounded-lg p-6 flex-1 overflow-y-auto">
      <p className="text-lg font-semibold text-white mb-4">Memory</p>

      {isPending && !data && (
        <p className="text-sm text-muted-foreground">Loading…</p>
      )}

      {!isPending && !hasContent && (
        <p className="text-sm text-muted-foreground">Nothing captured yet.</p>
      )}

      {hasContent && (
        <div className="space-y-4">
          {summaries.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-white/40 uppercase tracking-widest">
                Summaries
              </p>
              {summaries.map((s) => (
                <div key={s.id} className="border border-white/10 rounded-lg p-3">
                  <p className="text-sm text-white/80">{s.content}</p>
                </div>
              ))}
            </div>
          )}

          {observations.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-white/40 uppercase tracking-widest">
                Observations
              </p>
              {observations.map((o) => (
                <div key={o.id} className="border border-white/10 rounded-lg p-3">
                  <p className="text-sm text-white/80">{o.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
