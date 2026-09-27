import { createContext, useContext, useState, type ReactNode } from "react";
export type Lang = "pl" | "en" | "da" | "de";
type LanguageContextType = { lang: Lang; setLang: (l: Lang) => void };
const LanguageContext = createContext<LanguageContextType>({
  lang: "pl",
  setLang: () => {},
});
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const stored = localStorage.getItem("lang");
      return ["pl", "en", "da", "de"].includes(stored || "")
        ? (stored as Lang)
        : "pl";
    } catch {
      return "pl";
    }
  });
  const setLang = (l: Lang) => {
    try {
      localStorage.setItem("lang", l);
    } catch {}
    setLangState(l);
  };
  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}
export const useLanguage = () => useContext(LanguageContext);
