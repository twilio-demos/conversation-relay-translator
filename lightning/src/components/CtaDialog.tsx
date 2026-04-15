"use client";

import { CtaForm } from "@/app/components/forms/cta-form";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface CtaDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CtaDialog({ open, onClose }: CtaDialogProps) {
  const [submitted, setSubmitted] = useState(false);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md rounded-lg border border-white/10 bg-gray-950 p-6 shadow-2xl">
        <p className="text-lg font-semibold text-white mb-4">Contact</p>
        <CtaForm onSuccess={() => setSubmitted(true)} />
        {!submitted && (
          <Button
            variant="ghost"
            className="w-full mt-3 text-muted-foreground"
            onClick={onClose}
          >
            Skip
          </Button>
        )}
      </div>
    </div>
  );
}
