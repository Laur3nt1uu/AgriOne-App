import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown, Check } from "lucide-react";

export function Select({
  value,
  onChange,
  options = [],
  placeholder = "Selectează",
  icon: Icon,
  className = "",
  align = "start",
}) {
  const selected = options.find((o) => String(o.value) === String(value));

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className={`h-9 inline-flex items-center gap-2 rounded-xl bg-card/50 border border-border/20 px-3 text-sm font-medium text-foreground hover:bg-card/70 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${className}`}
        >
          {Icon && <Icon size={15} className="text-muted-foreground flex-shrink-0" />}
          <span className="truncate">{selected ? selected.label : placeholder}</span>
          <ChevronDown size={15} className="text-muted-foreground ml-auto flex-shrink-0" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align={align}
          sideOffset={8}
          className="z-50 min-w-[var(--radix-dropdown-menu-trigger-width)] max-w-[92vw] max-h-[320px] overflow-y-auto rounded-2xl border border-border/30 bg-card backdrop-blur-2xl shadow-[0_16px_48px_rgba(0,0,0,0.25)] p-1.5 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2"
        >
          {options.map((o) => {
            const isActive = String(o.value) === String(value);
            return (
              <DropdownMenu.Item
                key={String(o.value)}
                onSelect={() => onChange(o.value)}
                className={`px-3 py-2 rounded-xl cursor-pointer outline-none flex items-center gap-2 text-sm transition-colors hover:bg-foreground/5 data-[highlighted]:bg-foreground/5 ${
                  isActive ? "text-primary font-semibold" : "text-foreground"
                }`}
              >
                <span className="flex-1 truncate">{o.label}</span>
                {isActive && <Check size={15} className="text-primary flex-shrink-0" />}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export default Select;
