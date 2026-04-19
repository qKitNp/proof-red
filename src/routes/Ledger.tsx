import { useMemo } from "react";
import { seedProofs, type Proof } from "../lib/seed";
import { ProofEntry } from "../components/ProofEntry";

function groupByDay(proofs: Proof[]) {
  const groups = new Map<string, Proof[]>();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  for (const p of proofs) {
    const d = new Date(p.ts);
    d.setHours(0, 0, 0, 0);
    const label =
      d.getTime() === today.getTime()
        ? "Today"
        : d.getTime() === yesterday.getTime()
        ? "Yesterday"
        : d.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label)!.push(p);
  }
  return [...groups.entries()];
}

export function Ledger() {
  const groups = useMemo(() => groupByDay(seedProofs), []);
  const total = seedProofs.length;

  return (
    <div>
      <header className="flex items-baseline justify-between border-b-2 border-[var(--ink)] pb-3">
        <h1
          className="font-display text-[64px] leading-[0.95] tracking-[-0.02em] letterpress"
          style={{ fontVariationSettings: "'opsz' 144, 'wght' 420" }}
        >
          The Ledger
        </h1>
        <div className="text-right">
          <div className="small-caps text-[11px] text-[var(--ink-soft)]">
            {total} proofs · today
          </div>
          <div className="font-mono text-[10px] text-[var(--ink-faint)] mt-1">
            vol. i · no. 01
          </div>
        </div>
      </header>

      <div className="mt-3 flex items-center gap-3 text-[10px] font-mono text-[var(--ink-faint)]">
        <span>— all —</span>
        <span>slack · {seedProofs.filter((p) => p.sourceApp === "Slack").length}</span>
        <span>mail · {seedProofs.filter((p) => p.sourceApp === "Mail").length}</span>
        <span>notes · {seedProofs.filter((p) => p.sourceApp === "Notes").length}</span>
      </div>

      {groups.map(([label, items]) => (
        <section key={label} className="mt-14">
          <div className="mb-4 flex items-center gap-4">
            <h2
              className="font-display italic text-[22px] text-[var(--ink-soft)]"
              style={{ fontVariationSettings: "'opsz' 48, 'wght' 380" }}
            >
              {label}
            </h2>
            <div className="flex-1 h-px bg-[var(--edge)]" />
            <span className="font-mono text-[10px] text-[var(--ink-faint)]">
              {items.length.toString().padStart(2, "0")}
            </span>
          </div>
          <div>
            {items.map((p, i) => (
              <ProofEntry key={p.id} proof={p} index={i} />
            ))}
          </div>
        </section>
      ))}

      <footer className="mt-24 flex justify-center">
        <RegisterMark />
      </footer>
    </div>
  );
}

function RegisterMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" className="text-[var(--ink-faint)]">
      <circle cx="14" cy="14" r="9" fill="none" stroke="currentColor" strokeWidth="1" />
      <line x1="14" y1="0" x2="14" y2="28" stroke="currentColor" strokeWidth="1" />
      <line x1="0" y1="14" x2="28" y2="14" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
