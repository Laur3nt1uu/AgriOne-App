import { cva } from "class-variance-authority";
import { cn } from "./cn";

const badgeVariants = cva(
  "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-sm",
  {
  variants: {
    variant: {
      default: "bg-card/60 border-border/15 text-foreground",
      primary: "bg-primary/10 border-primary/25 text-primary",
      success: "bg-primary/10 border-primary/25 text-primary",
      warn: "bg-warn/10 border-warn/25 text-warn",
      danger: "bg-destructive/10 border-destructive/25 text-destructive",
      outline: "bg-transparent border-border/40 text-muted-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
  }
);

export function Badge({ className, variant, ...props }) {
  const { as: Comp = "span", ...rest } = props;
  return <Comp className={cn(badgeVariants({ variant }), className)} {...rest} />;
}
