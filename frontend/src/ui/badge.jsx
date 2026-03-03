import { cva } from "class-variance-authority";
import { cn } from "./cn";

const badgeVariants = cva(
  "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold",
  {
  variants: {
    variant: {
      default: "bg-card/60 border-border/15 text-foreground",
      success: "bg-primary/10 border-primary/25 text-primary",
      warn: "bg-warn/10 border-warn/25 text-warn",
      danger: "bg-destructive/10 border-destructive/25 text-destructive",
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
