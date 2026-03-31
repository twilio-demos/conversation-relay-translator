"use client";

import { useDemo } from "@/components/DemoProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useResetLanguage } from "@/hooks/use-reset-language";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface CtaFormData {
  fullName: string;
  email: string;
  company: string;
  businessUseCase: string;
}

async function submitForm(data: CtaFormData) {
  const res = await fetch("/api/form", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to submit form");
  return res.json();
}

export function CtaForm() {
  const [form, setForm] = useState<CtaFormData>({
    fullName: "",
    email: "",
    company: "",
    businessUseCase: "",
  });
  const [countdown, setCountdown] = useState<number | null>(null);
  const { resetDemo } = useDemo();
  const resetLanguage = useResetLanguage();

  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationFn: submitForm,
    onSuccess: () => {
      resetLanguage();
      setCountdown(3);
    },
  });

  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      resetDemo();
      return;
    }
    const t = setTimeout(() => setCountdown((c) => (c ?? 1) - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(form);
  };

  if (isSuccess) {
    return (
      <div className="text-center py-8 space-y-2">
        <p className="text-lg font-medium">Thanks for reaching out!</p>
        <p className="text-muted-foreground">We'll be in touch soon.</p>
        {countdown !== null && (
          <p className="text-sm text-muted-foreground">
            Restarting in {countdown}…
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          name="fullName"
          placeholder="Jane Smith"
          value={form.fullName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="jane@company.com"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="company">Company</Label>
        <Input
          id="company"
          name="company"
          placeholder="Acme Corp"
          value={form.company}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="businessUseCase">Business Use Case</Label>
        <p className="text-xs text-muted-foreground">
          <i>Let us know how we can help you get started</i>
        </p>
        <textarea
          id="businessUseCase"
          name="businessUseCase"
          placeholder="We want to use real-time translation to support multilingual customer support calls..."
          value={form.businessUseCase}
          onChange={handleChange}
          required
          rows={4}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
        />
      </div>

      {isError && (
        <p className="text-sm text-destructive">
          Something went wrong. Please try again.
        </p>
      )}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
}
