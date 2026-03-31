"use client";

import { ActiveCall } from "@/components/ActiveCall";
import { CTA } from "@/components/CTA";
import { useDemo } from "@/components/DemoProvider";
import { LanguageSelector } from "@/components/LanguageSelector";

export function Config() {
  const { callActive, callEnded, selectedLanguage, adminOverride } = useDemo();

  function renderContent() {
    if (adminOverride === "cta") return <CTA />;
    if (adminOverride === "active") return <ActiveCall />;
    if (adminOverride === "language") return <LanguageSelector />;
    if (callEnded) return <CTA />;
    if (callActive && selectedLanguage) return <ActiveCall />;
    return <LanguageSelector />;
  }

  return (
    <div
      className="border border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex flex-col h-full w-full overflow-hidden"
      style={{ boxShadow: "inset 0 0 30px rgba(99,179,237,0.15)" }}>
      {renderContent()}
    </div>
  );
}
