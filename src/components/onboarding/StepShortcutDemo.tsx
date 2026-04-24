import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { listen } from "@tauri-apps/api/event";
import { Check } from "lucide-react";

const SAMPLE = "their going too the stor tommorow to by som bred.";

export function StepShortcutDemo({ onFinish }: { onFinish: () => void }) {
  const [text, setText] = useState(SAMPLE);
  const [proofing, setProofing] = useState(false);
  const [done, setDone] = useState(false);
  const ref = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    ref.current?.focus();
    ref.current?.select();
  }, []);

  useEffect(() => {
    const unlisten = listen("doubletap-rshift", () => {
      setProofing(true);
    });
    return () => {
      unlisten.then((fn) => fn());
    };
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const next = e.target.value;
    setText(next);
    if (next.trim() && next !== SAMPLE && proofing) {
      setProofing(false);
      setDone(true);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center text-center gap-7"
    >
      <div>
        <h1 className="text-[26px] font-medium tracking-tight leading-tight">
          Try the shortcut
        </h1>
        <p className="mt-3 text-[13.5px] text-[var(--text-soft)] leading-relaxed max-w-[440px] mx-auto">
          Select the sentence below, then double-tap{" "}
          <Kbd>⇧</Kbd> Right Shift. proof·red will rewrite it in place.
        </p>
      </div>

      <textarea
        ref={ref}
        value={text}
        onChange={handleChange}
        rows={3}
        className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 text-[14px] leading-relaxed text-[var(--text)] outline-none focus:border-[var(--accent)] transition-colors resize-none font-mono"
      />

      <div className="h-6 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {done ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-[12.5px] text-green-600"
            >
              <Check size={14} strokeWidth={2} />
              <span>Nice — you're ready.</span>
            </motion.div>
          ) : proofing ? (
            <motion.div
              key="proofing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-[12.5px] text-[var(--text-soft)]"
            >
              <span className="inline-block h-[8px] w-[8px] rounded-full bg-[var(--accent)] animate-pulse" />
              <span>Proofreading…</span>
            </motion.div>
          ) : (
            <motion.div
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-[12px] text-[var(--text-faint)]"
            >
              <Kbd>⇧</Kbd>
              <span>then</span>
              <Kbd>⇧</Kbd>
              <span className="ml-1">within 300ms</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button
        onClick={onFinish}
        className="px-6 py-2.5 rounded-lg bg-[var(--accent)] text-white text-[13.5px] font-medium hover:opacity-90 transition-opacity cursor-pointer"
      >
        {done ? "Finish" : "I'll try later"}
      </button>
    </motion.div>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex items-center justify-center min-w-[22px] h-[20px] px-1.5 font-mono text-[11px] text-[var(--text)] bg-[var(--bg)] border border-[var(--border)] rounded">
      {children}
    </kbd>
  );
}
