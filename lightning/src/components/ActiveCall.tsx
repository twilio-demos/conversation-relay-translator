"use client";

import { useDemo } from "@/components/DemoProvider";

export function ActiveCall() {
  const { selectedLanguage } = useDemo();

  return (
    <div className="flex flex-col items-center justify-center text-center gap-4 h-full w-full">
      <span className="text-5xl">📞</span>
      <p className="text-3xl font-semibold text-white">Call Started</p>
      <p className="text-xl text-muted-foreground">
        Speak in{" "}
        <span className="text-white font-semibold">
          {selectedLanguage?.friendly ?? "your language"}
        </span>
      </p>
    </div>
  );
}
