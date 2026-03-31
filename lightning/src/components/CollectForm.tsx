"use client";

import { CtaForm } from "@/app/components/forms/cta-form";

export function CollectForm() {
  return (
    <div className="border border-white/10 rounded-lg p-6 flex-1 overflow-y-auto">
      <p className="text-lg font-semibold text-white mb-4">Contact</p>
      <CtaForm />
    </div>
  );
}
