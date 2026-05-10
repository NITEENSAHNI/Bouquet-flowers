const LABELS = ["Pick", "Arrange", "Message", "Send"];

export function StepProgress({ step }: { step: number }) {
  const pct = ((step - 1) / (LABELS.length - 1)) * 100;
  return (
    <div className="w-full">
      <div className="flex justify-between mb-2 px-1">
        {LABELS.map((l, i) => (
          <span
            key={l}
            className={`text-xs font-medium tracking-wide uppercase transition-colors ${
              i + 1 <= step ? "text-[color:var(--primary)]" : "text-muted-foreground/60"
            }`}
          >
            {l}
          </span>
        ))}
      </div>
      <div className="h-1.5 w-full rounded-full bg-rose-100/70 overflow-hidden">
        <div
          className="h-full bg-[color:var(--primary)] transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}