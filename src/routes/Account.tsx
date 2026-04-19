export function Account() {
  return (
    <div className="max-w-[720px]">
      <h1 className="text-[24px] font-medium tracking-tight">Account</h1>

      <section className="mt-8 grid grid-cols-2 gap-3">
        <Figure n="1,284" l="proofs this month" />
        <Figure n="41,907" l="words corrected" />
        <Figure n="3.2s" l="median turnaround" />
        <Figure n="97.1%" l="acceptance rate" />
      </section>

      <section className="mt-10">
        <h2 className="text-[13px] font-medium text-[var(--text-soft)] uppercase tracking-[0.08em] mb-4">
          Repeat mistakes
        </h2>
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] divide-y divide-[var(--border)]">
          {[
            ["their / they're", 42],
            ["recieve → receive", 29],
            ["teh → the", 24],
            ["weather / whether", 17],
          ].map(([w, n]) => (
            <div
              key={w}
              className="flex items-center justify-between px-5 py-3 text-[13.5px]"
            >
              <span className="text-[var(--text)]">{w}</span>
              <span className="font-mono text-[12px] text-[var(--text-faint)]">×{n}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-[13px] font-medium text-[var(--text-soft)] uppercase tracking-[0.08em] mb-4">
          Device
        </h2>
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] divide-y divide-[var(--border)]">
          <div className="px-5 py-3.5 flex items-center justify-between gap-4">
            <span className="text-[13px] text-[var(--text-soft)]">Token</span>
            <span className="font-mono text-[12px] text-[var(--text)] truncate">
              prfrd_d2a94b1f7e00_KitN
            </span>
          </div>
          <div className="px-5 py-3.5 flex items-center justify-between">
            <span className="text-[13px] text-[var(--text-soft)]">Plan</span>
            <span className="text-[13px] text-[var(--text)]">Editor-in-Chief</span>
          </div>
        </div>
      </section>
    </div>
  );
}

function Figure({ n, l }: { n: string; l: string }) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-5 py-4">
      <div className="text-[24px] font-medium tracking-tight tabular-nums">{n}</div>
      <div className="text-[12px] text-[var(--text-soft)] mt-1">{l}</div>
    </div>
  );
}
