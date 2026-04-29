import { useState, useEffect } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Cookie, X, Shield } from "lucide-react";
import { useLanguage } from "../i18n/LanguageProvider";

const COOKIE_KEY = "agrione_cookie_consent";

const translations = {
  ro: {
    title: "Folosim cookie-uri",
    description:
      "Acest site folosește cookie-uri pentru a-ți oferi cea mai bună experiență. Cookie-urile esențiale sunt necesare pentru funcționarea site-ului, iar cele analitice ne ajută să îmbunătățim platforma.",
    accept: "Acceptă toate",
    essentialOnly: "Doar esențiale",
    learnMore: "Politica de cookie-uri",
  },
  en: {
    title: "We use cookies",
    description:
      "This site uses cookies to give you the best experience. Essential cookies are required for the site to function, and analytics cookies help us improve the platform.",
    accept: "Accept all",
    essentialOnly: "Essential only",
    learnMore: "Cookie policy",
  },
};

export default function CookieConsent() {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(COOKIE_KEY);
      if (!consent) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const handleAccept = (type) => {
    try {
      localStorage.setItem(COOKIE_KEY, JSON.stringify({ type, date: new Date().toISOString() }));
    } catch {
      // localStorage unavailable
    }
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <Motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-0 inset-x-0 z-[9999] p-4 sm:p-6"
        >
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-card/95 backdrop-blur-xl border border-border/40 rounded-2xl shadow-2xl p-5 sm:p-6">
              {/* Close button */}
              <button
                onClick={() => handleAccept("essential")}
                className="absolute top-3 right-3 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                aria-label="Close"
              >
                <X size={16} />
              </button>

              <div className="flex flex-col sm:flex-row items-start gap-4">
                {/* Icon */}
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Cookie size={20} className="text-primary" />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground mb-1 pr-6 sm:pr-0">
                    {t.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {t.description}
                  </p>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => handleAccept("all")}
                      className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                      {t.accept}
                    </button>
                    <button
                      onClick={() => handleAccept("essential")}
                      className="px-5 py-2 rounded-xl bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors"
                    >
                      {t.essentialOnly}
                    </button>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Shield size={12} />
                      {t.learnMore}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
}
