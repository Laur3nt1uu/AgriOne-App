import { createContext, useContext, useMemo, useRef, useState } from "react";
import { Button } from "../../ui/button";

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const resolverRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [opts, setOpts] = useState(null);

  const confirm = (options = {}) => {
    const normalized = {
      title: options.title || "Confirmare",
      message: options.message || "Ești sigur?",
      confirmText: options.confirmText || "Confirmă",
      cancelText: options.cancelText || "Renunță",
      destructive: !!options.destructive,
    };

    return new Promise((resolve) => {
      resolverRef.current = resolve;
      setOpts(normalized);
      setOpen(true);
    });
  };

  const close = (result) => {
    const resolve = resolverRef.current;
    resolverRef.current = null;
    setOpen(false);
    setOpts(null);
    try {
      resolve?.(!!result);
    } catch {
      // ignore
    }
  };

  const value = useMemo(() => ({ confirm }), []);

  return (
    <ConfirmContext.Provider value={value}>
      {children}

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close(false);
          }}
        >
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
          <div className="relative w-full max-w-md card p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-lg font-extrabold">{opts?.title || "Confirmare"}</div>
                <div className="muted text-sm mt-1 whitespace-pre-line">{opts?.message || "Ești sigur?"}</div>
              </div>
              <Button type="button" variant="ghost" onClick={() => close(false)} title="Închide">
                ✕
              </Button>
            </div>

            <div className="mt-5 flex gap-2 justify-end">
              <Button type="button" variant="ghost" onClick={() => close(false)}>
                {opts?.cancelText || "Renunță"}
              </Button>
              <Button
                type="button"
                variant={opts?.destructive ? "destructive" : "primary"}
                onClick={() => close(true)}
              >
                {opts?.confirmText || "Confirmă"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx?.confirm) throw new Error("useConfirm must be used within ConfirmProvider");
  return ctx.confirm;
}
