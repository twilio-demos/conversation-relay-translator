"use client";

import { useDemo } from "@/components/DemoProvider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useResetLanguage } from "@/hooks/use-reset-language";
import { useUpdateProfile } from "@/hooks/use-update-profile";
import { LanguageService } from "@/lib/services/language";
import { useEffect } from "react";

const LANGUAGES = LanguageService.LANGUAGES;

export function LanguageSelector() {
  const { selectedLanguage, setSelectedLanguage, isPhone1, phone1, setDemoActive } =
    useDemo();
  const { mutate: updateProfile, isPending, isSuccess } = useUpdateProfile();
  const resetLanguage = useResetLanguage();

  useEffect(() => {
    setDemoActive(true);
    resetLanguage();
    fetch("/api/cintel", { method: "DELETE" }).catch(console.error);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleLanguageChange(code: string) {
    const lang = LANGUAGES.find((l) => l.code === code) ?? null;
    setSelectedLanguage(lang);

    if (!lang) return;

    const voice =
      LanguageService.ELEVEN_LABS_VOICES[
        lang.translateCode as keyof typeof LanguageService.ELEVEN_LABS_VOICES
      ]?.[0] ?? "";
    if (isPhone1) {
      updateProfile({
        phoneNumber: phone1,
        sourceLanguage: lang.code,
        sourceLanguageCode: lang.translateCode,
        sourceLanguageFriendly: lang.friendly,
        sourceVoice: voice,
      });
    } else {
      updateProfile({
        phoneNumber: phone1,
        calleeLanguage: lang.code,
        calleeLanguageCode: lang.translateCode,
        calleeLanguageFriendly: lang.friendly,
        calleeVoice: voice,
      });
    }
  }

  return (
    <div className="flex flex-col items-center justify-center text-center gap-6 h-full w-full p-8">
      <p className="text-3xl font-semibold">Pick your Language!</p>

      <div className="w-full space-y-3">
        <label className="text-lg text-muted-foreground">Select Language</label>
        <Select
          value={selectedLanguage?.code ?? ""}
          onValueChange={handleLanguageChange}
          disabled={isPending}>
          <SelectTrigger className="text-xl h-14">
            <SelectValue placeholder="Select a language..." />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((lang) => (
              <SelectItem
                key={lang.code}
                value={lang.code}
                className="text-lg py-2">
                {lang.friendly}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="h-5 flex items-center justify-center">
          {isPending && (
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <svg
                className="animate-spin h-4 w-4"
                viewBox="0 0 24 24"
                fill="none">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              Saving…
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
