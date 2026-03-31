"use client";

import { useDemo } from "@/components/DemoProvider";
import { useCintelResults } from "@/hooks/use-cintel-result";
import { useEffect } from "react";

export function ActiveCall() {
  const { selectedLanguage, isPhone1, setPinnedCintelConversationId } = useDemo();
  const { data: allResults } = useCintelResults();

  useEffect(() => {
    const id = allResults?.[0]?.cintelConversationId;
    if (id) setPinnedCintelConversationId(id);
  }, [allResults]);

  const results = (() => {
    if (!allResults) return undefined;

    const filtered = allResults.filter(
      (r) => r.operatorFor === (isPhone1 ? "phone2" : "phone1")
    );

    const sorted = [...filtered].sort(
      (a, b) =>
        new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
    );

    const seen = new Set<string>();

    return sorted.filter((r) => {
      if (seen.has(r.operator.id)) return false;
      seen.add(r.operator.id);
      return true;
    });
  })();

  return (
    <div className="flex flex-col h-full w-full divide-y divide-white/10">
      {/* Top: Realtime Conversational Intelligence */}
      <div className="h-1/2 flex flex-col p-6 overflow-y-auto">
        <p className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-4">
          Realtime Conversational Intelligence
        </p>
        {results && results.length > 0 ? (
          <div className="flex flex-col gap-3">
            {results.map((r) => (
              <div
                key={r.id}
                className="border border-white/10 rounded-lg p-3 space-y-1">
                <p className="text-xs text-white/40">
                  {r.operator.displayName}
                </p>
                <p className="text-sm text-white font-medium capitalize">
                  {r.result.mood || r.result.summary}
                </p>
                <p className="text-xs text-muted-foreground">
                  {r.result.justification}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
            Waiting for intelligence results…
          </div>
        )}
      </div>

      {/* Bottom: Active call status */}
      <div className="h-1/2 flex flex-col items-center justify-center text-center gap-4 p-6">
        <span className="text-5xl">📞</span>
        <p className="text-3xl font-semibold text-white">Call Started</p>
        <p className="text-xl text-muted-foreground">
          Speak in{" "}
          <span className="text-white font-semibold">
            {selectedLanguage?.friendly ?? "your language"}
          </span>
        </p>
      </div>
    </div>
  );
}
