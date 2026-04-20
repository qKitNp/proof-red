import { useState } from "react";

export function Settings() {
  const [autostart, setAutostart] = useState(true);
  const [preview, setPreview] = useState(false);

  return (
    <div className="max-w-[720px]">
      <h1 className="text-[24px] font-medium tracking-tight">Settings</h1>

      <Section title="Shortcut">
        <Row label="Proofread selection">
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1.5">
              <Kbd>⇧</Kbd>
              <span className="text-[11px] text-[var(--text-faint)]">then</span>
              <Kbd>⇧</Kbd>
            </div>
            <div className="text-[11px] text-[var(--text-faint)]">
              Double-tap Right Shift within 300ms
            </div>
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
        <CustomDictionary />
      </Section>
    </div>
  );
}

function CustomDictionary() {
  const [words, setWords] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const add = (raw: string) => {
    const word = raw.trim().replace(/,+$/, "").trim();
    if (word && !words.includes(word)) setWords((w) => [...w, word]);
    setInput("");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { e.preventDefault(); add(input); }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.endsWith(",")) { add(val); } else { setInput(val); }
  };

  return (
    <>
      <div className="px-5 py-4 min-h-[80px] flex flex-wrap gap-2 items-start">
        {words.length === 0 && (
          <span className="text-[12px] text-[var(--text-faint)] select-none">
            No words yet — add one below
          </span>
        )}
        {words.map((w) => (
          <span
            key={w}
            className="inline-flex items-center gap-1.5 bg-[var(--bg)] border border-[var(--border)] rounded-full px-2.5 py-0.5 text-[12px] font-mono text-[var(--text)]"
          >
            {w}
            <button
              onClick={() => setWords((ws) => ws.filter((x) => x !== w))}
              className="text-[var(--text-faint)] hover:text-[var(--text)] leading-none cursor-pointer"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="px-5 py-3">
        <input
          value={input}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder="Add a word or phrase…"
          className="w-full bg-transparent text-[13px] text-[var(--text)] placeholder:text-[var(--text-faint)] outline-none"
        />
      </div>
    </>
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
