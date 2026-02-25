import { cva } from "class-variance-authority";
import { cn } from "./cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary: "btn-primary",
        ghost: "btn-ghost",
        tab: "btn-tab",
      },
      size: {
        md: "",
        sm: "text-sm px-3 py-2 rounded-xl",
        lg: "px-5 py-3",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "ghost",
      size: "md",
      fullWidth: false,
    },
  }
);

export function Button({
  className,
  variant,
  size,
  fullWidth,
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      {...props}
    />
  );
}
