import { useMemo } from "react";
import type { Proof } from "../lib/db";
import { useProofs } from "../lib/useProofs";
import { ProofEntry } from "../components/ProofEntry";
import { StatsCard } from "../components/StatsCard";

function groupByDay(proofs: Proof[]) {
  const groups = new Map<string, Proof[]>();
  for (const p of proofs) {
    const d = new Date(p.ts);
    d.setHours(0, 0, 0, 0);
    const label = d
      .toLocaleDateString([], { month: "long", day: "numeric", year: "numeric" })
      .toUpperCase();
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label)!.push(p);
  }
  return [...groups.entries()];
}

export function Home() {
  const proofs = useProofs((s) => s.proofs);
  const groups = useMemo(() => groupByDay(proofs), [proofs]);

  return (
    <div className="flex gap-8">
      <div className="flex-1 min-w-0">
        <h1 className="text-[24px] font-medium tracking-tight">Welcome back, Pranjal</h1>

        <section className="mt-6 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 flex items-center justify-between gap-6">
          <div>
            <div className="text-[15px] font-medium">Proofread anywhere you write</div>
            <div className="text-[13px] text-[var(--text-soft)] mt-1 max-w-[46ch]">
              Select any text, double-tap ⌃ (Control), and proof·red replaces it with a corrected
              version.
            </div>
          </div>
          <button className="shrink-0 text-[13px] px-3.5 py-2 rounded-md border border-[var(--border)] bg-[var(--bg)] hover:bg-[var(--sidebar)] cursor-pointer">
            Try it out
          </button>
        </section>

        {groups.map(([label, items]) => (
          <section key={label} className="mt-10">
            <div className="text-[11px] tracking-[0.12em] text-[var(--text-faint)] mb-3">
              {label}
            </div>
            <div className="flex flex-col gap-2">
              {items.map((p) => (
                <ProofEntry key={p.id} proof={p} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="pt-[52px] hidden lg:block">
        <StatsCard />
      </div>
    </div>
  );
}
