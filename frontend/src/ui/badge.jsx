import { cva } from "class-variance-authority";
import { cn } from "./cn";

const badgeVariants = cva("badge", {
  variants: {
    variant: {
      default: "",
      success: "badge-success",
      warn: "badge-warn",
      danger: "badge-danger",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export function Badge({ className, variant, ...props }) {
  const { as: Comp = "span", ...rest } = props;
  return <Comp className={cn(badgeVariants({ variant }), className)} {...rest} />;
}
