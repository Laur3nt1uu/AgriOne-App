import { cn } from "./cn";

export function Input({ className, type = "text", ...props }) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full min-w-0 rounded-xl border border-input/15 backdrop-blur-xl bg-card/40 px-4 py-3 text-sm text-foreground font-light placeholder:text-muted-foreground/50 selection:bg-primary selection:text-primary-foreground outline-none transition-all duration-300 focus:border-ring/40 focus:ring-2 focus:ring-ring/20 focus-visible:shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:border-primary/40 hover:bg-card/50 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}
