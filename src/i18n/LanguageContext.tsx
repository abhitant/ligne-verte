import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { en } from "./en";

export type Lang = "fr" | "en";

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  /** Translate a French source string. Falls back to the French text. */
  t: (fr: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = "lv-lang";

const getInitialLang = (): Lang => {
  if (typeof window === "undefined") return "fr";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "en" || stored === "fr") return stored;
  return window.navigator.language?.toLowerCase().startsWith("en") ? "en" : "fr";
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(getInitialLang);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const toggleLang = useCallback(() => setLangState((l) => (l === "fr" ? "en" : "fr")), []);

  const t = useCallback(
    (fr: string) => {
      if (lang === "fr") return fr;
      return en[fr] ?? fr;
    },
    [lang],
  );

  const value = useMemo(() => ({ lang, setLang, toggleLang, t }), [lang, setLang, toggleLang, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useI18n = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useI18n must be used within a LanguageProvider");
  return ctx;
};
