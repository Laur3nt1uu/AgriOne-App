import { useEffect, lazy, Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/router";
import { prefetchCommonAppRoutes } from "./router/chunks";
import { ThemeProvider } from "./theme/ThemeProvider";
import { LanguageProvider } from "./i18n/LanguageProvider";
import ConsentBanner from "./components/ConsentBanner";

const PWAProvider = lazy(() =>
  import("./components/pwa/PWAProvider").then((mod) => ({
    default: mod.PWAProvider,
  })).catch(() => ({
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
            <ConsentBanner />
          </PWAProvider>
        </Suspense>
      </LanguageProvider>
    </ThemeProvider>
  );
}
