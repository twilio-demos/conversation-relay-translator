"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Languages, PhoneCall, UserPlus } from "lucide-react";
import Image from "next/image";

type HeroBannerProps = {
  title?: string;
  subtitle?: string;
};

const phoneNumber = process.env.NEXT_PUBLIC_PHONE_NUMBER ?? "+12232155654";

const steps = [
  { icon: UserPlus, label: "1. Create a profile" },
  { icon: Languages, label: "2. Configure Languages" },
  { icon: PhoneCall, label: "3. Call Number", description: phoneNumber },
];

export function HeroBanner({
  title = "ConversationRelay Translator",
  subtitle = "Build, test, and launch AI-powered translation experiences across voice channels in just minutes.",
}: HeroBannerProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="!p-6 md:!p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-10">
          {/* Left: Copy */}
          <div className="flex-[1.2] min-w-0 space-y-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-semibold mb-3">
                {title}
              </h3>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                {subtitle}
              </p>
            </div>

            {/* Workflow steps - mobile (no arrows) */}
            <div className="flex md:hidden justify-center gap-8">
              {steps.map((step) => (
                <div
                  key={step.label}
                  className="flex flex-col items-center text-center gap-3">
                  <step.icon className="h-10 w-10 text-blue-500" />
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">
                      {step.label}
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap min-h-[1rem]">
                      {step.description}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Workflow steps - desktop (with arrows) */}
            <div className="hidden md:flex items-start gap-6">
              {steps.map((step, i) => (
                <div key={step.label} className="contents">
                  <div className="flex flex-col items-center text-center gap-3">
                    <step.icon className="h-12 w-12 text-blue-500" />
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-semibold text-muted-foreground whitespace-nowrap">
                        {step.label}
                      </span>
                      <span className="text-sm font-bold text-muted-foreground whitespace-nowrap min-h-[1.25rem]">
                        {step.description}
                      </span>
                    </div>
                  </div>
                  {i < steps.length - 1 && (
                    <ArrowRight className="h-5 w-5 text-blue-500 shrink-0 mt-6" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Visual */}
          <div className="flex-1 w-full lg:w-auto flex items-center justify-center">
            <Image
              src="/translation.png"
              alt="Translation illustration"
              width={500}
              height={300}
              className="max-w-full h-auto object-contain"
              priority
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
