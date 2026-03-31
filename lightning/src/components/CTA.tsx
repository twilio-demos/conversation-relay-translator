"use client";

import { CollectForm } from "@/components/CollectForm";
import { Memory } from "@/components/Memory";

export function CTA() {
  return (
    <div className="flex flex-col gap-4 h-full w-full p-6">
      <Memory />
      <CollectForm />
    </div>
  );
}
