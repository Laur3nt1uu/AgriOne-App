import { cva } from "class-variance-authority";
import { cn } from "./cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-light transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-primary/30 focus-visible:ring-2 active:scale-[0.98] relative overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-[0_0_25px_rgb(var(--primary)/0.30)] hover:-translate-y-0.5 border border-primary/20 backdrop-blur-sm",
        primary:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-[0_0_25px_rgb(var(--primary)/0.30)] hover:-translate-y-0.5 border border-primary/20 backdrop-blur-sm",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive/30 shadow-lg hover:shadow-[0_0_25px_rgb(var(--destructive)/0.30)] hover:-translate-y-0.5 border border-destructive/20 backdrop-blur-sm",
        outline:
          "border border-border/20 bg-card/40 backdrop-blur-xl text-foreground hover:bg-card/60 hover:border-primary/40 hover:text-primary transition-colors",
        secondary:
          "bg-secondary/60 backdrop-blur-sm text-secondary-foreground hover:bg-secondary/80 border border-border/20 hover:border-border/40",
        ghost:
          "hover:bg-card/40 hover:text-foreground backdrop-blur-sm transition-colors",
        link: "text-primary underline-offset-4 hover:underline",
        tab: "btn-tab",
      },
      size: {
        default: "h-10 px-4 py-2 has-[>svg]:px-3",
        md: "h-10 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-lg gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-12 rounded-xl px-6 has-[>svg]:px-4",
        icon: "size-10 rounded-xl",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
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
