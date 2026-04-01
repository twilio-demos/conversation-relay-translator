"use client";

import { AdminOverride, useDemo } from "@/components/DemoProvider";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const VIEWS: { label: string; value: AdminOverride }[] = [
  { label: "Language Selector", value: "language" },
  { label: "Active Call", value: "active" },
  { label: "Post-Call CTA", value: "cta" },
];

export function AdminPanel() {
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);
  const { adminOverride, setAdminOverride, phone1, setPhone1, phone2, setPhone2, isPhone1, setIsPhone1, resetDemo } = useDemo();

  useEffect(() => {
    if (searchParams.get("admin") !== null) {
      setVisible(true);
    }
    const p1 = searchParams.get("phone1");
    const p2 = searchParams.get("phone2");
    if (p1) setPhone1(p1);
    if (p2) setPhone2(p2);
  }, [searchParams]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey && e.shiftKey && e.key === "A") {
        setVisible((v) => !v);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  if (!visible) return null;

  return (
    <>
    <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={() => setVisible(false)} />
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-gray-900 border border-white/20 rounded-xl p-6 shadow-2xl w-96">
      <p className="text-xs font-mono text-white/50 mb-3 uppercase tracking-widest">
        Admin Override
      </p>
      <div className="flex flex-col gap-2">
        {VIEWS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setAdminOverride(adminOverride === value ? null : value)}
            className={`text-sm px-3 py-2 rounded-lg text-left transition-colors ${
              adminOverride === value
                ? "bg-blue-600 text-white"
                : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}>
            {label}
          </button>
        ))}
        {adminOverride && (
          <button
            onClick={() => setAdminOverride(null)}
            className="text-xs px-3 py-1.5 rounded-lg bg-red-900/50 text-red-300 hover:bg-red-900 transition-colors mt-1">
            Clear Override
          </button>
        )}
      </div>
      <div className="mt-4 space-y-2">
        <p className="text-xs font-mono text-white/50 uppercase tracking-widest">Phones</p>
        <div>
          <p className="text-xs text-white/40 mb-1">Phone 1</p>
          <input
            type="tel"
            value={phone1}
            onChange={(e) => setPhone1(e.target.value)}
            className="w-full bg-white/10 text-white text-xs rounded-lg px-2 py-1.5 outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-white/30"
            placeholder="+1..."
          />
        </div>
        <label className="flex items-center gap-2 cursor-pointer py-1">
          <input
            type="checkbox"
            checked={isPhone1}
            onChange={(e) => setIsPhone1(e.target.checked)}
            className="w-3.5 h-3.5 accent-blue-500"
          />
          <span className="text-xs text-white/70">Is Phone 1</span>
        </label>
        <div>
          <p className="text-xs text-white/40 mb-1">Phone 2</p>
          <input
            type="tel"
            value={phone2}
            onChange={(e) => setPhone2(e.target.value)}
            className="w-full bg-white/10 text-white text-xs rounded-lg px-2 py-1.5 outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-white/30"
            placeholder="+1..."
          />
        </div>
      </div>
      <button
        onClick={resetDemo}
        className="w-full mt-4 text-xs px-3 py-2 rounded-lg bg-red-900/50 text-red-300 hover:bg-red-900 transition-colors">
        Reset Demo
      </button>
      <p className="text-xs text-white/30 mt-3">Ctrl+Shift+A to toggle</p>
    </div>
    </>
  );
}
