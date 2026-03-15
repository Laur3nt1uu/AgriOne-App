import { useEffect, useState, useRef } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Download, RefreshCw, Wifi, WifiOff, X, Smartphone } from "lucide-react";
import { Button } from "../../ui/button";

/**
 * PWA Provider - handles service worker updates, install prompts, and offline status
 */
export function PWAProvider({ children }) {
  const [isOnline, setIsOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [needRefresh, setNeedRefresh] = useState(false);
  const updateSWRef = useRef(null);

  // Initialize SW registration
  useEffect(() => {
    let mounted = true;

    const initSW = async () => {
      try {
        // Dynamic import only works in production build
        const { registerSW } = await import("virtual:pwa-register");
        if (!mounted) return;

        const updateServiceWorker = registerSW({
          onNeedRefresh() {
            if (mounted) setNeedRefresh(true);
          },
          onOfflineReady() {
            console.log("[PWA] App ready for offline use");
          },
          onRegisteredSW(swUrl, r) {
            console.log("[PWA] Service Worker registered:", swUrl);
            // Check for updates periodically
            if (r) {
              setInterval(() => {
                r.update();
              }, 60 * 60 * 1000); // hourly
            }
          },
          onRegisterError(error) {
            console.error("[PWA] Service Worker registration error:", error);
          },
        });

        updateSWRef.current = updateServiceWorker;
      } catch (e) {
        // PWA not available (dev mode or import failed)
        if (import.meta.env.DEV) {
          console.log("[PWA] Service Worker not available in development mode");
        }
      }
    };

    initSW();
    return () => { mounted = false; };
  }, []);

  // Online/Offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // PWA Install prompt
  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show after some user engagement (30s)
      setTimeout(() => {
        setShowInstallPrompt(true);
      }, 30000);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
      console.log("[PWA] App was installed");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log("[PWA] Install prompt outcome:", outcome);

      if (outcome === "accepted") {
        setIsInstalled(true);
      }
    } catch (err) {
      console.error("[PWA] Install error:", err);
    } finally {
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    }
  };

  const handleUpdate = () => {
    if (updateSWRef.current) {
      updateSWRef.current(true);
    }
  };

  return (
    <>
      {children}

      {/* Offline Indicator */}
      <AnimatePresence>
        {!isOnline && (
          <Motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-[100] bg-amber-500 text-amber-950 px-4 py-2"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-sm font-medium">
              <WifiOff className="w-4 h-4" />
              <span>Ești offline. Datele afișate pot fi mai vechi.</span>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>

      {/* Update Available Toast */}
      <AnimatePresence>
        {needRefresh && (
          <Motion.div
            initial={{ y: 100, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.9 }}
            className="fixed bottom-24 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-96 z-[100]"
          >
            <div className="bg-card border border-border/30 rounded-2xl shadow-2xl p-4 backdrop-blur-xl">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                  <RefreshCw className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground">Actualizare disponibilă</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    O versiune nouă a aplicației este disponibilă.
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleUpdate}
                      className="text-xs"
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Actualizează acum
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setNeedRefresh(false)}
                      className="text-xs"
                    >
                      Mai târziu
                    </Button>
                  </div>
                </div>
                <button
                  onClick={() => setNeedRefresh(false)}
                  className="p-1 rounded-lg hover:bg-foreground/5 text-muted-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>

      {/* Install Prompt */}
      <AnimatePresence>
        {showInstallPrompt && !isInstalled && deferredPrompt && (
          <Motion.div
            initial={{ y: 100, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.9 }}
            className="fixed bottom-24 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-96 z-[100]"
          >
            <div className="bg-card border border-primary/20 rounded-2xl shadow-2xl p-4 backdrop-blur-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />

              <div className="relative flex items-start gap-3">
                <div className="p-2 rounded-xl bg-primary/15 border border-primary/25">
                  <Smartphone className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground">Instalează AgriOne</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Adaugă aplicația pe ecranul de start pentru acces rapid și funcții offline.
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleInstall}
                      className="text-xs"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Instalează
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowInstallPrompt(false)}
                      className="text-xs"
                    >
                      Nu acum
                    </Button>
                  </div>
                </div>
                <button
                  onClick={() => setShowInstallPrompt(false)}
                  className="p-1 rounded-lg hover:bg-foreground/5 text-muted-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>

      {/* Online restored toast */}
      <OnlineRestoredToast isOnline={isOnline} />
    </>
  );
}

/**
 * Shows a brief toast when coming back online
 */
function OnlineRestoredToast({ isOnline }) {
  const [showRestored, setShowRestored] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
    } else if (wasOffline && isOnline) {
      setShowRestored(true);
      setWasOffline(false);
      const timer = setTimeout(() => setShowRestored(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  return (
    <AnimatePresence>
      {showRestored && (
        <Motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-[100] bg-primary text-primary-foreground px-4 py-2"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-sm font-medium">
            <Wifi className="w-4 h-4" />
            <span>Conexiune restabilită</span>
          </div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Hook to check if app is installed as PWA
 */
export function useIsPWA() {
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    const check = () => {
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
      const isIOSStandalone = ("standalone" in navigator) && navigator.standalone;
      setIsPWA(isStandalone || isIOSStandalone);
    };

    check();
    const mq = window.matchMedia("(display-mode: standalone)");
    mq.addEventListener("change", check);

    return () => mq.removeEventListener("change", check);
  }, []);

  return isPWA;
}

/**
 * Hook to check online status
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
}
