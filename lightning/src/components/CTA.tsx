"use client";

import { useDemo } from "@/components/DemoProvider";
import { Memory } from "@/components/Memory";
import { Button } from "@/components/ui/button";
import { useResetLanguage } from "@/hooks/use-reset-language";
import { useEffect, useState } from "react";

export function CTA() {
  const { resetDemo } = useDemo();
  const resetLanguage = useResetLanguage();
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      resetDemo();
      return;
    }
    const t = setTimeout(() => setCountdown((c) => (c ?? 1) - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  function handleRestart() {
    resetLanguage();
    setCountdown(3);
  }

  return (
    <div className="flex flex-col gap-4 h-full w-full p-6">
      <Memory />
      <Button
        onClick={handleRestart}
        disabled={countdown !== null}
        className="w-full"
      >
        {countdown !== null
          ? `Restarting in ${countdown}…`
          : "Restart Demo"}
      </Button>
    </div>
  );
}
