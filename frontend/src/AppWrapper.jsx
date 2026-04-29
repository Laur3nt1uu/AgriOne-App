import { useEffect, lazy, Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/router";
import { prefetchCommonAppRoutes } from "./router/chunks";
import { ThemeProvider } from "./theme/ThemeProvider";
import { LanguageProvider } from "./i18n/LanguageProvider";
import CookieConsent from "./components/CookieConsent";

// Lazy load PWA provider to avoid issues in development
const PWAProvider = lazy(() =>
  import("./components/pwa/PWAProvider").then((mod) => ({
    default: mod.PWAProvider,
  })).catch(() => ({
    // Fallback if PWA module fails to load
    default: ({ children }) => children,
  }))
);

export default function AppWrapper() {
  useEffect(() => {
    const run = () => prefetchCommonAppRoutes();
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      window.requestIdleCallback(run, { timeout: 1200 });
    } else {
      setTimeout(run, 650);
    }
  }, []);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <Suspense fallback={null}>
          <PWAProvider>
            <RouterProvider router={router} />
            <CookieConsent />
          </PWAProvider>
        </Suspense>
      </LanguageProvider>
    </ThemeProvider>
  );
}
