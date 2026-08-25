export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span
        className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border ${
          inverted ? "border-accent/60 text-accent" : "border-primary/25 text-primary"
        }`}
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M12 3c3.6 3.4 5.5 6.1 5.5 8.7A5.5 5.5 0 0 1 12 17.2a5.5 5.5 0 0 1-5.5-5.5C6.5 9.1 8.4 6.4 12 3Z" />
          <path d="M9.5 20.5h5" strokeLinecap="round" />
        </svg>
      </span>
      <span className="leading-none">
        <span
          className={`block font-display text-[1.05rem] tracking-[0.18em] uppercase ${
            inverted ? "text-white" : "text-foreground"
          }`}
        >
          Clean Deluxe
        </span>
        <span
          className={`mt-0.5 block text-[0.6rem] tracking-[0.28em] uppercase ${
            inverted ? "text-white/60" : "text-muted-foreground"
          }`}
        >
          Limpeza profissional
        </span>
      </span>
    </span>
  );
}
