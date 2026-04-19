export function Account() {
  return (
    <div>
      <header className="border-b-2 border-[var(--ink)] pb-3">
        <h1
          className="font-display text-[64px] leading-[0.95] tracking-[-0.02em] letterpress"
          style={{ fontVariationSettings: "'opsz' 144, 'wght' 420" }}
        >
          Account
        </h1>
        <div className="small-caps text-[11px] text-[var(--ink-soft)] mt-2">
          the subscription desk
        </div>
      </header>

      <section className="mt-14 grid grid-cols-2 gap-10">
        <Figure n="1,284" l="proofs this month" />
        <Figure n="41,907" l="words corrected" />
        <Figure n="3.2s" l="median turnaround" />
        <Figure n="97.1%" l="acceptance rate" />
      </section>

      <section className="mt-16">
        <h2
          className="font-display italic text-[22px] mb-4"
          style={{ fontVariationSettings: "'opsz' 48, 'wght' 420" }}
        >
          Repeat offenders
        </h2>
        <ul className="flex flex-col gap-2">
          {[
            ["their / they're", 42],
            ["recieve → receive", 29],
            ["teh → the", 24],
            ["weather / whether", 17],
          ].map(([w, n]) => (
            <li
              key={w}
              className="grid grid-cols-[1fr_auto_60px] items-baseline gap-4 py-2 border-b border-[var(--edge)] border-dotted"
            >
              <span className="italic text-[var(--ink)]">{w}</span>
              <span className="flex-1 h-px" />
              <span className="font-mono text-[12px] text-[var(--red)] text-right">
                ×{n}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16 border border-[var(--edge)] p-6">
        <div className="small-caps text-[10px] text-[var(--ink-faint)]">
          device token
        </div>
        <div className="mt-2 font-mono text-[12px] text-[var(--ink-soft)] break-all">
          prfrd_d2a94b1f7e00_KitN
        </div>
        <div className="mt-5 flex items-center justify-between">
          <span className="small-caps text-[10px] text-[var(--ink-faint)]">plan</span>
          <span className="font-display text-[20px] italic text-[var(--red)]">
            Editor-in-Chief
          </span>
        </div>
      </section>
    </div>
  );
}

function Figure({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <div
        className="font-display text-[52px] leading-none tracking-tight letterpress"
        style={{ fontVariationSettings: "'opsz' 144, 'wght' 400" }}
      >
        {n}
      </div>
      <div className="small-caps text-[10.5px] text-[var(--ink-soft)] mt-2">{l}</div>
    </div>
  );
}
