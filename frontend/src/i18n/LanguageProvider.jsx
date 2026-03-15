import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { languageStore } from "./language.store";
import ro from "./translations/ro";
import en from "./translations/en";

const translations = { ro, en };
const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLangState] = useState(() => languageStore.initLanguage());

  useEffect(() => { languageStore.initLanguage(); }, []);

  const setLanguage = (lang) => {
    const applied = languageStore.setLanguage(lang);
    setLangState(applied);
  };

  const toggleLanguage = () => {
    const applied = languageStore.toggleLanguage();
    setLangState(applied);
  };

  const t = useCallback((key) => {
    const keys = key.split(".");
    let result = translations[language];
    for (const k of keys) {
      result = result?.[k];
    }
    return result ?? key;
  }, [language]);

  const value = useMemo(
    () => ({ language, setLanguage, toggleLanguage, t }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [language, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}