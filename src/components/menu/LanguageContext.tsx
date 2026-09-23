"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type Lang = "en" | "ar";

type LanguageCtx = {
  lang: Lang;
  rtl: boolean;
  setLang: (l: Lang) => void;
  toggle: () => void;
  /** Return the Arabic value when in Arabic and it exists, else English. */
  pick: (en: string, ar?: string | null) => string;
  /** Currency unit label for the active language. */
  unit: string;
};

const Ctx = createContext<LanguageCtx | null>(null);
const STORAGE_KEY = "rm_lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  // Restore saved choice, or fall back to the browser language on first visit.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "en" || saved === "ar") {
        setLangState(saved);
        return;
      }
    } catch {
      /* ignore */
    }
    if (typeof navigator !== "undefined" && navigator.language?.toLowerCase().startsWith("ar")) {
      setLangState("ar");
    }
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = useCallback(() => {
    setLangState((prev) => {
      const next = prev === "ar" ? "en" : "ar";
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const rtl = lang === "ar";
  const pick = useCallback(
    (en: string, ar?: string | null) => (rtl && ar && ar.trim() ? ar : en),
    [rtl],
  );
  const unit = rtl ? "ر.ع." : "OMR";

  return (
    <Ctx.Provider value={{ lang, rtl, setLang, toggle, pick, unit }}>
      {children}
    </Ctx.Provider>
  );
}

export function useLang(): LanguageCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useLang must be used within LanguageProvider");
  return c;
}
