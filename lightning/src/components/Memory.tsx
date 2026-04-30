"use client";

import { useDemo } from "@/components/DemoProvider";
import { useMemoryRecall } from "@/hooks/use-memory-recall";

function SectionLoader({ label }: { label: string }) {
  return (
    <div className="border border-white/10 rounded-lg p-3 flex items-center gap-3">
      <div className="flex gap-1 shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce [animation-delay:0ms]" />
        <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce [animation-delay:150ms]" />
        <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce [animation-delay:300ms]" />
      </div>
      <p className="text-sm text-white/50">{label}</p>
    </div>
  );
}

export function Memory() {
  const { phone2, pinnedConversationId, pinnedCintelConversationId } =
    useDemo();

  const { data, isPending } = useMemoryRecall({
    phoneNumber: phone2,
    conversationId:
      pinnedCintelConversationId || pinnedConversationId || undefined,
    observationsLimit: 3,
    summariesLimit: 1,
  });

  const observations = data?.observations ?? [];
  const summaries = data?.summaries ?? [];

  const isActive = isPending || !!data;
  const isSummariesLoading = isActive && summaries.length === 0;
  const isObservationsLoading = isActive && observations.length === 0;

  return (
    <div className="border border-white/10 rounded-lg p-6 flex-1 overflow-y-auto">
      <p className="text-lg font-semibold text-white mb-4">Memory</p>

      {!isActive && (
        <p className="text-sm text-muted-foreground">Nothing captured yet.</p>
      )}

      {isActive && (
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-xs text-white/40 uppercase tracking-widest">
              Summaries
            </p>
            {isSummariesLoading ? (
              <SectionLoader label="Please wait while we create summaries for your conversation" />
            ) : (
              summaries.map((s) => (
                <div key={s.id} className="border border-white/10 rounded-lg p-3">
                  <p className="text-sm text-white/80">{s.content}</p>
                </div>
              ))
            )}
          </div>

          <div className="space-y-2">
            <p className="text-xs text-white/40 uppercase tracking-widest">
              Observations
            </p>
            {isObservationsLoading ? (
              <SectionLoader label="Please wait while we create observations for your conversation" />
            ) : (
              observations.map((o) => (
                <div key={o.id} className="border border-white/10 rounded-lg p-3">
                  <p className="text-sm text-white/80">{o.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
