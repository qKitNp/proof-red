import { useState } from "react";

export function Settings() {
  const [autostart, setAutostart] = useState(true);
  const [preview, setPreview] = useState(false);

  return (
    <div className="max-w-[720px]">
      <h1 className="text-[24px] font-medium tracking-tight">Settings</h1>

      <Section title="Shortcut">
        <Row label="Proofread selection">
          <div className="flex items-center gap-1.5">
            <Kbd>⌘</Kbd>
            <Kbd>⇧</Kbd>
            <Kbd>P</Kbd>
            <button className="ml-3 text-[12px] text-[var(--text-faint)] hover:text-[var(--accent)]">
              change
            </button>
          </div>
        </Row>
        <Row label="Undo last proof">
          <div className="flex items-center gap-1.5">
            <Kbd>⌘</Kbd>
            <Kbd>⇧</Kbd>
            <Kbd>Z</Kbd>
          </div>
        </Row>
      </Section>

      <Section title="Behaviour">
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

      <Section title="Custom dictionary">
        <p className="text-[13px] text-[var(--text-soft)] max-w-[52ch]">
          Words and phrases proof·red will leave untouched. One per line.
        </p>
        <textarea
          defaultValue={"Anthropic\nwisprflow\nproof·red\nKitN"}
          className="mt-3 w-full min-h-[140px] rounded-md bg-[var(--surface)] border border-[var(--border)] p-3 font-mono text-[12.5px] text-[var(--text)] outline-none focus:border-[var(--text-faint)] resize-y"
        />
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-[13px] font-medium text-[var(--text-soft)] uppercase tracking-[0.08em] mb-4">
        {title}
      </h2>
      <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] divide-y divide-[var(--border)]">
        {children}
      </div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-6 px-5 py-3.5">
      <div className="text-[13.5px] text-[var(--text)]">{label}</div>
      <div>{children}</div>
    </div>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex items-center justify-center min-w-[26px] h-[24px] px-1.5 font-mono text-[11px] text-[var(--text)] bg-[var(--bg)] border border-[var(--border)] rounded">
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
    <div className="grid grid-cols-[1fr_auto] items-center gap-6 px-5 py-3.5">
      <div>
        <div className="text-[13.5px] text-[var(--text)]">{label}</div>
        <div className="text-[12px] text-[var(--text-soft)] mt-0.5">{hint}</div>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative h-[22px] w-[38px] rounded-full transition-colors cursor-pointer ${
          value ? "bg-[var(--accent)]" : "bg-[var(--border)]"
        }`}
      >
        <span
          className={`absolute top-[2px] h-[18px] w-[18px] rounded-full bg-white shadow-sm transition-all ${
            value ? "left-[18px]" : "left-[2px]"
          }`}
        />
      </button>
    </div>
  );
}
