"use client";

import { ActiveCall } from "@/components/ActiveCall";
import { CTA } from "@/components/CTA";
import { CtaDialog } from "@/components/CtaDialog";
import { useDemo } from "@/components/DemoProvider";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useEffect, useState } from "react";

export function Config() {
  const { callActive, callEnded, selectedLanguage, adminOverride } = useDemo();
  const [dialogDismissed, setDialogDismissed] = useState(false);

  // Reset dismissed state when a new call ends
  useEffect(() => {
    if (callEnded) setDialogDismissed(false);
  }, [callEnded]);

  function renderContent() {
    if (adminOverride === "cta") return <CTA />;
    if (adminOverride === "active") return <ActiveCall />;
    if (adminOverride === "language") return <LanguageSelector />;
    if (callEnded) return <CTA />;
    if (callActive && selectedLanguage) return <ActiveCall />;
    return <LanguageSelector />;
  }

  const showDialog =
    (callEnded || adminOverride === "cta") && !dialogDismissed;

  return (
    <div
      className="border border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex flex-col h-full w-full overflow-hidden"
      style={{ boxShadow: "inset 0 0 30px rgba(99,179,237,0.15)" }}>
      {renderContent()}
      <CtaDialog
        open={showDialog}
        onClose={() => setDialogDismissed(true)}
      />
    </div>
  );
}
