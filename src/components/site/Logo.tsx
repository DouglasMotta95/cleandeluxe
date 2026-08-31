import { cn } from "@/lib/utils";

export function Logo({ inverted = false, className }: { inverted?: boolean; className?: string }) {
  return (
    <div className={cn("inline-flex flex-col leading-none", className)} aria-label="NUVE Advanced Skin Care">
      <span
        className={cn(
          "font-display text-[1.55rem] font-semibold tracking-[0.28em]",
          inverted ? "text-white" : "text-foreground",
        )}
      >
        NUVE
      </span>
      <span
        className={cn(
          "mt-1 text-[0.5rem] font-medium tracking-[0.32em] uppercase",
          inverted ? "text-white/65" : "text-muted-foreground",
        )}
      >
        Advanced Skin Care
      </span>
    </div>
  );
}
