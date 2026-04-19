export function StatsCard() {
  const rows: { n: string; l: string }[] = [
    { n: "1,284", l: "total proofs" },
    { n: "41.9K", l: "words corrected" },
    { n: "97%", l: "acceptance rate" },
  ];
  return (
    <aside className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 w-[240px] shrink-0">
      <div className="flex flex-col gap-4">
        {rows.map((r) => (
          <div key={r.l} className="flex items-baseline gap-3">
            <div className="text-[22px] font-medium tracking-tight text-[var(--text)] tabular-nums">
              {r.n}
            </div>
            <div className="text-[12px] text-[var(--text-soft)]">{r.l}</div>
          </div>
        ))}
      </div>
    </aside>
  );
}
