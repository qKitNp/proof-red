import { useState } from "react";

const tones = ["neutral", "formal", "casual", "concise", "academic"] as const;

export function Settings() {
  const [tone, setTone] = useState<(typeof tones)[number]>("neutral");
  const [autostart, setAutostart] = useState(true);
  const [preview, setPreview] = useState(false);

  return (
    <div>
      <header className="border-b-2 border-[var(--ink)] pb-3">
        <h1
          className="font-display text-[64px] leading-[0.95] tracking-[-0.02em] letterpress"
          style={{ fontVariationSettings: "'opsz' 144, 'wght' 420" }}
        >
          Settings
        </h1>
        <div className="small-caps text-[11px] text-[var(--ink-soft)] mt-2">
          the house style
        </div>
      </header>

      <Section label="01" title="Shortcut">
        <Row label="Proofread selection">
          <Kbd>⌘</Kbd>
          <Kbd>⇧</Kbd>
          <Kbd>P</Kbd>
          <button className="ml-3 font-mono text-[10px] text-[var(--ink-faint)] hover:text-[var(--red)]">
            change
          </button>
        </Row>
        <Row label="Undo last proof">
          <Kbd>⌘</Kbd>
          <Kbd>⇧</Kbd>
          <Kbd>Z</Kbd>
        </Row>
      </Section>

      <Section label="02" title="Voice">
        <Row label="Default tone">
          <div className="flex flex-wrap gap-1.5">
            {tones.map((t) => (
              <button
                key={t}
                onClick={() => setTone(t)}
                className={`px-2.5 py-1 small-caps text-[10px] border transition-colors ${
                  tone === t
                    ? "border-[var(--red)] text-[var(--red)]"
                    : "border-[var(--edge)] text-[var(--ink-soft)] hover:border-[var(--ink-soft)]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </Row>
        <Row label="Target language">
          <span className="font-mono text-[12px] text-[var(--ink-soft)]">
            English (US) ↓
          </span>
        </Row>
      </Section>

      <Section label="03" title="Behaviour">
        <Toggle
          label="Launch at login"
          hint="proof·red lives in the menu bar"
          value={autostart}
          onChange={setAutostart}
        />
        <Toggle
          label="Preview before replacing"
          hint="show a HUD; Enter accepts, Esc cancels"
          value={preview}
          onChange={setPreview}
        />
      </Section>

      <Section label="04" title="Custom dictionary">
        <p className="italic text-[var(--ink-soft)] text-[14px] leading-[1.7] max-w-[52ch]">
          Words and phrases proof·red will leave untouched — names, product terms,
          deliberate coinages. Each on its own line.
        </p>
        <textarea
          defaultValue={"Anthropic\nwisprflow\nproof·red\nKitN"}
          className="mt-4 w-full min-h-[140px] bg-transparent border border-[var(--edge)] p-3 font-mono text-[12px] text-[var(--ink)] outline-none focus:border-[var(--red)]/60 resize-y"
        />
      </Section>
    </div>
  );
}

function Section({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-14">
      <div className="flex items-baseline gap-3 mb-5">
        <span className="font-mono text-[10px] tracking-[0.18em] text-[var(--red)]">
          {label}
        </span>
        <h2
          className="font-display italic text-[22px] text-[var(--ink)]"
          style={{ fontVariationSettings: "'opsz' 48, 'wght' 420" }}
        >
          {title}
        </h2>
        <div className="flex-1 h-px bg-[var(--edge)]" />
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[200px_1fr] items-center gap-6 py-2">
      <div className="text-[13px] text-[var(--ink-soft)]">{label}</div>
      <div className="flex items-center gap-1.5">{children}</div>
    </div>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex items-center justify-center min-w-[26px] h-[24px] px-1.5 font-mono text-[11px] text-[var(--ink)] bg-[var(--paper-deep)] border border-[var(--edge)] shadow-[0_1px_0_var(--edge)]">
      {children}
    </kbd>
  );
}

function Toggle({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="grid grid-cols-[1fr_auto] items-center gap-6 py-2 text-left cursor-pointer"
    >
      <div>
        <div className="text-[14px] text-[var(--ink)]">{label}</div>
        <div className="text-[12px] italic text-[var(--ink-soft)] mt-0.5">{hint}</div>
      </div>
      <div
        className={`relative h-[22px] w-[42px] border transition-colors ${
          value ? "border-[var(--red)]" : "border-[var(--edge)]"
        }`}
      >
        <span
          className={`absolute top-[2px] h-[16px] w-[16px] transition-all ${
            value ? "left-[22px] bg-[var(--red)]" : "left-[2px] bg-[var(--ink-soft)]"
          }`}
        />
      </div>
    </button>
  );
}
