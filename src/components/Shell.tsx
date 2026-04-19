import type { ReactNode } from "react";
import { useUI, type Route } from "../lib/store";

const nav: { key: Route; label: string; hint: string }[] = [
  { key: "ledger", label: "Ledger", hint: "01" },
  { key: "settings", label: "Settings", hint: "02" },
  { key: "account", label: "Account", hint: "03" },
];

export function Shell({ children }: { children: ReactNode }) {
  const { route, setRoute } = useUI();

  return (
    <div className="relative h-full grid grid-cols-[220px_1fr] text-[var(--ink)]">
      {/* left rail */}
      <aside className="relative z-10 flex flex-col justify-between border-r border-[var(--edge)] px-7 py-8 bg-[color-mix(in_srgb,var(--paper)_92%,var(--paper-deep))]">
        <div>
          <Wordmark />
          <nav className="mt-14 flex flex-col gap-1">
            {nav.map((n) => {
              const active = route === n.key;
              return (
                <button
                  key={n.key}
                  onClick={() => setRoute(n.key)}
                  className="group relative text-left flex items-baseline gap-3 py-1.5 cursor-pointer"
                >
                  <span
                    className={`font-mono text-[10px] tracking-[0.18em] ${
                      active ? "text-[var(--red)]" : "text-[var(--ink-faint)]"
                    }`}
                  >
                    {n.hint}
                  </span>
                  <span
                    className={`font-display text-[18px] tracking-tight transition-colors ${
                      active
                        ? "text-[var(--ink)]"
                        : "text-[var(--ink-soft)] group-hover:text-[var(--ink)]"
                    }`}
                    style={{ fontVariationSettings: "'opsz' 36, 'wght' 420" }}
                  >
                    {n.label}
                  </span>
                  {active && (
                    <span className="absolute -left-7 top-1/2 h-[18px] w-[3px] -translate-y-1/2 bg-[var(--red)]" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex flex-col gap-3">
          <StatusDot />
          <div className="font-mono text-[10px] leading-[1.6] text-[var(--ink-faint)]">
            <div>shortcut</div>
            <div className="text-[var(--ink-soft)]">⌘⇧P</div>
          </div>
        </div>
      </aside>

      {/* content */}
      <main className="relative z-0 h-full overflow-y-auto">
        <div className="mx-auto max-w-[720px] px-10 pt-12 pb-24">{children}</div>
      </main>
    </div>
  );
}

function Wordmark() {
  return (
    <div className="select-none">
      <div
        className="font-display text-[30px] leading-none tracking-tight letterpress"
        style={{ fontVariationSettings: "'opsz' 48, 'wght' 500" }}
      >
        proof<span className="text-[var(--red)]">·</span>red
      </div>
      <div className="mt-2 small-caps text-[10px] text-[var(--ink-faint)]">
        a proofreader at rest
      </div>
    </div>
  );
}

function StatusDot() {
  return (
    <div className="flex items-center gap-2 font-mono text-[10px] text-[var(--ink-soft)]">
      <span className="relative inline-flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--red)] opacity-40 animate-ping" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--red)]" />
      </span>
      <span className="small-caps tracking-[0.22em]">on duty</span>
    </div>
  );
}
