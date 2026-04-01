"use client";

import { LanguageService } from "@/lib/services/language";
import { createContext, useContext, useEffect, useRef, useState } from "react";

const LS_PHONE1 = "admin_phone1";
const LS_PHONE2 = "admin_phone2";
const LS_IS_PHONE1 = "admin_isPhone1";
const DEFAULT_PHONE1 = "+14707130015";
const DEFAULT_PHONE2 = "+12054413436";

type Language = (typeof LanguageService.LANGUAGES)[number];

export type AdminOverride = "language" | "active" | "cta" | null;

type DemoContextValue = {
  selectedLanguage: Language | null;
  setSelectedLanguage: (lang: Language | null) => void;
  callActive: boolean;
  setCallActive: (active: boolean) => void;
  callEnded: boolean;
  demoActive: boolean;
  setDemoActive: (active: boolean) => void;
  pinnedConversationId: string;
  setPinnedConversationId: (id: string) => void;
  adminOverride: AdminOverride;
  setAdminOverride: (override: AdminOverride) => void;
  resetDemo: () => void;
  pinnedCintelConversationId: string;
  setPinnedCintelConversationId: (id: string) => void;
  phone1: string;
  setPhone1: (v: string) => void;
  phone2: string;
  setPhone2: (v: string) => void;
  isPhone1: boolean;
  setIsPhone1: (v: boolean) => void;
};

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(
    () => LanguageService.LANGUAGES.find((l) => l.code === "en-US") ?? null
  );
  const [callActive, setCallActive] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [demoActive, setDemoActive] = useState(true);
  const [pinnedConversationId, setPinnedConversationId] = useState("");
  const [adminOverride, setAdminOverride] = useState<AdminOverride>(null);
  const [pinnedCintelConversationId, setPinnedCintelConversationId] = useState("");
  const [phone1, setPhone1Raw] = useState<string>(DEFAULT_PHONE1);
  const [phone2, setPhone2Raw] = useState<string>(DEFAULT_PHONE2);
  const [isPhone1, setIsPhone1Raw] = useState<boolean>(false);

  useEffect(() => {
    const p1 = localStorage.getItem(LS_PHONE1) ?? DEFAULT_PHONE1;
    const p2 = localStorage.getItem(LS_PHONE2) ?? DEFAULT_PHONE2;
    setPhone1Raw(p1);
    setPhone2Raw(p2);
    setIsPhone1Raw(localStorage.getItem(LS_IS_PHONE1) === "true");
    fetch(`/api/profiles/${encodeURIComponent(p1)}?phone2=${encodeURIComponent(p2)}`).catch(console.error);
  }, []);
  const prevCallActive = useRef(false);

  function setIsPhone1(v: boolean) {
    localStorage.setItem(LS_IS_PHONE1, String(v));
    setIsPhone1Raw(v);
  }

  function setPhone1(v: string) {
    localStorage.setItem(LS_PHONE1, v);
    setPhone1Raw(v);
  }
  function setPhone2(v: string) {
    localStorage.setItem(LS_PHONE2, v);
    setPhone2Raw(v);
  }

  function handleSetCallActive(active: boolean) {
    if (prevCallActive.current && !active && demoActive) {
      setCallEnded(true);
    }
    prevCallActive.current = active;
    setCallActive(active);
  }

  function resetDemo() {
    setSelectedLanguage(null);
    setCallActive(false);
    setCallEnded(false);
    setDemoActive(false);
    setPinnedConversationId("");
    setAdminOverride(null);
    setPinnedCintelConversationId("");
    prevCallActive.current = false;
    const currentPhone = isPhone1 ? phone1 : phone2;
    const memoryHeaders = { "Content-Type": "application/json" };
    const body = JSON.stringify({ phoneNumber: currentPhone });
    fetch("/api/cintel", { method: "DELETE", headers: memoryHeaders, body }).catch(console.error);
    fetch("/api/memory/observations", { method: "DELETE", headers: memoryHeaders, body }).catch(console.error);
    fetch("/api/memory/summaries", { method: "DELETE", headers: memoryHeaders, body }).catch(console.error);
  }

  function handleSetSelectedLanguage(lang: Language | null) {
    setSelectedLanguage(lang);
    if (lang) {
      setDemoActive(true);
      setCallEnded(false);
      setPinnedConversationId("");
    }
  }

  return (
    <DemoContext.Provider
      value={{
        selectedLanguage,
        setSelectedLanguage: handleSetSelectedLanguage,
        callActive,
        setCallActive: handleSetCallActive,
        callEnded,
        demoActive,
        setDemoActive,
        pinnedConversationId,
        setPinnedConversationId,
        adminOverride,
        setAdminOverride,
        resetDemo,
        pinnedCintelConversationId,
        setPinnedCintelConversationId,
        phone1,
        setPhone1,
        phone2,
        setPhone2,
        isPhone1,
        setIsPhone1,
      }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used within DemoProvider");
  return ctx;
}
