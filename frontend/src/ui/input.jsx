import { cn } from "./cn";

export function Input({ className, type = "text", ...props }) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-xl border border-input/15 bg-[rgb(var(--input-background)/1)] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-ring/40 focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}
